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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-8">Available Forms</h1>
      <ul className="space-y-4">
        {forms.map((form) => (
          <li key={form.id} className="text-lg">
            <Link href={`/forms/${form.id}`} className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 font-semibold">
              {form.filename.replace('.json', '')}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
