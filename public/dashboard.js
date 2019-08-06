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

//To use the module in your application, require it from any JavaScript file:
var admin = require('firebase-admin');

var serviceAccount = require('./sjsu-go-firebase-adminsdk-5k072-43118120b1.json');
admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                    });

const uid = 'yyWhUDZCDFRkyvYb3Asz9P6EIJF3'; //this uid is for groot at gmail.com
const additionalClaims = {
    premiumAccount: true
};

admin.auth().createCustomToken(uid, additionalClaims).then((cutomToken)=> {
                                         console.log(customToken);
                                         }
                                         ).catch((error)=>{
                                                 console.log('Error creating custom token', error)
                                                 });




//Initialize Firebase Admin SDK:
admin.initializeApp({
                    credential: admin.credential.applicationDefault(),
                    databaseURL: 'https://sjsu-go.firebaseio.com'
                    });


//a credential which allows you to authenticate with a Google OAuth2 refresh token
var refreshToken; // Get refresh token from OAuth2 flow
admin.initializeApp({
                    credential: admin.credential.refreshToken(refreshToken),
                    databaseURL: 'https://sjsu-go.firebaseio.com'
                    });

//look up users profile information by their uid:
admin.auth().getUser(uid)
.then(function(userRecord)
      {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully fetched user data:', userRecord.toJSON());
      })
.catch(function(error)
       {
       console.log('Error fetching user data:', error);
       });

//look up user information with an email:
admin.auth().getUserByEmail(email)
.then(function(userRecord)
      {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully fetched user data:', userRecord.toJSON());
      })
.catch(function(error)
       {
       console.log('Error fetching user data:', error);
       });

//accepts an object containing the profile info to create user account
admin.auth().createUser({
                        email: 'user@example.com',
                        emailVerified: false,
                        phoneNumber: '+11234567890',
                        password: 'secretPassword',
                        displayName: 'John Doe',
                        photoURL: 'http://www.example.com/12345678/photo.png',
                        disabled: false
                        })
.then(function(userRecord)
      {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully created new user:', userRecord.uid);
      })
.catch(function(error)
       {
       console.log('Error creating new user:', error);
       });



//specify a uid along with the properties to update for that user:
admin.auth().updateUser(uid,
                        {
                        email: 'modifiedUser@example.com',
                        phoneNumber: '+11234567890',
                        emailVerified: true,
                        password: 'newPassword',
                        displayName: 'Jane Doe',
                        photoURL: 'http://www.example.com/12345678/photo.png',
                        disabled: true
                        })
.then(function(userRecord)
      {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully updated user', userRecord.toJSON());
      })
.catch(function(error)
       {
       console.log('Error updating user:', error);
       });


//delete existing users by their uid:
admin.auth().deleteUser(uid)
.then(function()
      {
      console.log('Successfully deleted user');
      })
.catch(function(error)
       {
       console.log('Error deleting user:', error);
       });

//list all users
function listAllUsers(nextPageToken)
{
    // List batch of users, 1000 at a time.
    admin.auth().listUsers(1000, nextPageToken)
    .then(function(listUsersResult)
          {
          listUsersResult.users.forEach(function(userRecord)
                                        {
                                        console.log('user', userRecord.toJSON());
                                        });
          if (listUsersResult.pageToken)
          {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
          }
          })
    .catch(function(error)
           {
           console.log('Error listing users:', error);
           });
}
// Start listing users from the beginning, 1000 at a time.
listAllUsers();


// Set admin privilege on the user corresponding to uid.
admin.auth().setCustomUserClaims(uid, {admin: true}).then(() =>
                                                          {
// The new custom claims will propagate to the user's ID token the
// next time a new one is issued.
                                                          });

// Verify the ID token first.
admin.auth().verifyIdToken(idToken).then((claims) => {
    if (claims.admin === true) {
      // Allow access to requested admin resource.
    }
});


//Access custom claims on the client
firebase.auth().currentUser.getIdTokenResult()
.then((idTokenResult) => {
      // Confirm the user is an Admin.
      if (!!idTokenResult.claims.admin)
      {
      showAdminUI();  // Show admin UI.
      } else
      {
      showRegularUI(); // Show regular user UI.
      }
      })
     .catch((error) => {
       console.log(error);
       });






// Getter function for events
function getEvents()
{
    //e.preventDefault();

    var userEmail;
    // var content = '';

    firebase.auth().onAuthStateChanged(function(user)
    {
        if(user)
        {
            userEmail = user.email;
        }
    });

    // Use "get" method to retrieve entire collection
    db.collection("events").get().then((querySnapshot) =>
    {
        querySnapshot.forEach((doc) =>
        {
            // Only display events submitted by signed-in user
            if(`${doc.data().email}` == userEmail)
            {
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


function initApp()
{
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user)
    {
        // [START_EXCLUDE silent]
        // document.getElementById('quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user)
        {
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
            if(!user)
            {
            document.getElementById('adminMessage').textContent = 'Hello, Administrator';
            }
            document.getElementById('welcomeMessage').style.wordWrap = "break-word";
            document.getElementById('auth').style.display = "none";
            if (!emailVerified)
            {
            document.getElementById('quickstart-verify-email').disabled = false;
            }
            document.getElementById('logout').style.display = "initial";
            // [END_EXCLUDE]
        } else
        {
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


window.onload = function()
{
    initApp();
}

function toggleSignOut()
{
    firebase.auth().onAuthStateChanged(function(user)
    {
        if(user)
        {
            //signout
            firebase.auth().signOut();
        }
    }
    );
}
