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

const notifyMeButton = document.getElementById("subscribe");
const stopNotifyingButton = document.getElementById("unsubscribe");
const notificationForm = document.getElementById("notificationForm");


/* ============
 Functions
============ */
const subscribeToNotifications = () => {
    console.log("hello");
    firebaseMessaging.requestPermission()
        .then(() => {
            return handleTokenRefresh()
        })
        .catch(() => console.log("User didn't give permission"));
}

const unSubscribeToNotifications = () => {
    firebaseMessaging.getToken()
        .then((token) => firebaseMessaging.deleteToken(token))
        .then(() => firebaseDatabase.ref("/token").orderByChild('uid').equalTo(firebaseAuth.currentUser.uid)
            .once('value')
            .then((snapshot) => {
                console.log(snapshot.val());
                const key = Object.keys(snapshot.val())[0];
                return firebaseDatabase.ref("/token").child(key).remove();
            })
        )
}

console.log(firebaseAuth.currentUser);
const handleTokenRefresh = () => {


    return firebaseMessaging.getToken()
        .then((token) => {
            console.log(token);

            firebaseDatabase.ref("/token").push({
                token: token,
                uid: firebaseAuth.currentUser.uid
            });
        });
}

const sendNotification = (event) =>{
    event.preventDefault();

    const notificationMessage = document.getElementById('notification-message').value;
    firebaseDatabase.ref("/notifications").push({
        email: firebaseAuth.currentUser.email,
        message: notificationMessage,
        userProfile: firebaseAuth.currentUser.photoURL
    }).then(()=>{
        document.getElementById('notification-message').value = '';
    })
}


/* ============
 Event Listeners
============ */
notifyMeButton.addEventListener('click', subscribeToNotifications);
stopNotifyingButton.addEventListener('click', unSubscribeToNotifications);


document.getElementById("logoutButton").addEventListener('click', () => {

    firebaseAuth.signOut()
        .then(() => {
            console.log("Logged out successfully!");
        }).catch((error) => {
            console.log("Error: ", error);
        })
});

firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
        console.log(user);
        // window.location.href = "http://localhost:8080/public/";
    }

})

firebaseMessaging.onTokenRefresh(handleTokenRefresh);

notificationForm.addEventListener('submit', sendNotification);

