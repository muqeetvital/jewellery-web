// ==========================================================================
// Ikram Jewellers - Firebase Configuration & Initialization
// ==========================================================================

const firebaseConfig = {
    apiKey: "AIzaSyAs3fmXpms2fAt4qoMZt98XqTK8tXkfnig",
    authDomain: "ikram-jewellery.firebaseapp.com",
    projectId: "ikram-jewellery",
    storageBucket: "ikram-jewellery.firebasestorage.app",
    messagingSenderId: "165746440891",
    appId: "1:165746440891:web:8f6f8df414ebcb285cc79e",
    measurementId: "G-SHEPTJLWM4"
};

// Check if credentials have been updated from defaults
const isConfigured = 
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "YOUR_API_KEY" && 
    firebaseConfig.projectId && 
    firebaseConfig.projectId !== "YOUR_PROJECT_ID";

// Expose configuration status to the window scope
window.firebaseConfigured = isConfigured;

if (isConfigured) {
    try {
        // Initialize Firebase using compat libraries (compatible with simple CDN script setups)
        firebase.initializeApp(firebaseConfig);
        window.db = firebase.firestore();
        window.auth = firebase.auth();
        window.storage = firebase.storage();
        if (typeof firebase.analytics === "function") {
            window.analytics = firebase.analytics();
        }
        console.log("Firebase services & Analytics initialized successfully.");
    } catch (error) {
        console.error("Firebase initialization failed. Falling back to local data:", error);
        window.firebaseConfigured = false;
    }
} else {
    console.warn("Firebase is unconfigured. Running in Local Fallback mode using default catalog data. To go live, edit firebase-config.js with your project credentials.");
}
