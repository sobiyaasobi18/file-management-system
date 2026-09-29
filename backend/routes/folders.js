const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('folders').select('*').eq('user_id', req.userId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { name, parent_folder_id } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Folder name is required' });
  }
  const { data, error } = await supabase
    .from('folders')
    .insert({ user_id: req.userId, name: name.trim(), parent_folder_id: parent_folder_id || null })
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Folder name is required' });
  }
  const { data, error } = await supabase
    .from('folders')
    .update({ name: name.trim() })
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  if (!data.length) return res.status(404).json({ error: 'Folder not found' });
  res.json(data);
});

router.delete('/:id', async (req, res) => {

  const { data: files } = await supabase
    .from('files')
    .select('id')
    .eq('folder_id', req.params.id)
    .eq('user_id', req.userId);

  if (files && files.length > 0) {
    return res.status(400).json({
      error: `Cannot delete: this folder has ${files.length} file(s) inside. Delete the files first.`
    });
  }

  const { data: subfolders } = await supabase
    .from('folders')
    .select('id')
    .eq('parent_folder_id', req.params.id)
    .eq('user_id', req.userId);

  if (subfolders && subfolders.length > 0) {
    return res.status(400).json({
      error: `Cannot delete: this folder has ${subfolders.length} sub-folder(s) inside. Delete them first.`
    });
  }

  const { error } = await supabase
    .from('folders').delete().eq('id', req.params.id).eq('user_id', req.userId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;