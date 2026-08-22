# BẢN IN NỘP KÈM — MÔ HÌNH DEVOPS CỦA NHÓM LIBIF

## 1. Kịch bản khởi tạo và cấu hình tài nguyên hạ tầng

### 1.1 Luồng khởi tạo hạ tầng

    Kỹ sư vận hành
          │
          │ scripts/azure/provision.sh
          ▼
    Azure Resource Group Deployment
          │
          │ infra/azure/main.bicep
          ▼
    ┌──────────┬───────────┬────────────┬──────────────┐
    │ Network  │ Ubuntu VM │ Data disk  │ OIDC Identity│
    │ + NSG    │ + NIC/IP  │ + Docker   │ + VM role    │
    └──────────┴─────┬─────┴────────────┴──────────────┘
                     │
                     │ infra/azure/cloud-init.yml
                     ▼
              Docker host sẵn sàng

Kịch bản biến việc tạo tài nguyên Azure thành cấu hình có version trong Git, có thể review và chạy lặp lại thay vì phụ thuộc thao tác thủ công trên Portal.

### 1.2 Tham số triển khai Azure

Các tham số chính của Bicep template:

    location:           Azure region, mặc định theo Resource Group
    namePrefix:         libif-prod
    publicDnsLabel:     libif-schooleo-prod
    githubRepository:   Schooleo/LIBIF
    githubEnvironment:  production
    vmSize:             Standard_B2als_v2 hoặc Standard_B2as_v2
    adminUsername:      libifadmin
    sshPublicKey:       public key, không nhận private key
    sshAllowedCidr:     IP/CIDR được phép SSH
    dataDiskSizeGB:     128 GB mặc định

Các tham số giúp cùng một template thích nghi với subscription/region mà không sửa trực tiếp định nghĩa tài nguyên.

### 1.3 Network và security configuration

Bicep tạo Network Security Group với các rule:

    AllowHttps
      protocol: TCP
      destination port: 443
      source: Internet

    AllowHttpForAcmeAndRedirect
      protocol: TCP
      destination port: 80
      source: Internet

    AllowHttp3
      protocol: UDP
      destination port: 443
      source: Internet

    AllowRestrictedSsh
      protocol: TCP
      destination port: 22
      source: sshAllowedCidr

Virtual network configuration:

    VNet:    10.40.0.0/16
    Subnet:  10.40.1.0/24
    NSG:     gắn vào application subnet

Static public IP được gắn Azure-managed DNS label:

    <publicDnsLabel>.eastasia.cloudapp.azure.com

Mục đích: chỉ public các cổng edge cần thiết, giới hạn SSH về nguồn tin cậy và cung cấp endpoint ổn định mà không cần mua domain.

### 1.4 Virtual Machine và persistent storage

Bicep khai báo:

    Operating system: Ubuntu 24.04 LTS
    Authentication:   SSH key only
    OS disk:          30 GB Standard SSD, xóa cùng VM
    Data disk:        128 GB Standard SSD, detach khi xóa VM
    Boot diagnostics: enabled

NIC nối VM với application subnet và static public IP. Data disk tách Docker image/volume, PostgreSQL và MinIO data khỏi OS disk để vòng đời dữ liệu không hoàn toàn phụ thuộc VM.

### 1.5 GitHub OIDC identity

Bicep tạo user-assigned Managed Identity và federated credential:

    issuer:
      https://token.actions.githubusercontent.com

    subject:
      repo:Schooleo/LIBIF:environment:production

    audience:
      api://AzureADTokenExchange

Identity chỉ được gán quyền **Virtual Machine Contributor** tại scope của LIBIF VM. Production workflow nhận access ngắn hạn qua OIDC thay vì lưu Azure client secret dài hạn trong GitHub.

### 1.6 Bootstrap Linux host bằng cloud-init

Kịch bản cloud-init thực hiện:

    package_update: true
    package_upgrade: true

    format data disk:
      filesystem: ext4
      label: libif-data

    mount:
      LABEL=libif-data → /srv/libif

    install packages:
      ca-certificates
      curl
      docker-compose-v2
      docker.io
      git
      jq

    create directories:
      /etc/libif
      /opt/libif
      /srv/libif/docker

    configure Docker:
      data-root: /srv/libif/docker
      log max-size: 10m
      log max-file: 3

    configure host:
      enable Docker
      apply sysctl
      create 4 GB swap file

Mục đích: VM mới tự đạt cùng một baseline vận hành, có Docker/Compose, persistent disk và log rotation mà không yêu cầu cài thủ công từng bước.

### 1.7 Provision script dành cho kỹ sư vận hành

Đầu vào:

    scripts/azure/provision.sh \
      <ssh-public-key-file> \
      <trusted-ssh-cidr>

Luồng kiểm tra và triển khai:

    1. Kiểm tra Azure CLI và jq đã cài.
    2. Kiểm tra public key tồn tại.
    3. Kiểm tra SSH source đúng định dạng IPv4 CIDR.
    4. Xác nhận đã az login và chọn subscription.
    5. Compile main.bicep để phát hiện lỗi template.
    6. Tạo Resource Group.
    7. Chạy az deployment group create.
    8. In deployment outputs để cấu hình GitHub environment.

