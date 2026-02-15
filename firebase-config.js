// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDuqea4F1ORTogkx3GI993eddMTtcCIfJE",
    authDomain: "saylani-portal-8a3f1.firebaseapp.com",
    projectId: "saylani-portal-8a3f1",
    storageBucket: "saylani-portal-8a3f1.firebasestorage.app",
    messagingSenderId: "312984558526",
    appId: "1:312984558526:web:b02415364d3a3336c4f7ef",
    measurementId: "G-LXR8WG7P2W"
};

// Initialize Firebase
if (!firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully");
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
} else {
    firebase.app(); // if already initialized, use that one
}

// Export auth and db globally (explicitly attach to window to avoid scope issues)
window.auth = firebase.auth();
window.db = firebase.firestore();