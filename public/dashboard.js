// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAbPNYPqHGbcz7wat3bhc5oIbfzsi3b9Iw",
    authDomain: "sjsu-go.firebaseapp.com",
    databaseURL: "https://sjsu-go.firebaseio.com",
    projectId: "sjsu-go",
    storageBucket: "sjsu-go.appspot.com",
    messagingSenderId: "954003871359",
    appId: "1:954003871359:web:f6c800c6a53c8e34"
};

// firebase.initializeApp(firebaseConfig);

// Firestore reference
var db = firebase.firestore();

// Getter function for events
function getEvents() {
    //e.preventDefault();

    var userEmail;
    // var content = '';

    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            userEmail = user.email;
        }
    });

    // Use "get" method to retrieve entire collection
    db.collection("events").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Only display events submitted by signed-in user
            if(`${doc.data().email}` == userEmail) {
                console.log(`${doc.id} => ${doc.data().message}`);
                // content += '<tr>';
                // content += '<td>' + doc.data().message + '</td>';
                // content += '</tr>';
                var newRow = document.createElement("tr");
                var messageCell = document.createElement("td");
                var pointCell = document.createElement("td");
                var approvedCell = document.createElement("td");
                messageCell.innerHTML = doc.data().message;
                newRow.append(messageCell);
                pointCell.innerHTML = doc.data().pointValue;
                newRow.append(pointCell);
                approvedCell.innerHTML = doc.data().approved;
                newRow.append(approvedCell);
                document.getElementById("rows").appendChild(newRow);
            }
        });
        // document.getElementById("eventTable").append(content);
    });    

    // Hides "Show Events" button after user click
    document.getElementById("getEvents").style.display = "none";
}

function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        // document.getElementById('quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // [START_EXCLUDE]
            // document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
            // document.getElementById('quickstart-sign-in').textContent = 'Sign out';
            // document.getElementById('quickstart-sign-up').disabled = true;
            //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            //document.getElementById('Username').textContent = JSON.stringify(email, null, '  ');
            document.getElementById('welcomeMessage').textContent = 'Welcome ' + email;
            document.getElementById('welcomeMessage').style.wordWrap = "break-word";
            document.getElementById('auth').style.display = "none";
            if (!emailVerified) {
            document.getElementById('quickstart-verify-email').disabled = false;
            }
            document.getElementById('logout').style.display = "initial";
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            // document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            // document.getElementById('quickstart-sign-in').textContent = 'Sign in';
            //document.getElementById('quickstart-account-details').textContent = 'null';
            // document.getElementById('quickstart-sign-up').disabled = false;
            // [END_EXCLUDE]
            document.getElementById('logout').style.display = "none";
            console.log("No user logged in");

            // Simulate HTTP redirect
            window.location.replace("./index.html");
        }
        // [START_EXCLUDE silent]
        // document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('sign-out').addEventListener('click', toggleSignOut, false);
    // document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
    // document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
    // document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
}

window.onload = function() {
    initApp();
}

function toggleSignOut() {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            //signout
            firebase.auth().signOut();
        }
    }
    );
}
