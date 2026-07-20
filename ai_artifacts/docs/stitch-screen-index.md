# Stitch Screen Index

Last updated: 2026-07-20

## Audit summary

- Source directory: `ai_artifacts/stitch_design/` (read-only).
- Inventory includes product screens plus explicitly classified design/reference artifacts.
- Screenshot is the visual authority; `code.html` is secondary for structure/copy hints.
- `DESIGN.md`-only folders are reference artifacts, not feature routes.
- Pixel-level visual regression is reserved for implementation batches.

## Folder inventory

| Folder | Files found | Screenshot dimensions | Generated HTML | Apparent workspace | Apparent workflow | Duplicate / variant relationship | Implementation batch |
|---|---|---|---|---|---|---|---|
| access_denied | code.html, screen.png | 1600x1280 | yes | Reader Portal + auth | Auth / access | result state route | 1 - Authentication and access |
| action_notification_detail | code.html, screen.png | 1408x1126 | yes | Librarian Workspace | Approval / notification | route | 5 - Approval, correction, and notifications |
| add_edit_category | code.html, screen.png | 1600x1280 | yes | Administration | Administration | modal / drawer | 6 - Taxonomy, tags, users, and risky actions |
| admin_workspace_application_shell | code.html, screen.png | 1408x1126 | yes | Administration | Administration | layout | 6 - Taxonomy, tags, users, and risky actions |
| approval_confirmation_modal | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Approval / notification | modal overlay under parent route | 5 - Approval, correction, and notifications |
| approval_queue | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Approval / notification | route | 5 - Approval, correction, and notifications |
| approval_review | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Approval / notification | route | 5 - Approval, correction, and notifications |
| barcode_scanner | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Document intake / metadata | modal / drawer | 3 - Documents, upload, ISBN, and metadata |
| bookmarks | code.html, screen.png | 1600x1280 | yes | Reader Portal | Discovery / reader library | route | 2 - Reader discovery and personal library |
| catalogue_filter_panel | code.html, screen.png | 1600x1280 | yes | Reader Portal | Discovery / reader library | drawer / panel state | 2 - Reader discovery and personal library |
| catalogue_grid | code.html, screen.png | 1600x1280 | yes | Reader Portal | Discovery / reader library | route variant | 2 - Reader discovery and personal library |
| catalogue_list | code.html, screen.png | 1408x1126 | yes | Reader Portal | Discovery / reader library | route variant | 2 - Reader discovery and personal library |
| catalogue_loading | code.html, screen.png | 1408x1126 | yes | Reader Portal | Discovery / reader library | loading state of parent workflow | 2 - Reader discovery and personal library |
| catalogue_no_results | code.html, screen.png | 1600x1280 | yes | Reader Portal | Discovery / reader library | empty/no-results state of parent workflow | 2 - Reader discovery and personal library |
| category_deletion_warning | code.html, screen.png | 1600x1280 | yes | Administration | Administration | modal overlay under parent route | 6 - Taxonomy, tags, users, and risky actions |
| category_reassignment | code.html, screen.png | 1600x1299 | yes | Administration | Administration | modal / workflow state | 6 - Taxonomy, tags, users, and risky actions |
| category_tree_management | code.html, screen.png | 1600x1280 | yes | Administration | Administration | route | 6 - Taxonomy, tags, users, and risky actions |
| chart_detail_data_table | code.html, screen.png | 1600x1280 | yes | Librarian Workspace + Management Analytics | Dashboard / reporting / settings | route / drawer state | 7 - Dashboards, reports, export, and settings |
| continue_reading | code.html, screen.png | 1600x1280 | yes | Reader Portal | Discovery / reader library | route | 2 - Reader discovery and personal library |
| correction_requested | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Approval / notification | state route | 5 - Approval, correction, and notifications |
| correction_review_resubmit | code.html, screen.png | 1600x1412 | yes | Librarian Workspace | Approval / notification | route / form state | 5 - Approval, correction, and notifications |
| dashboard_date_filtering | code.html, screen.png | 1600x1280 | yes | Librarian Workspace + Management Analytics | Dashboard / reporting / settings | filter state | 7 - Dashboards, reports, export, and settings |
| dashboard_loading_empty | code.html, screen.png | 1600x1280 | yes | Librarian Workspace + Management Analytics | Dashboard / reporting / settings | loading state of parent workflow | 7 - Dashboards, reports, export, and settings |
| deactivate_account | code.html, screen.png | 1600x1280 | yes | Administration | Administration | modal / route state | 6 - Taxonomy, tags, users, and risky actions |
| design_system_component_inventory | code.html, screen.png | 1296x1600 | yes | Cross-workspace | Component inventory reference | reference design-system inventory; not a production route | Reference - design system input |
| digital_documents_list | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Document intake / metadata | route | 3 - Documents, upload, ISBN, and metadata |
| document_audit_history | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Document intake / metadata | tab / route | 3 - Documents, upload, ISBN, and metadata |
| document_details_overview | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Document intake / metadata | route / tab | 3 - Documents, upload, ISBN, and metadata |
| document_filters_bulk_actions | code.html, screen.png | 1600x1325 | yes | Librarian Workspace | Document intake / metadata | toolbar state | 3 - Documents, upload, ISBN, and metadata |
| duplicate_tag_review | code.html, screen.png | 1600x1280 | yes | Administration | Administration | route / drawer state | 6 - Taxonomy, tags, users, and risky actions |
| edit_metadata | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Document intake / metadata | route / form state | 3 - Documents, upload, ISBN, and metadata |
| export_report_options | code.html, screen.png | 1600x1280 | yes | Librarian Workspace + Management Analytics | Dashboard / reporting / settings | drawer / route state | 7 - Dashboards, reports, export, and settings |
| forgot_password | code.html, screen.png | 1600x1280 | yes | Reader Portal + auth | Auth / access | route | 1 - Authentication and access |
| full_text_results | code.html, screen.png | 1600x1280 | yes | Reader Portal | Discovery / reader library | results state | 2 - Reader discovery and personal library |
| full_text_search | code.html, screen.png | 1600x1280 | yes | Reader Portal | Discovery / reader library | route | 2 - Reader discovery and personal library |
| general_settings | code.html, screen.png | 1408x1126 | yes | Librarian Workspace + Management Analytics | Dashboard / reporting / settings | route | 7 - Dashboards, reports, export, and settings |
| institutional_precision | DESIGN.md | no-screen | no | Cross-workspace | Institutional visual language | reference-only design guidance; no screenshot/code.html | Reference - product/design guidance |
| isbn_lookup_result | code.html, screen.png | 1600x1532 | yes | Librarian Workspace | Document intake / metadata | component state | 3 - Documents, upload, ISBN, and metadata |
| isbn_metadata_form | code.html, screen.png | 1290x1600 | yes | Librarian Workspace | Document intake / metadata | form route/state | 3 - Documents, upload, ISBN, and metadata |
| libif_system | DESIGN.md | no-screen | no | Cross-workspace | System visual language | reference-only design guidance; no screenshot/code.html | Reference - product/design guidance |
| librarian_correction_notification | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Approval / notification | notification item state | 5 - Approval, correction, and notifications |
| librarian_dashboard | code.html, screen.png | 1408x1450 | yes | Librarian Workspace + Management Analytics | Dashboard / reporting / settings | route | 7 - Dashboards, reports, export, and settings |
| management_dashboard | code.html, screen.png | 1408x1303 | yes | Librarian Workspace + Management Analytics | Dashboard / reporting / settings | route | 7 - Dashboards, reports, export, and settings |
| merge_confirmation | code.html, screen.png | 1600x1280 | yes | Administration | Administration | modal overlay under parent route | 6 - Taxonomy, tags, users, and risky actions |
| merge_tags | code.html, screen.png | 1600x1280 | yes | Administration | Administration | route / form state | 6 - Taxonomy, tags, users, and risky actions |
| metadata_review_submit | code.html, screen.png | 1408x1293 | yes | Librarian Workspace | Document intake / metadata | route / confirmation state | 3 - Documents, upload, ISBN, and metadata |
| notification_centre | code.html, screen.png | 1408x1126 | yes | Librarian Workspace | Approval / notification | route | 5 - Approval, correction, and notifications |
| password_reset_completed | code.html, screen.png | 1600x1280 | yes | Reader Portal + auth | Auth / access | result state route | 1 - Authentication and access |
| processing_job_active | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Processing | route state | 4 - Processing queue and jobs |
| processing_job_completed | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Processing | terminal state | 4 - Processing queue and jobs |
| processing_job_failed | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Processing | terminal error state | 4 - Processing queue and jobs |
| processing_queue | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Processing | route | 4 - Processing queue and jobs |
| processing_queue_empty | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Processing | empty/no-results state of parent workflow | 4 - Processing queue and jobs |
| processing_queue_filtered | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Processing | filtered state | 4 - Processing queue and jobs |
| processing_quick_detail_drawer | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Processing | drawer overlay under parent route | 4 - Processing queue and jobs |
| published_success | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Document intake / metadata | result state | 3 - Documents, upload, ISBN, and metadata |
| reader_home | code.html, screen.png | 1600x1280 | yes | Reader Portal | Discovery / reader library | route | 2 - Reader discovery and personal library |
| reader_portal_application_shell | code.html, screen.png | 1408x1488 | yes | Reader Portal | Discovery / reader library | layout | 2 - Reader discovery and personal library |
| reader_portal_compact_navigation_state | code.html, screen.png | 1600x1280 | yes | Reader Portal | Discovery / reader library | responsive compact variant | 2 - Reader discovery and personal library |
| reader_registration | code.html, screen.png | 1600x1280 | yes | Reader Portal + auth | Auth / access | route | 1 - Authentication and access |
| reading_history | code.html, screen.png | 1600x1280 | yes | Reader Portal | Discovery / reader library | route | 2 - Reader discovery and personal library |
| rejected_document_correction | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Approval / notification | route state | 5 - Approval, correction, and notifications |
| rejection_correction_modal | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Approval / notification | modal overlay under parent route | 5 - Approval, correction, and notifications |
| replace_pdf | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Document intake / metadata | route / dialog state | 3 - Documents, upload, ISBN, and metadata |
| report_export_completed | code.html, screen.png | 1600x1280 | yes | Librarian Workspace + Management Analytics | Dashboard / reporting / settings | terminal state | 7 - Dashboards, reports, export, and settings |
| report_export_failed | code.html, screen.png | 1600x1280 | yes | Librarian Workspace + Management Analytics | Dashboard / reporting / settings | terminal error state | 7 - Dashboards, reports, export, and settings |
| report_export_in_progress | code.html, screen.png | 1600x1280 | yes | Librarian Workspace + Management Analytics | Dashboard / reporting / settings | job state | 7 - Dashboards, reports, export, and settings |
| reset_password | code.html, screen.png | 1600x1280 | yes | Reader Portal + auth | Auth / access | route | 1 - Authentication and access |
| resubmitted_review | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Approval / notification | route state | 5 - Approval, correction, and notifications |
| retrying_history | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Processing | tab / route | 4 - Processing queue and jobs |
| role_change_confirmation | code.html, screen.png | 1600x1280 | yes | Administration | Administration | modal overlay under parent route | 6 - Taxonomy, tags, users, and risky actions |
| secure_reader_compact_layout | code.html, screen.png | 1600x1280 | yes | Reader Portal | Discovery / reader library | responsive compact variant | 2 - Reader discovery and personal library |
| security_session_settings | code.html, screen.png | 1408x1126 | yes | Librarian Workspace + Management Analytics | Dashboard / reporting / settings | route | 7 - Dashboards, reports, export, and settings |
| session_expired | code.html, screen.png | 1600x1280 | yes | Reader Portal + auth | Auth / access | result state route | 1 - Authentication and access |
| sign_in | code.html, screen.png | 1600x1280 | yes | Reader Portal + auth | Auth / access | route | 1 - Authentication and access |
| sign_in_validation_error | code.html, screen.png | 1600x1280 | yes | Reader Portal + auth | Auth / access | form state | 1 - Authentication and access |
| tag_management | code.html, screen.png | 1600x1280 | yes | Administration | Administration | route | 6 - Taxonomy, tags, users, and risky actions |
| upload_in_progress | code.html, screen.png | 1600x1288 | yes | Librarian Workspace | Document intake / metadata | component state | 3 - Documents, upload, ISBN, and metadata |
| upload_pdf_default | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Document intake / metadata | route state | 3 - Documents, upload, ISBN, and metadata |
| upload_validation_error | code.html, screen.png | 1600x1280 | yes | Librarian Workspace | Document intake / metadata | error state | 3 - Documents, upload, ISBN, and metadata |
| user_detail | code.html, screen.png | 1408x1126 | yes | Administration | Administration | route | 6 - Taxonomy, tags, users, and risky actions |
| user_list | code.html, screen.png | 1408x1126 | yes | Administration | Administration | route | 6 - Taxonomy, tags, users, and risky actions |

## Reference artifacts

- `institutional_precision`: `DESIGN.md` reference for institutional visual language.
- `libif_system`: `DESIGN.md` reference for LIBIF system visual language.
- `design_system_component_inventory`: screenshot/HTML reference for component inventory, not an application route.
