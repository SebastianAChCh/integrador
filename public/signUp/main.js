const form = document.getElementById('createAnAccount');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch('http://localhost:4000/createAccount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      names: e.target.names.value,
      lastnames: e.target.lastnames.value,
      email: e.target.email.value,
      pass: e.target.password.value,
      phone: e.target.phone.value,
    }),
  });

  const data = await response.json();

  if (data.status === 'ok') {
    location.href = '/';
  }
});
