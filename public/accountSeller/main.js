const form = document.getElementById('seller');

const showProfessions = async () => {
  const fragment = document.createDocumentFragment();
  const formGroup = document.getElementById('form-group');
  const profession = document.createElement('label');
  profession.innerText = 'Profession';
  profession.classList.add('label');
  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');
  const select = document.createElement('select');
  select.name = 'profession';
  select.classList.add('input');
  select.style.width = '100%';

  const response = await fetch(`${location.origin}/getProfessions`, {
    method: 'GET',
  });

  const data = await response.json();

  data.types.forEach((type) => {
    const option = document.createElement('option');
    option.innerText = type.Type;
    option.classList.add('input');
    option.style.width = '95%';
    option.style.paddingLeft = '10%';
    option.style.paddingRight = '10%';
    fragment.appendChild(option);
  });
  select.appendChild(fragment);
  formGroup.append(profession, select);
};

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

showProfessions();
