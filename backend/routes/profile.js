const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/:userId', async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.params.userId)
    .single();

  if (error) return res.status(404).json({ error: 'Profile not found' });
  res.json(data);
});


router.post('/', async (req, res) => {
  const { id, full_name, email } = req.body;
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id, full_name, email })
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;