const content = document.getElementById('posts');
const categoriasLink = document.getElementById('categorias-link');
const submenu = document.getElementById('submenu');
const publicacionesLista = document.getElementById('publicacionesLista');
const vendedoresLista = document.getElementById('vendedoresLista');
const searchBox = document.getElementById('searchBox');
const temp = document.getElementById('temp');
const publicacionesLink = document.getElementById('publicacionesLink');
const vendedoresLink = document.getElementById('vendedoresLink');

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

const createCard = ({ img1, img2, img3, title, description }) => {
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
  const category = document.getElementById('category');
  const postStorage = {};
  const response = await fetch(
    `${location.origin}/loadPosts/${category.innerText}`,
    {
      method: 'GET',
    }
  );

  const data = await response.json();

  if (data.message) {
    content.innerHTML = `<p>${data.message} ${category.innerText}</p>`;
    return;
  }

  data.posts.forEach((posts) => {
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
      img1: '../' + post.images[0].slice(7),
      img2:
        post.images.length < 2
          ? '../' + post.images[0].slice(7)
          : '../' + post.images[1].slice(7),
      img3:
        post.images.length < 3
          ? '../' + post.images.length < 2
            ? '../' + post.images[0].slice(7)
            : '../' + post.images[1].slice(7)
          : '../' + post.images[2].slice(7),
      title: post.name,
      description: post.description,
    });
  });
};

loadPosts();
