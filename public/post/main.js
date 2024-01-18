<<<<<<< Updated upstream
const title = document.getElementById('title');
const content = document.getElementById('content');

const loadPost = async () => {
  const fragment = document.createDocumentFragment();
  const description = document.createElement('p');
  const InfoSeller = document.createElement('a');
  const nameSeller = document.createElement('h1');
  const calif = document.createElement('p');
  const avatarImg = document.createElement('img');

  const response = await fetch(
    `http://localhost:4000/loadPost/${title.innerText}`,
    {
      method: 'GET',
    }
  );

  const data = await response.json();

  description.innerText = data.postData[0].Description;
  fragment.appendChild(description);

  for (let i = 0; i < data.postData.length; i++) {
    const image = document.createElement('img');
    image.src = '../' + data.postData[i].Route.slice(7);
    image.className = 'h-20';
    fragment.appendChild(image);
  }

  //Informacion del vendedor
  avatarImg.src = '../' + data.infoSeller[0].AVATAR;
  avatarImg.className = 'h-20';
  InfoSeller.append(avatarImg);
  nameSeller.innerText = data.infoSeller[0].Names;
  InfoSeller.appendChild(nameSeller);
  calif.innerText = data.infoSeller[0].Calificaciones;
  InfoSeller.appendChild(calif);
  InfoSeller.href = `/profile/${data.infoSeller[0].Email}`;

  fragment.appendChild(InfoSeller);

  content.append(fragment);
};

loadPost();
=======
const title = document.getElementById('title');
const container = document.getElementById('container');
const backButton = document.getElementById('back-button');

backButton.addEventListener('click', () => history.back());

const createCard = (data) => {
  const fragment = document.createDocumentFragment();
  const mainA = document.createElement('a');
  const mainImg = document.createElement('img');
  mainImg.classList.add('item');
  if (data.primaryImg.length === 2) {
    console.log(data.primaryImg.length);
    mainImg.src = '../' + data.primaryImg[0];
    mainA.href = '/view/' + data.primaryImg[1].slice(8);
    mainA.appendChild(mainImg);
  } else {
    console.log(data.primaryImg);
    mainA.setAttribute('data-lightbox', 'galeria');
    mainA.setAttribute('data-title', 'Imagen 1');
    mainImg.src = data.primaryImg;
    mainA.href = data.primaryImg;
    mainA.appendChild(mainImg);
  }
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
  avatar.style = 'height: 50px';
  avatar.src = data.avatar;
  const name = document.createElement('span');
  name.classList.add('name');
  name.innerText = data.name;
  infoSecondary.append(avatar, name);
  const rating = document.createElement('span');
  const raitingImg = document.createElement('img');
  rating.classList.add('rating');
  raitingImg.style.width = '15%';
  if (data.rating === 0) {
    raitingImg.style.opacity = 0.5;
  }
  raitingImg.src =
    data.rating === 0
      ? '../pictures/CALIFI5.png'
      : '../pictures/CCALIFI' + data.rating + '.png';
  rating.appendChild(raitingImg);
  sellerInfo.append(infoSecondary, rating);
  const sideBar = document.getElementById('sidebars');
  const description = document.createElement('p');
  description.classList.add('description');
  description.innerText = data.description;
  sideBar.appendChild(description);
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
      Model3dScreen: data.postData[0].Screen_Model_Route,
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
      dataPost[data.infoSeller[0].Names].Model3dScreen === ''
        ? dataPost[data.infoSeller[0].Names].RouteImages[0]
        : [
            dataPost[data.infoSeller[0].Names].Model3dScreen,
            dataPost[data.infoSeller[0].Names].Model_Route,
          ],
    secondImg:
      dataPost[data.infoSeller[0].Names].RouteImages.length < 2
        ? dataPost[data.infoSeller[0].Names].RouteImages[0]
        : dataPost[data.infoSeller[0].Names].RouteImages[1],
    lastImg:
      dataPost[data.infoSeller[0].Names].RouteImages.length < 3
        ? dataPost[data.infoSeller[0].Names].RouteImages.length < 2
          ? dataPost[data.infoSeller[0].Names].RouteImages[0]
          : dataPost[data.infoSeller[0].Names].RouteImages[1]
        : dataPost[data.infoSeller[0].Names].RouteImages[2],
    avatar: dataPost[data.infoSeller[0].Names].Avatar,
    name: dataPost[data.infoSeller[0].Names].Seller,
    rating: dataPost[data.infoSeller[0].Names].Rating,
    email: dataPost[data.infoSeller[0].Names].Email,
    description: dataPost[data.infoSeller[0].Names].Description,
  });
};

loadPost();
>>>>>>> Stashed changes
