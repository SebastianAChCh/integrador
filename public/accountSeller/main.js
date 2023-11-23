const form = document.getElementById('seller');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const response = await fetch(`${location.origin}/createAccountSeller`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      NoEmision: e.target.noemision.value,
      NoIne: e.target.noine.value,
      curp: e.target.curp.value,
      claveElector: e.target.claveelector.value,
      birth: e.target.date.value,
      profession: e.target.profession.value,
    }),
  });

  const data = await response.json();

  if (data.status === 'ok') {
    location.href = '/';
  }
});
