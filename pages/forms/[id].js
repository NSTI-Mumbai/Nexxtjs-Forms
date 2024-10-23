import fs from 'fs';
import path from 'path';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const webhookUrl = "https://discord.com/api/webhooks/1298641567585927189/_nUslOfuxt3nrnSydgclqEfqce5Yz5rWP-BWDfEtdeBgioOfpnlJEYW2YS8EKPymrnvK";

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'Forms', `${params.id}.json`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const form = JSON.parse(fileContents);

  return {
    props: {
      form,
    },
  };
}

export async function getStaticPaths() {
  const formsDir = path.join(process.cwd(), 'Forms');
  const filenames = fs.readdirSync(formsDir);

  const paths = filenames.map((filename) => ({
    params: { id: filename.replace('.json', '') },
  }));

  return {
    paths,
    fallback: false,
  };
}

export default function FormPage({ form }) {
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const embed = {
        embeds: [
          {
            title: "New Form Submission",
            description: `Form Title: **${form.title}**`,
            color: 7506394,
            fields: Object.keys(formData).map((key, index) => ({
              name: `Question ${index + 1}:`,
              value: `**${form.questions[index].label}**\nAnswer: ${formData[key]}`,
              inline: false,
            })),
            footer: {
              text: "Form Submission Log",
            },
          },
        ],
      };

      await axios.post(webhookUrl, embed);

      await axios.post('/api/submit-form', {
        formId: form.title,
        formData,
      });

      router.push('/thank-you');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{form.title}</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {form.questions.map((question, index) => (
            <div key={index} className="rounded-md shadow-sm -space-y-px">
              <label className="block text-sm font-medium text-gray-700 mb-2">{question.label}</label>
              <input
                type={question.type}
                name={`question-${index}`}
                placeholder={question.placeholder}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
