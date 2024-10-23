import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db('form-responses');
      
      const result = await db.collection('responses').insertOne({
        formId: req.body.formId,
        formData: req.body.formData,
        submittedAt: new Date(),
      });

      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error('Error saving form data to MongoDB:', error);
      res.status(500).json({ error: 'Error saving form data to MongoDB' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
