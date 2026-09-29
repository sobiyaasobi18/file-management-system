const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

const requireAdmin = async (req, res, next) => {
  const { data } = await supabase
    .from('profiles').select('role').eq('id', req.userId).single();
  if (!data || data.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
};

router.get('/stats', requireAdmin, async (req, res) => {
  const { count: userCount } = await supabase
    .from('profiles').select('*', { count: 'exact', head: true });

  const { data: files } = await supabase.from('files').select('file_size');
  const totalStorage = files.reduce((sum, f) => sum + (f.file_size || 0), 0);
  const uploadCount = files.length;

  res.json({ userCount, totalStorage, uploadCount });
});

router.get('/users', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;