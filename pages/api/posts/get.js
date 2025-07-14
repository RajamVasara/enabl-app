import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error.message);
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }

  return res.status(200).json(data);
}
