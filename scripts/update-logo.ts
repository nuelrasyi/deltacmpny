import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Inserting icon.svg into media_assets...');
  
  // First, check if it already exists to avoid duplicates
  const { data: existing } = await supabase
    .from('media_assets')
    .select('*')
    .eq('url', '/icon.svg')
    .maybeSingle();
    
  let mediaId;
  
  if (existing) {
    console.log('Media asset already exists:', existing.id);
    mediaId = existing.id;
  } else {
    const { data: mediaAsset, error: mediaError } = await supabase
      .from('media_assets')
      .insert({
        filename: 'icon.svg',
        url: '/icon.svg',
        file_type: 'image/svg+xml',
        file_size: 233247
      })
      .select()
      .single();

    if (mediaError) {
      console.error('Error inserting media asset:', mediaError);
      return;
    }
    console.log('Successfully inserted media asset:', mediaAsset);
    mediaId = mediaAsset.id;
  }

  console.log('Updating company profile to use new logo...');
  const { error: profileError } = await supabase
    .from('company_profiles')
    .update({ logo_id: mediaId })
    .eq('id', 1);

  if (profileError) {
    console.error('Error updating company profile:', profileError);
    return;
  }

  console.log('Successfully updated company profile! The logo is now set to /icon.svg.');
}

main();
