document.addEventListener('DOMContentLoaded', () => {
  const categoriasLink = document.getElementById('categorias-link');
  const submenu = document.getElementById('submenu');
  const publicacionesLista = document.getElementById('publicacionesLista');
  const vendedoresLista = document.getElementById('vendedoresLista');
  const searchBox = document.getElementById('searchBox');
  const temp = document.getElementById('temp');
  const publicacionesLink = document.getElementById('publicacionesLink');
  const vendedoresLink = document.getElementById('vendedoresLink');

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slides = document.querySelectorAll('.slide');
  let counter = 0;

  const nextSlide = () => {
    slides.forEach((slide, i) => {
      if (i == counter) slide.style.opacity = '1';
      else slide.style.opacity = '0';
    });
  };

  setInterval(() => {
    if (counter < slides.length - 1) counter++;
    else counter = 0;

    nextSlide();
  }, 5000);

  prevBtn.addEventListener('click', () => {
    if (counter > 0) counter--;
    else counter = slides.length - 1;

    nextSlide();
  });

  nextBtn.addEventListener('click', () => {
    if (counter < slides.length - 1) counter++;
    else counter = 0;

    nextSlide();
  });

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

  const fotoPerfil = document.querySelector('.Foto');
  const perfilOptions = document.querySelector('.perfil-options');
  if (perfilOptions) {
    perfilOptions.style.display = 'none';

    fotoPerfil.addEventListener('click', function () {
      perfilOptions.style.display =
        perfilOptions.style.display === 'none' ? 'flex' : 'none';

      // Ajustar para centrar horizontalmente
      const rect = fotoPerfil.getBoundingClientRect();
      const optionsRect = perfilOptions.getBoundingClientRect();
      const leftOffset = rect.left + rect.width / 2 - optionsRect.width / 2;

      perfilOptions.style.position = 'fixed';
      perfilOptions.style.top = `${rect.bottom}px`;
      perfilOptions.style.left = `${leftOffset}px`;
    });

    document.addEventListener('click', function (event) {
      const target = event.target;
      if (!target.closest('.FotoPerfil') && target !== fotoPerfil) {
        perfilOptions.style.display = 'none';
      }
    });
  }

  const createCard = ({ img1, img2, img3, title, description }) => {
    const content = document.getElementById('publicaciones');

    const fragment = document.createDocumentFragment();
    const publication = document.createElement('a');
    publication.classList.add('publicacion');

    const mainImg = document.createElement('img');
    mainImg.classList.add('imgprin');
    mainImg.src = img1;

    const secondaries = document.createElement('div');
    secondaries.classList.add('secundaries');

    const secondImg = document.createElement('img');
    secondImg.classList.add('imgsec');
    secondImg.src = img2;

    const thirdImg = document.createElement('img');
    thirdImg.classList.add('imgsec');
    thirdImg.src = img3;

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('descripcion');
    descriptionP.innerHTML = `${title} <br /> ${description}`;

    secondaries.append(secondImg, thirdImg);
    publication.append(mainImg, secondaries, descriptionP);
    publication.href = `${location.origin}/post/${title}`;
    fragment.appendChild(publication);
    content.appendChild(fragment);
  };

  const loadPosts = async () => {
    const postStorage = {};
    const response = await fetch(`${location.origin}/loadPosts`, {
      method: 'GET',
    });

    const data = await response.json();

    data.data.forEach((posts) => {
      if (!postStorage[posts.ID]) {
        postStorage[posts.ID] = {
          name: posts.Name_product,
          description: posts.Description,
          screenModel: posts.Screen_Model_Route,
          model3D: posts.Model_Route,
          images: [posts.Route],
        };
      } else {
        postStorage[posts.ID].images.push(posts.Route);
      }
    });

    const arrPosts = Object.values(postStorage);

    arrPosts.forEach((post) => {
      createCard({
        img1: post.images[0].slice(7),
        img2:
          post.images.length < 2
            ? post.images[0].slice(7)
            : post.images[1].slice(7),
        img3:
          post.images.length < 3
            ? post.images.length < 2
              ? post.images[0].slice(7)
              : post.images[1].slice(7)
            : post.images[2].slice(7),
        title: post.name,
        description: post.description,
      });
    });
  };

  loadPosts();
});