Các lệnh cốt lõi:

    az account show --output none

    az bicep build \
      --file infra/azure/main.bicep \
      --stdout

    az group create \
      --name libif-production \
      --location eastasia

    az deployment group create \
      --resource-group libif-production \
      --template-file infra/azure/main.bicep \
      --parameters \
        namePrefix=libif-prod \
        publicDnsLabel=libif-schooleo-prod \
        githubRepository=Schooleo/LIBIF \
        vmSize=Standard_B2als_v2 \
        sshPublicKey=<public-key> \
        sshAllowedCidr=<trusted-ip>/32

Các output được dùng cho protected GitHub production environment:

    deployClientId      → AZURE_CLIENT_ID
    tenantId            → AZURE_TENANT_ID
    subscriptionId      → AZURE_SUBSCRIPTION_ID
    resourceGroupName   → AZURE_RESOURCE_GROUP
    vmName              → AZURE_VM_NAME
    publicDnsName       → LIBIF_API_HOSTNAME

AZURE_DEPLOY_ENABLED được giữ false cho đến khi VM environment, image access và endpoint đều được kiểm chứng.

## 2. Hệ thống thư mục và file hỗ trợ quản lý hạ tầng

    LIBIF/
    ├── .github/
    │   ├── workflows/
    │   │   ├── api-ci.yml
    │   │   ├── web-ci.yml
    │   │   ├── staging.yml
    │   │   ├── production.yml
    │   │   ├── ci-email.yml
    │   │   └── cd-email.yml
    │   └── scripts/
    │       ├── npm-ci-with-retry.sh
    │       └── send-ci-result-email.py
    │
    ├── infra/azure/
    │   ├── main.bicep
    │   └── cloud-init.yml
    │
    ├── docker/
    │   ├── api.Dockerfile
    │   ├── web.Dockerfile
    │   ├── caddy/
    │   │   ├── Caddyfile
    │   │   └── azure.Caddyfile
    │   ├── nginx/
    │   │   └── staging.conf
    │   └── tailscale/
    │       └── funnel.json
    │
    ├── scripts/
    │   ├── azure/
    │   │   ├── provision.sh
    │   │   └── deploy.sh
    │   └── staging/
    │       └── pin-main-release.sh
    │
    ├── apps/api/prisma/
    │   ├── schema.prisma
    │   └── migrations/
    │
    ├── apps/web/vercel.json
    ├── docker-compose.yml
    ├── docker-compose.staging.yml
    ├── docker-compose.production.yml
    ├── docker-compose.azure.yml
    ├── .env.example
    ├── .env.staging.example
    ├── .env.azure.production.example
    └── Makefile

## 3. Vai trò của từng nhóm file trong DevOps model

| Nhóm file | WHAT | WHY |
|---|---|---|
| GitHub workflows | Chạy CI, publish artifact, deploy và gửi email | Pipeline tự động, có trigger và execution log rõ ràng |
| infra/azure | Tạo cloud resources và bootstrap VM | Infrastructure as Code có version, review và tái lập được |
| Dockerfiles | Build API/Web runtime image | Artifact giống nhau giữa các môi trường |
| Compose files | Định nghĩa service, dependency, network, volume, health check | Tách runtime topology của dev, staging và production |
| Edge configs | Nginx/Tailscale cho staging; Caddy cho production | Một ingress HTTPS rõ ràng cho từng môi trường |
| Deployment scripts | Chọn SHA/version, validate và gọi platform/Compose | Giảm sai thao tác và không deploy nhầm artifact |
| Prisma migrations | Version database schema | Application và database thay đổi có kiểm soát |
| Environment examples | Khai báo biến cấu hình bắt buộc bằng placeholder | Bàn giao cấu hình mà không commit secret thật |
| Makefile | Cung cấp lệnh chung cho developer và Ops | Rút ngắn thao tác, tăng tính nhất quán |

## 4. Phân tách ba môi trường

| Môi trường | Nguồn version | Artifact policy | Hạ tầng vận hành |
|---|---|---|---|
| Development | branch dev | moving tag latest | máy developer hoặc self-hosted dev testing |
| Staging | branch main | full 40-character commit SHA | Docker Compose + Nginx + Tailscale Funnel |
| Production | tag vMAJOR.MINOR.PATCH | backend image semantic version; Vercel build từ tagged source | Vercel frontend + Azure VM backend |

Mỗi môi trường có URL, environment file, credential, Compose project, network và persistent volume riêng. Tag latest chỉ thay đổi trên registry; container đang chạy chỉ đổi khi developer chủ động pull/redeploy. Staging giữ nguyên full SHA trong UAT. Production giữ semantic version đã được phê duyệt.

## 5. Feedback và vận hành

Sau deployment, nhóm sử dụng:

- GitHub Actions log để biết job và commit gây lỗi;
- CI/CD email để thông báo cho PR/release owner;
- API health endpoint và container health check để xác nhận startup;
- Docker Compose status/log để Ops chẩn đoán runtime;
- UAT/system test trên Staging để tạo feedback nghiệp vụ.

Feedback được chuyển thành backlog item hoặc Pull Request mới, quay lại vòng **Plan → Code → CI/Test → Release → Deploy → Operate → Observe**. Đây là phần liên tục của DevOps, không chỉ là một lần tạo VM hoặc chạy Docker.
