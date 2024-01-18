const categoriasLink = document.getElementById('categorias-link');
const submenu = document.getElementById('submenu');
const publicacionesLista = document.getElementById('publicacionesLista');
const vendedoresLista = document.getElementById('vendedoresLista');
const searchBox = document.getElementById('searchBox');
const temp = document.getElementById('temp');
const container = document.getElementById('vendedores');

searchBox.style.display = 'flex';
submenu.style.display = 'none';
publicacionesLista.style.display = 'none';
vendedoresLista.style.display = 'none';

categoriasLink.addEventListener('click', function (event) {
  searchBox.style.display =
    searchBox.style.display === 'none' ? 'flex' : 'none';
  submenu.style.display = submenu.style.display === 'none' ? 'flex' : 'none';
  temp.style.display = temp.style.display === 'none' ? 'block' : 'none';

  if (searchBox.style.display === 'flex') {
    publicacionesLista.style.display = 'none';
    vendedoresLista.style.display = 'none';
  }

  event.stopPropagation();
});

const publicacionesLink = document.getElementById('publicacionesLink');
const vendedoresLink = document.getElementById('vendedoresLink');

publicacionesLink.addEventListener('click', function (event) {
  vendedoresLista.style.display = 'none';
  publicacionesLista.style.display =
    publicacionesLista.style.display === 'none' ? 'flex' : 'none';

  event.stopPropagation();
});

vendedoresLink.addEventListener('click', function (event) {
  publicacionesLista.style.display = 'none';
  vendedoresLista.style.display =
    vendedoresLista.style.display === 'none' ? 'flex' : 'none';

  event.stopPropagation();
});

document.addEventListener('click', function (event) {
  const target = event.target;
  if (
    !target.closest('#submenu') &&
    target !== categoriasLink &&
    target !== publicacionesLink &&
    target !== vendedoresLink &&
    !target.closest('.categorias-lista')
  ) {
    searchBox.style.display = 'flex';
    submenu.style.display = 'none';
    publicacionesLista.style.display = 'none';
    vendedoresLista.style.display = 'none';
    temp.style.display = 'none';
  }
});

const createCard = (data) => {
  const fragment = document.createDocumentFragment();
  const vendedor = document.createElement('div');
  vendedor.classList.add('vendedor');
  const photos = document.createElement('div');
  photos.classList.add('photos');
  const profile = document.createElement('img');
  profile.classList.add('profile');
  profile.src = '../' + data.profile;
  const calificacion = document.createElement('img');
  calificacion.classList.add('calificacion');
  calificacion.src = data.raiting;
  photos.append(profile, calificacion);
  const info = document.createElement('div');
  info.classList.add('info');
  const name = document.createElement('p');
  name.classList.add('name');
  name.innerText = data.name;
  const description = document.createElement('p');
  description.classList.add('description');
  description.innerText = data.description;
  info.append(name, description);
  vendedor.append(photos, info);
  fragment.append(vendedor);
  container.appendChild(fragment);
};

const loadSellers = async () => {
  const category = document.getElementById('category');
  const sellerStorage = {};
  const response = await fetch(
    `${location.origin}/sellersByType/${category.innerText}`,
    {
      method: 'GET',
    }
  );

  const data = await response.json();

  if (data.message) {
    container.innerHTML = `<p>${data.message}</p>`;
    return;
  }

  data.result.forEach((seller) => {
    if (!sellerStorage[seller.ID]) {
      sellerStorage[seller.ID] = {
        name: seller.Names,
        email: seller.Email,
        description:
          seller.Description === '' ? 'No description yet' : seller.description,
        profession: seller.Profession,
        raiting:
          '../pictures/CALIFI' +
          (seller.Calificaciones === 0 ? 1 : seller.Calificaciones) +
          '.png',
        profile: seller.AVATAR,
      };
    }
  });

  const arrSeller = Object.values(sellerStorage);

  arrSeller.forEach((seller) =>
    createCard({
      name: seller.name,
      email: seller.email,
      description: seller.description,
      profession: seller.Profession,
      raiting: seller.raiting,
      profile: seller.profile,
    })
  );
};

loadSellers();
