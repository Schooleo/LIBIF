import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CatalogDetailCompatibilityRedirect({ params }: PageProps) {
  const resolvedParams = await params;
  redirect(`/catalogue/${resolvedParams.id}`);
}
