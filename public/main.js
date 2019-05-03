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

// Reference events collection
var eventsRef = firebase.database().ref('events');

// Listen for form submit
document.getElementById('eventForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e) {
    e.preventDefault();

    //Get values
    var stuName = getInputVal('name');
    var email = getInputVal('email');
    var stuID = getInputVal('stuID');
    var message = getInputVal('message');

    //Save event
    saveEvent(stuName, email, stuID, message);

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