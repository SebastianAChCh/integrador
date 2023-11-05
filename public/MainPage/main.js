const content = document.getElementById('content');

const createCard = ({ img1, img2, title, description }) => {
  content.innerHTML += `
  <a href="/post/${title}" target="_blank">
    <img class="h-20" src="${img1}">
    <img class="h-20" src="${img2}">
    <button></button>
    <h1>${title}</h1>
    <p>${description}</p>
  </a>`;
};

const loadPosts = async () => {
  const postStorage = {};
  const response = await fetch('http://localhost:4000/loadPosts', {
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
      img2: post.images[1].slice(7),
      title: post.name,
      description: post.description,
    });
  });
};

loadPosts();
