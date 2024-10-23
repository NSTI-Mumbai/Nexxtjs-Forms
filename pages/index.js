import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export async function getStaticProps() {
  const formsDir = path.join(process.cwd(), 'Forms');
  const filenames = fs.readdirSync(formsDir);

  const forms = filenames.map((filename) => ({
    id: filename.replace('.json', ''),
    filename,
  }));

  return {
    props: {
      forms,
    },
  };
}

export default function Home({ forms }) {
  return (
    <div>
      <h1>Available Forms</h1>
      <ul>
        {forms.map((form) => (
          <li key={form.id}>
            <Link href={`/forms/${form.id}`}>{form.filename}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
