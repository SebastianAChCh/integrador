const form = document.getElementById('volverseVendedor');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const response = await fetch('http://localhost:4000/createAccountSeller', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      NoEmision: e.target.noemision.value,
      NoIne: e.target.noine.value,
      curp: e.target.curp.value,
      claveElector: e.target.claveelector.value,
      birth: e.target.cumpleanos.value,
    }),
  });

  const data = await response.json();

  if (data.status === 'ok') {
    location.href = '/';
  }
});
