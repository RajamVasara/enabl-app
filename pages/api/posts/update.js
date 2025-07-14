import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, title } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: 'Missing ID or title' });
  }

  const { error } = await supabase
    .from('posts')
    .update({ title })
    .eq('id', id);

  if (error) {
    console.error("Supabase Update Error:", error);
    return res.status(500).json({ error: 'Database error' });
  }

  return res.status(200).json({ message: 'Post updated successfully' });
}
