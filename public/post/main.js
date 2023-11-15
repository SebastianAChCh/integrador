const title = document.getElementById('title');
const content = document.getElementById('content');

const createCard = (data) => {
  const fragment = document.createDocumentFragment();
  const container = document.getElementById('container');
  const mainA = document.createElement('a');
  const mainImg = document.createElement('img');
  mainA.setAttribute('data-lightbox', 'galeria');
  mainA.setAttribute('data-title', 'Imagen 1');
  mainImg.classList.add('item');
  mainImg.src = data.primaryImg;
  mainA.appendChild(mainImg);
  const secondaryContainer = document.createElement('div');
  const secondA = document.createElement('a');
  const secondImg = document.createElement('img');
  secondImg.classList.add('item');
  secondImg.src = data.secondaryImg;
  secondA.setAttribute('data-lightbox', 'galeria');
  secondA.setAttribute('data-title', 'Imagen 2');
  secondA.appendChild(secondImg);
  const thirdA = document.createElement('a');
  const thirdImg = document.createElement('img');
  thirdImg.classList.add('item');
  thirdImg.src = data.lastImg;
  thirdA.setAttribute('data-lightbox', 'galeria');
  thirdA.setAttribute('data-title', 'Imagen 3');
  thirdA.appendChild(thirdImg);
  secondaryContainer.append(secondA, thirdA);
  fragment.append(mainA, secondaryContainer);
  container.appendChild(fragment);
};

const loadPost = async () => {
  const response = await fetch(
    `http://localhost:4000/loadPost/${title.innerText}`,
    {
      method: 'GET',
    }
  );

  const data = await response.json();
};

loadPost();

/**
 *    img1: post.images[0].slice(7),
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
 */
