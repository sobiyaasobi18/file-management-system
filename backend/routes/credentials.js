const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { encrypt, decrypt } = require('../utils/encryption');

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('credentials').select('*').eq('user_id', req.userId);
  if (error) return res.status(500).json({ error: error.message });

  const decrypted = data.map((item) => ({
    ...item,
    secret_value: decrypt(item.secret_value),
  }));
  res.json(decrypted);
});

router.post('/', async (req, res) => {
  const { title, secret_value } = req.body;
  const encryptedSecret = encrypt(secret_value);

  const { data, error } = await supabase
    .from('credentials')
    .insert({ user_id: req.userId, title, secret_value: encryptedSecret })
    .select();
  if (error) return res.status(500).json({ error: error.message });

  res.json(data.map((item) => ({ ...item, secret_value })));
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('credentials').delete().eq('id', req.params.id).eq('user_id', req.userId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Deleted successfully' });
});