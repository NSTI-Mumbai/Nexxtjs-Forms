import fs from 'fs';
import path from 'path';
import { useState } from 'react';
import axios from 'axios';

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
      await axios.post(webhookUrl, {
        content: `New Form Submission: ${JSON.stringify(formData)}`,
      });

      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form.');
    }
  };

  return (
    <div>
      <h1>{form.title}</h1>
      <form onSubmit={handleSubmit}>
        {form.questions.map((question, index) => (
          <div key={index}>
            <label>{question.label}</label>
            <input
              type={question.type}
              name={`question-${index}`}
              placeholder={question.placeholder}
              onChange={(e) => handleInputChange(e, index)}
              required
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
