const form = document.getElementById('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const response = await fetch(`${location.origin}/problems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: e.target.name.value,
      issue: e.target.issue.value,
      message: e.target.message.value,
    }),
  });

  const data = await response.json();

  if (data.status === 'ok') {
    Swal.fire({
      icon: 'success',
      title: 'Ok',
      text: 'You problem was send!',
    });

    setTimeout(() => {
      location.href = '/';
    }, 2000);
  }
});
