var txtEmail = document.getElementById('txtEmail');
var txtPassword = document.getElementById('txtPassword');
var signOutBtn = document.getElementById('signOutBtn');
var signUpBtn = document.getElementById('signUpBtn');

function signUp() {
    let email = txtEmail.value;
    let password = txtPassword.value;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error.message);
    });
}
 function signIn() {
     let email = txtEmail.value;
     let password = txtPassword.value;
     firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
         var errorCode = error.code;
         var errorMessage = error.message;
         console.log(error.message);
     });
 }
signOutBtn.addEventListener('click', e => {
    firebase.auth().signOut();
    delay();
});

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser){
        console.log(firebaseUser);
        document.getElementById('wrap4').style.display = 'none';
        document.getElementById('SignWindow').style.display = 'none';
        signOutBtn.classList.remove('hide');
    }
    else {
        console.log('not logged in');
        signOutBtn.classList.add('hide');

    }
});