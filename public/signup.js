
/*  =================== 
    Initialize Firebase
    ===================  */
var config = {
    apiKey: "AIzaSyDToY3QfntXv0dP1Z42dngYMdIIpQT6t3I",
    authDomain: "push-notifications-f1058.firebaseapp.com",
    databaseURL: "https://push-notifications-f1058.firebaseio.com",
    projectId: "push-notifications-f1058",
    storageBucket: "push-notifications-f1058.appspot.com",
    messagingSenderId: "447928447793"
};
firebase.initializeApp(config);


/* ============
    Variables
   ============ */

const firebaseAuth = firebase.auth();
const firebaseMessaging = firebase.messaging();
const firebaseDatabase = firebase.database();

const signInWithGoogleButton = document.getElementById("google-signin");


/* ============
 Functions
============ */
const signInWithGoogle = () => {
    firebaseAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
}

firebaseAuth.onAuthStateChanged(user => {
    if (user) {
        console.log("Logged in!");
        window.location.href = "http://localhost:8080/public/dashboard.html";
    } else {
        console.log("Logged out!");
    }
});



/* ============
 Event Listeners
============ */


signInWithGoogleButton.addEventListener('click', (event) => {
    event.preventDefault();
    signInWithGoogle();
});

document.getElementById("signUpForm").addEventListener('submit', (event) => {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            console.log("Account Created!");
        }).catch((error) => {
            console.log("Error: ", error);
        })
});