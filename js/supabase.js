import { createClient } from "https://kzjcbrkwablnnbxghdns.supabase.co/rest/v1/";

const SUPABASE_URL = "PASTE_YOUR_PROJECT_URL_HERE";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_9oo9hes2T7xh9nMyidocjA_xgA8arxL";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);