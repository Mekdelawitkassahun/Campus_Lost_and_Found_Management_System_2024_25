var loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = loginForm.querySelector('#inputEmail').value;
        var password = loginForm.querySelector('#inputPassword').value;
        if (password.length < 6) {
            alert('Password must be at least 6 characters.');
            loginForm.reset();
            return;
        }
        if (email === 'test@example.com' && password === '123456') {
            window.location.href = 'index.html';
            var navLogin = document.getElementById("navLogin");
            if (navLogin) {
                navLogin.innerHTML = 'Logout';
            }
        }
        else {
            alert('Invalid email or password.');
            loginForm.reset();
        }
    });
}
var signUpForm = document.getElementById('signUpForm');
if (signUpForm) {
    signUpForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = signUpForm.querySelector('#signUpName').value;
        var email = signUpForm.querySelector('#signUpEmail').value;
        var password = signUpForm.querySelector('#signUpPassword').value;
        if (password.length < 6) {
            alert('Password must be at least 6 characters.');
        }
        if (name && email && password) {
            window.location.href = 'index.html';
        }
        else {
            alert('Please fill all fields.');
        }
    });
}
