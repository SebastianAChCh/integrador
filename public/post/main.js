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
