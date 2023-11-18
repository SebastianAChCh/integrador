const title = document.getElementById('title');
const container = document.getElementById('container');
const backButton = document.getElementById('back-button');

backButton.addEventListener('click', () => history.back());

const createCard = (data) => {
  const fragment = document.createDocumentFragment();
  const mainA = document.createElement('a');
  const mainImg = document.createElement('img');
  mainA.setAttribute('data-lightbox', 'galeria');
  mainA.setAttribute('data-title', 'Imagen 1');
  mainImg.classList.add('item');
  mainImg.src = data.primaryImg;
  mainA.href = data.primaryImg;
  mainA.appendChild(mainImg);
  const secondaryContainer = document.createElement('div');
  secondaryContainer.classList.add('secondary');
  const secondA = document.createElement('a');
  const secondImg = document.createElement('img');
  secondImg.classList.add('item');
  secondImg.style = 'height: 10rem';
  secondImg.src = data.secondImg;
  secondA.setAttribute('data-lightbox', 'galeria');
  secondA.setAttribute('data-title', 'Imagen 2');
  secondA.href = data.secondImg;
  secondA.appendChild(secondImg);
  const thirdA = document.createElement('a');
  const thirdImg = document.createElement('img');
  thirdImg.classList.add('item');
  thirdImg.src = data.lastImg;
  thirdImg.style = 'height: 10rem';
  thirdA.setAttribute('data-lightbox', 'galeria');
  thirdA.setAttribute('data-title', 'Imagen 3');
  thirdA.href = data.lastImg;
  thirdA.appendChild(thirdImg);
  secondaryContainer.append(secondA, thirdA);
  const sellerInfo = document.getElementById('info');
  const infoSecondary = document.createElement('a');
  infoSecondary.classList.add('infoSecondary');
  infoSecondary.href = `${location.origin}/profile/${data.email}`;
  const avatar = document.createElement('img');
  avatar.src = data.avatar;
  const name = document.createElement('span');
  name.classList.add('name');
  name.innerText = data.name;
  infoSecondary.append(avatar, name);
  const rating = document.createElement('span');
  rating.classList.add('rating');
  rating.innerText = data.rating;
  sellerInfo.append(infoSecondary, rating);
  fragment.append(mainA, secondaryContainer, sellerInfo);
  container.appendChild(fragment);
};

const loadPost = async () => {
  const dataPost = {};

  const project = document.getElementById('project');
  const response = await fetch(
    `${location.origin}/loadPost/${project.innerText}`,
    { method: 'GET' }
  );

  const data = await response.json();

  if (!dataPost[data.infoSeller[0].Names]) {
    console.log(data.infoSeller[0].AVATAR);
    dataPost[data.infoSeller[0].Names] = {
      Seller: data.infoSeller[0].Names,
      Email: data.infoSeller[0].Email,
      Avatar: '../' + data.infoSeller[0].AVATAR,
      Rating: data.infoSeller[0].Calificaciones,
      Title: data.postData[0].Name_product,
      Description: data.postData[0].Description,
      Model3dScreen: '../' + data.postData[0].Screen_Model_Route,
      Model_Route: data.postData[0].Model_Route,
      RouteImages: [],
    };
  }
  data.postData.forEach((images) => {
    const fragment = document.createDocumentFragment();
    const a = document.createElement('a');
    const img = document.createElement('img');
    img.classList.add('item');
    a.setAttribute('data-lightbox', 'galeria');
    a.setAttribute('data-title', 'Imagen 4');
    a.style = 'display:none';
    a.href = '../' + images.Route.slice(7);
    img.src = '../' + images.Route.slice(7);
    a.append(img);
    fragment.append(a);
    container.append(fragment);

    dataPost[data.infoSeller[0].Names].RouteImages.push(
      '../' + images.Route.slice(7)
    );
  });

  createCard({
    primaryImg:
      dataPost[data.infoSeller[0].Names].Model3dScreen !== ''
        ? dataPost[data.infoSeller[0].Names].Model3dScreen
        : dataPost[data.infoSeller[0].Names].RouteImages[0],
    secondImg:
      dataPost[data.infoSeller[0].Names].RouteImages.length < 2
        ? dataPost[data.infoSeller[0].Names].RouteImages[0]
        : dataPost[data.infoSeller[0].Names].RouteImages[1],
    lastImg:
      dataPost[data.infoSeller[0].Names].RouteImages.length < 3
        ? dataPost[data.infoSeller[0].Names].RouteImages.length < 2
          ? dataPost[data.infoSeller[0].Names].RouteImages[0]
          : dataPost[data.infoSeller[0].Names].RouteImages[1]
        : dataPost[data.infoSeller[0].Names].RouteImages[3],
    avatar: dataPost[data.infoSeller[0].Names].Avatar,
    name: dataPost[data.infoSeller[0].Names].Seller,
    rating: dataPost[data.infoSeller[0].Names].Calificacion,
    email: dataPost[data.infoSeller[0].Names].Email,
  });
};

loadPost();
