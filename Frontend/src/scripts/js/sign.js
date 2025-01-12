const authForm = document.getElementById('authForm');
const title = document.getElementById('title');
const toggleForm = document.getElementById('toggleForm');
const signUpName = document.getElementById('signUpName');
const inputEmail = document.getElementById('inputEmail');
const inputPassword = document.getElementById('inputPassword');
const signButton = document.getElementById('sign');

let isSignUp = true;

toggleForm.addEventListener('click', (event) => {
  event.preventDefault();
  isSignUp = !isSignUp;
  if (isSignUp) {
    title.textContent = 'Sign Up';
    signButton.textContent = 'Sign up';
    signUpName.parentElement.style.display = 'block';
  } else {
    title.textContent = 'Sign In';
    signButton.textContent = 'Sign in';
    signUpName.parentElement.style.display = 'none';
  }
});

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = isSignUp ? '/auth/signup' : '/auth/login';
  const data = {
    email: inputEmail.value,
    password: inputPassword.value, 
  };

  try {
    const response = await fetch(`http://localhost:3000${url}`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }

    if (isSignUp) {
      alert('Sign-up successful! Please log in.');
      toggleForm.click(); 
    } else {
      localStorage.setItem('token', result.access_token);
      alert('Login successful!');
      redirectToDashboard(result.role);
    }
  } catch (error) {
    console.error('Error:', error.message);
    alert(error.message);
  }
});

function redirectToDashboard(role) {
  if (role === 'Admin') {
    window.location.href = '/Frontend/src/public/admin-dashboard.html';
  } else if (role === 'user') {
    window.location.href = '/Frontend/src/public/user-dashboard.html';
  } else {
    window.location.href = '/Frontend/src/public/user-dashboard.html';
  }
}

