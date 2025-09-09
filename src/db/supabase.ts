import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config.js';

export default createClient(SUPABASE_URL, SUPABASE_KEY);
