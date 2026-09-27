const express = require('express');
const cors = require('cors');
require('dotenv').config();

const supabase = require('./supabaseClient');
const profileRoutes = require('./routes/profile');
const folderRoutes = require('./routes/folders');
const fileRoutes = require('./routes/files');
const credentialRoutes = require('./routes/credentials');



const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/profile', profileRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/credentials', credentialRoutes);



app.get('/test-db', async (req, res) => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/',(req,res) =>{
    res.send('Backend running..')
});

 app.listen(5000, () => {
   console.log('Server running on port 5000');
 });

