<<<<<<< Updated upstream
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
=======
const form = document.getElementById('createAnAccount');
const telefono = document.getElementById('telefono');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (e.target.confirmPassword.value !== e.target.password.value) {
    document.getElementById('error').innerText = `Password must be same`;
    return;
  }

  if (e.target.phone.value.length > 10) {
    document.getElementById(
      'error'
    ).innerText = `The phone cannot have more than 10 number`;
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

telefono.addEventListener('input', (e) => {
  if (e.target.value.length > 10) e.target.value = e.target.value.slice(0, 10);
});
>>>>>>> Stashed changes
