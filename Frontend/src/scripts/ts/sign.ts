const authForm = document.getElementById('authForm') as HTMLFormElement | null;
const title = document.getElementById('title') as HTMLElement | null;
const toggleForm = document.getElementById('toggleForm') as HTMLButtonElement | null;
const signUpName = document.getElementById('signUpName') as HTMLInputElement | null;
const inputEmail = document.getElementById('inputEmail') as HTMLInputElement | null;
const inputPassword = document.getElementById('inputPassword') as HTMLInputElement | null;
const signButton = document.getElementById('sign') as HTMLButtonElement | null;

let isSignUp = true;

toggleForm?.addEventListener('click', (event: Event) => {
  event.preventDefault();
  isSignUp = !isSignUp;

  if (title && signButton && signUpName) {
    if (isSignUp) {
      title.textContent = 'Sign Up';
      signButton.textContent = 'Sign up';
      signUpName.parentElement && (signUpName.parentElement.style.display = 'block');
    } else {
      title.textContent = 'Sign In';
      signButton.textContent = 'Sign in';
      signUpName.parentElement && (signUpName.parentElement.style.display = 'none');
    }
  }
});

authForm?.addEventListener('submit', async (event: Event) => {
  event.preventDefault();

  if (!inputEmail || !inputPassword) return;

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
      toggleForm?.click();
    } else {
      localStorage.setItem('token', result.access_token);
      alert('Login successful!');
      redirectToDashboard(result.role);
    }
  } catch (error: any) {
    console.error('Error:', error.message);
    alert(error.message);
  }
});

function redirectToDashboard(role: string): void {
  if (role === 'Admin') {
    window.location.href = 'Admin/admin-dashboard.html';
  } else if (role === 'user') {
    window.location.href = '/user-dashboard.html';
  } else {
    window.location.href = '/user-dashboard.html';
  }
}
