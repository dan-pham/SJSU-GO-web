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

firebase.initializeApp(firebaseConfig);

//Reference feedback collection
var feedbacksRef = firebase.database().ref('feedbacks');

//Listen for form submit
document.getElementById('feedbackForm').addEventListener('submit', submitFeedback);
document.getElementById('sign-out').addEventListener('click', toggleSignOut, false);

// Submit feedback form
function submitFeedback(e) {
    e.preventDefault();

    //Get values
    var message = getInputVal('message');
    var userID = firebase.auth().currentUser;

    //Save feedback
    saveFeedback(message);

    //Show alert
    document.querySelector('.alert').style.display = 'block';

    //Hide alert after 3 seconds
    setTimeout(function() {
        document.querySelector('.alert').style.display= 'none';
    },3000);
    
    //Clear form
    document.getElementById('feedbackForm').reset();

    var myObj = { uid : userID, msg: message };
    console.log(myObj);
}

// Function to get get form values
function getInputVal(id){
    return document.getElementById(id).value;
}

// Save feedback to firebase
function saveFeedback(message){
    var newFeedbackRef = feedbacksRef.push();
    newFeedbackRef.set({
        message: message
    });
}

// Signout user
function toggleSignOut() {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            //signout
            firebase.auth().signOut();
        }
    });
}

function initApp() {
    //Note: As can be seen in the console, there is slight delay to register auth state change
    firebase.auth().onAuthStateChanged(function(user) {
        if(user != null) {
            name = user.displayName;
            email = user.email;
            emailVerified = user.emailVerified;
            uid = user.uid;
            // console.log(name);
            console.log(email);
            console.log(uid);
            document.getElementById("logout").style.display = "initial";
        } 
        else {
            console.log("No user logged in");

            // Simulate HTTP redirect
            window.location.replace("./index.html");
        }
    });
}

window.onload = function() {
    initApp();
}