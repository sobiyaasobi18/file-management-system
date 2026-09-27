const key = process.env.SUPABASE_SERVICE_KEY;
const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64').toString());
console.log('Role:', payload.role);
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;