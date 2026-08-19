// ==========================================================================
// Ikram Jewellers - Supabase Configuration & Initialization
// ==========================================================================

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Check if credentials have been updated from placeholder defaults
const isConfigured = 
    SUPABASE_URL && 
    SUPABASE_URL !== "YOUR_SUPABASE_URL" && 
    SUPABASE_ANON_KEY && 
    SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";

// Expose configuration status to the window scope
window.supabaseConfigured = isConfigured;

if (isConfigured) {
    try {
        // Initialize Supabase Client using standard window global loaded from CDN
        window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase Client initialized successfully.");
    } catch (error) {
        console.error("Supabase initialization failed. Falling back to local data:", error);
        window.supabaseConfigured = false;
    }
} else {
    console.warn("Supabase is unconfigured. Running in Local Fallback mode using default catalog data. To go live, edit supabase-config.js with your project credentials.");
}
