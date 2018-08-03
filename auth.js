var txtEmail = document.getElementById('txtEmail');
var txtPassword = document.getElementById('txtPassword');
var signOutBtn = document.getElementById('signOutBtn');
var signUpBtn = document.getElementById('signUpBtn');

//const root = firebase.database().ref().chil


function Database(score, player) {
    var data = firebase.database().ref().child('players');
    data = firebase.database().ref().child('players').child(player);
    data.set({
        'points': score,
        'name': player,
    });
    data.child('points').on('value', snap => console.log(snap.val()));
  //  firebase.database().ref().child('players').update({
    //    'current': player,
//})
}

function signUp() {
    let email = txtEmail.value;
    let password = txtPassword.value;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error.message);
    });
    Database(0, email.replace(/\./g, ','));
}
 function signIn() {
     let email = txtEmail.value;
     let password = txtPassword.value;
     firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
         var errorCode = error.code;
         var errorMessage = error.message;
         console.log(error.message);
     });
     /*firebase.database().ref().child('players').update({
         'current': ({
             'name': email.replace(/\./g, ','),
         })
 })*/
 }
signOutBtn.addEventListener('click', e => {
    firebase.auth().signOut();
    delay();
});

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser){
        console.log(firebaseUser.email);
        firebase.database().ref().child('players').update({
            'current': ({
                'name': firebaseUser.email.replace(/\./g, ','),
            })
        });
        document.getElementById('wrap4').style.display = 'none';
        document.getElementById('SignWindow').style.display = 'none';
        signOutBtn.classList.remove('hide');
    }
    else {
        console.log('not logged in');
        signOutBtn.classList.add('hide');

    }
});