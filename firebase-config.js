// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyADL0ijNIoRz5DBqDVXnEVAWPMtEMH6lHM",
    authDomain: "femhack-2.firebaseapp.com",
    projectId: "femhack-2",
    storageBucket: "femhack-2.firebasestorage.app",
    messagingSenderId: "253590944759",
    appId: "1:253590944759:web:26495d087eafaa935f4cf2",
    measurementId: "G-NXT6Y08LTY"
};

// Initialize Firebase (Compat version for CDN)
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

// Export auth and db globally for other scripts to use
const auth = firebase.auth();
const db = firebase.firestore();