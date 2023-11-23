const form = document.getElementById('createAnAccount');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (e.target.confirmPassword.value !== e.target.password.value) {
    document.getElementById('error').innerText = `Password must be same`;
    return;
  }

  const response = await fetch(`${location.origin}/createAccount`, {
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
  console.log(data);
  if (data.status === 'ok') {
    location.href = '/';
  } else {
    const errorSingUp = document.getElementById('errorSingUp');
    errorSingUp.style = 'flex';
    errorSingUp.innerText = data.message;
  }
});
