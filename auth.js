// auth.js

// Auth State Observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user.uid);
        // If user is on login or signup page, redirect to dashboard
        const path = window.location.pathname;
        if (path.includes("login.html") || path.includes("signup.html")) {
            window.location.href = "dashboard.html";
        }
    } else {
        console.log("User is signed out");
        // If user is on dashboard or protected pages, redirect to login
        // Simple check to avoid redirect loop on public pages
        const path = window.location.pathname;
        if (path.includes("dashboard.html") || path.includes("lost-found.html") || path.includes("complaints.html") || path.includes("volunteer.html")) {
            window.location.href = "login.html";
        }
    }
});

// Sign Up
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;
        const errorMsg = document.getElementById('error-message');

        auth.createUserWithEmailAndPassword(email, password)
            .then((cred) => {
                // Return promise to chain the next then block
                return db.collection('users').doc(cred.user.uid).set({
                    name: name,
                    email: email,
                    role: 'student' // Default role
                });
            })
            .then(() => {
                // Redirect handled by onAuthStateChanged
            })
            .catch((error) => {
                console.error("Signup error:", error);
                if (error.code === 'auth/unauthorized-domain') {
                    errorMsg.innerHTML = `Domain not authorized. <br>Go to Firebase Console -> Authentication -> Settings -> Authorized Domains and add this domain.`;
                } else {
                    errorMsg.textContent = error.message;
                }
                errorMsg.classList.remove('d-none');
            });
    });
}

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-message');

        auth.signInWithEmailAndPassword(email, password)
            .then((cred) => {
                // Redirect handled by onAuthStateChanged
            })
            .catch((error) => {
                console.error("Login error:", error);
                if (error.code === 'auth/unauthorized-domain') {
                    errorMsg.innerHTML = `Domain not authorized. <br>Go to Firebase Console -> Authentication -> Settings -> Authorized Domains and add this domain.`;
                } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    errorMsg.textContent = "Incorrect email or password. Please try again.";
                } else {
                    errorMsg.textContent = error.message;
                }
                errorMsg.classList.remove('d-none');
            });
    });
}

// Logout function (to be used in dashboard)
function logout() {
    auth.signOut().then(() => {
        window.location.href = "index.html";
    });
}
