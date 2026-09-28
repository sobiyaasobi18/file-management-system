const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../supabaseClient');

const upload = multer({ storage: multer.memoryStorage() });


router.get('/', async (req, res) => {
  let query = supabase.from('files').select('*').eq('user_id', req.userId);
  if (req.query.folder_id) query = query.eq('folder_id', req.query.folder_id);
  if (req.query.search) query = query.ilike('file_name', `%${req.query.search}%`);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const { folder_id } = req.body;
  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${req.userId}/${Date.now()}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file.buffer, { contentType: file.mimetype });
  if (uploadError) return res.status(500).json({ error: uploadError.message });

  const { data, error: dbError } = await supabase
    .from('files')
    .insert({
      user_id: req.userId,
      folder_id: folder_id || null,
      file_name: file.originalname,
      storage_path: filePath,
      file_size: file.size
    })
    .select();

  if (dbError) {
    await supabase.storage.from('documents').remove([filePath]);
    return res.status(500).json({ error: dbError.message });
  }
  res.json(data);
});


router.get('/download/:id', async (req, res) => {
  const { data: fileRecord } = await supabase
    .from('files')
    .select('storage_path, file_name')
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .single();
  if (!fileRecord) return res.status(404).json({ error: 'File not found' });

  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(fileRecord.storage_path, 60);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ url: data.signedUrl, file_name: fileRecord.file_name });
});
router.delete('/:id', async (req, res) => {
  const { data: fileRecord } = await supabase
    .from('files')
    .select('storage_path')
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .single();
  if (!fileRecord) return res.status(404).json({ error: 'File not found' });

  await supabase.storage.from('documents').remove([fileRecord.storage_path]);

  const { error } = await supabase
    .from('files').delete().eq('id', req.params.id).eq('user_id', req.userId);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Deleted successfully' });
});



module.exports = router;