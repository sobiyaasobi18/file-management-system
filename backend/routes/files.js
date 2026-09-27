const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../supabaseClient');

const upload = multer({ storage: multer.memoryStorage() });


router.post('/upload', upload.single('file'), async (req, res) => {
  const { user_id, folder_id } = req.body;
  const file = req.file;

  const filePath = `${user_id}/${Date.now()}_${file.originalname}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file.buffer, { contentType: file.mimetype });

  if (uploadError) return res.status(500).json({ error: uploadError.message });

  const { data, error: dbError } = await supabase
    .from('files')
    .insert({
      user_id,
      folder_id: folder_id || null,
      file_name: file.originalname,
      storage_path: filePath,
      file_size: file.size
    })
    .select();

  if (dbError) return res.status(500).json({ error: dbError.message });
  res.json(data);
});


router.get('/download/:id', async (req, res) => {
  const { data: fileRecord, error: dbError } = await supabase
    .from('files')
    .select('storage_path, file_name')
    .eq('id', req.params.id)
    .single();

  if (dbError) return res.status(404).json({ error: 'File not found' });

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
    .single();

  if (!fileRecord) return res.status(404).json({ error: 'File not found' });

  await supabase.storage.from('documents').remove([fileRecord.storage_path]);

  const { error } = await supabase.from('files').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Deleted successfully' });
});


module.exports = router;