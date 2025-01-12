
var loginFormElement = document.getElementById('loginForm') as HTMLFormElement;
if (loginFormElement) {
  loginFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = (loginFormElement.querySelector('#inputEmail') as HTMLInputElement).value;
    const password = (loginFormElement.querySelector('#inputPassword') as HTMLInputElement).value;

    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      loginFormElement.reset();
      return
    }

    if (email === 'test@example.com' && password === '123456') {
      window.location.href = 'index.html';
      const navLogin = document.getElementById("navLogin");
      if (navLogin) {
        navLogin.innerHTML = 'Logout';
      }
    } else {
      alert('Invalid email or password.');
      loginFormElement.reset();
    }

    
  });
}


var signUpForm = document.getElementById('signUpForm') as HTMLFormElement;
if (signUpForm) {
  signUpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = (signUpForm.querySelector('#signUpName') as HTMLInputElement).value;
    const email = (signUpForm.querySelector('#signUpEmail') as HTMLInputElement).value;
    const password = (signUpForm.querySelector('#signUpPassword') as HTMLInputElement).value;

    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
    }

    if (name && email && password) {
      window.location.href = 'index.html';
    } else {
      alert('Please fill all fields.');
    }
   
});
}