import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  // Only allow post method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check API Key from headers
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_SECRET_KEY) {
    console.warn('Unauthorized attempt with invalid API key');
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }

  // Validate input
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  try {
    // Insert into Supabase
    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, body }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return res.status(500).json({ error: 'Database error' });
    }

    // Return created post
    return res.status(201).json({ message: 'Post created', post: data[0] });

  } catch (err) {
    console.error('Unexpected server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
