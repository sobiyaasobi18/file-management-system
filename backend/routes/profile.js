const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('profiles').select('*').eq('id', req.userId).single();
  if (error) return res.status(404).json({ error: 'Profile not found' });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { full_name, email } = req.body;

  const { data: existing } = await supabase
    .from('profiles').select('*').eq('id', req.userId).maybeSingle();
  if (existing) return res.json([existing]);

  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: req.userId, full_name, email })
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.put('/', async (req, res) => {
  const { full_name } = req.body;
  if (!full_name || !full_name.trim()) {
    return res.status(400).json({ error: 'Full name is required' });
  }
  const { data, error } = await supabase
    .from('profiles')
    .update({ full_name: full_name.trim() })
    .eq('id', req.userId)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  if (!data.length) return res.status(404).json({ error: 'Profile not found' });
  res.json(data);
});

module.exports = router;