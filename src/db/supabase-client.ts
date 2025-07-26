import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const channel = supabase
  .channel('roblox_discord_links_changes')
  .on(
    'postgres_changes',
    {
      event: '*', // can be 'INSERT', 'UPDATE', 'DELETE'
      schema: 'public',
      table: 'roblox_discord_links',
    },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();