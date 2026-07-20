import { Card } from '../../components/ui';

export default function HomePage() {
  return (
    <section>
      <Card>
        <h1>LIBIF</h1>
        <p>Start with Digital Book Intake: upload a PDF, save metadata, and queue processing.</p>
        <p><a href="/admin/books/new">Create the first digital book intake →</a></p>
      </Card>
    </section>
  );
}
