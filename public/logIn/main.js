const form = document.getElementById('logIn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const response = await fetch(`${location.origin}/logIn`, {
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
  } else if (data.status === 'user does not exist') {
    const error = document.getElementById('error');
    error.style.display = 'flex';
    error.innerText = `${data.message}`;
  }
});
