// ════════════════════════════════════════════════════
//  FIREBASE CONFIG — shared across all pages
const firebaseConfig = {
  apiKey:            "AIzaSyAvjrRwEXYrPNvJmH_JBh_BCBAV4IhFevE",
  authDomain:        "fhpartty.firebaseapp.com",
  projectId:         "fhpartty",
  storageBucket:     "fhpartty.firebasestorage.app",
  messagingSenderId: "59717956859",
  appId:             "1:59717956859:web:ebfc22e08bc17695872c5e"
};
// ════════════════════════════════════════════════════

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const auth    = firebase.auth();
const db      = firebase.firestore();
const storage = typeof firebase.storage === 'function' ? firebase.storage() : null;
