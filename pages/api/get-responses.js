import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('form-responses');

      const responses = await db.collection('responses').find().toArray();

      res.status(200).json({ success: true, responses });
    } catch (error) {
      console.error('Error fetching form responses:', error);
      res.status(500).json({ error: 'Error fetching form responses' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
