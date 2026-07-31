import { PageHeader } from '../../../../components/layout';
import { TagManager } from '../../../../components/domain/taxonomy';
import { InlineAlert } from '../../../../components/ui';
import { fetchSession, fetchTaxonomyTags } from '../../../../lib/api-server';

export default async function AdminTagsPage() {
  const [sessionResult, tagResult] = await Promise.allSettled([
    fetchSession(),
    fetchTaxonomyTags()
  ]);
  const canManage = sessionResult.status === 'fulfilled' && sessionResult.value.user?.role === 'ADMIN';
  const tags = tagResult.status === 'fulfilled' ? tagResult.value : [];

  return (
    <section className="ui-stack">
      <PageHeader title="Tags" description="Maintain the tag options available to document metadata workflows." />
      {sessionResult.status === 'rejected' ? (
        <InlineAlert tone="error">Permissions could not be verified: {sessionResult.reason instanceof Error ? sessionResult.reason.message : 'Unknown session error'}</InlineAlert>
      ) : null}
      {tagResult.status === 'rejected' ? (
        <InlineAlert tone="error">Tags could not be loaded: {tagResult.reason instanceof Error ? tagResult.reason.message : 'Unknown error'}</InlineAlert>
      ) : <TagManager tags={tags} canManage={canManage} />}
    </section>
  );
}
