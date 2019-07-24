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

// Initialize Cloud Firestore through Firebase
// firebase.initializeApp({
//     apiKey: 'AIzaSyAbPNYPqHGbcz7wat3bhc5oIbfzsi3b9Iw',
//     authDomain: 'sjsu-go.firebaseapp.com',
//     projectId: 'sjsu-go'
// });
  


firebase.initializeApp(firebaseConfig);

// Firestore reference
var db = firebase.firestore();

// Reference events collection
var eventsRef = firebase.database().ref('events');

var user = firebase.auth().currentUser;
var name, email, uid, emailVerified;

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

    } 
    else {
        console.log("No user logged in");
        name = user.displayName;
        email = user.email;
        console.log(name);
    }
});

// Listen for form submit
document.getElementById('eventForm').addEventListener('submit', submitForm);
// document.getElementById('getEvents').addEventListener('submit', getEvents);

// Getter function for events
// function getEvents() {
//     //e.preventDefault();

//     // Use "get" method to retrieve entire collection
//     db.collection("events").get().then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             console.log(`${doc.id} => ${doc.data().message}`);
//         });
//     });    
// }

// Submit form
function submitForm(e) {
    e.preventDefault();

    //Get values
    var stuName = getInputVal('name');
    var email = getInputVal('email');
    var stuID = getInputVal('stuID');
    var message = getInputVal('message');
    var pointValue = 0;
    var approved = 'N';
    //var uid = user.uid;

    // TODO: assign point value based on selected drop down menu option
    var eventType = getInputVal('eventType');

    if(eventType == "jobFair") {
        pointValue = 10;
    }
    else if(eventType == "careerCenter") {
        pointValue = 5;
    }
    else if(eventType == "professionalEvent") {
        pointValue = 10;
    }
    else if(eventType == "other") {
        pointValue = 0;
    }

    //Save event in realtime database
    saveEvent(stuName, email, stuID, message);

    // Add a new document with set id
    // db.collection("events").doc("test").set({
    //     stuName: stuName,
    //     email: email,
    //     stuID: stuID,
    //     message: message
    // })
    // .then(function() {
    //     console.log("Document successfully written");
    // })
    // .catch(function(error) {
    //     console.error("Error adding document: ", error);
    // });

    // Add a new document to Firestore with generated id
    db.collection("events").add({
        stuName: stuName,
        email: email,
        stuID: stuID,
        message: message,
        pointValue: pointValue,
        approved: approved
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    //Show alert
    document.querySelector('.alert').style.display = 'block';

    //Hide alert after 3 seconds
    setTimeout(function() {
        document.querySelector('.alert').style.display= 'none';
    },3000);
    
    //Clear form
    document.getElementById('eventForm').reset();

    
}


// Function to get get form values
function getInputVal(id){
    return document.getElementById(id).value;
}

// Save event to firebase
function saveEvent(stuName, email, stuID, message){
    var newEventRef = eventsRef.push();
    newEventRef.set({
        stuName: stuName,
        email: email,
        stuID: stuID,
        message: message
    });
}