const form = document.getElementById('logIn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const response = await fetch('http://localhost:4000/logIn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: e.target.email.value,
      password: e.target.password.value,
    }),
  });

  const data = await response.json();

  if (data.status === 'ok') {
    location.href = '/';
  }
});
