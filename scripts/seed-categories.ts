import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env variables
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const categories = [
  { name: 'Pelatihan & Sertifikasi', slug: 'pelatihan-dan-sertifikasi' },
  { name: 'Bimbingan Teknis (Bimtek)', slug: 'bimbingan-teknis' },
  { name: 'Workshop', slug: 'workshop' },
  { name: 'Seminar', slug: 'seminar' }
];

async function seed() {
  console.log('Seeding categories...');
  
  for (const cat of categories) {
    const { data, error } = await supabase
      .from('categories')
      .upsert({ slug: cat.slug, name: cat.name }, { onConflict: 'slug' })
      .select();
      
    if (error) {
      console.error(`Error inserting ${cat.name}:`, error.message);
    } else {
      console.log(`Successfully inserted ${cat.name}`);
    }
  }
  
  console.log('Done!');
}

seed();
