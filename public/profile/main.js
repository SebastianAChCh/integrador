const createCard = (data) => {
  const completeInfo = document.getElementById('informationcomplet');
  const avatar = document.createElement('img');
  avatar.classList.add('profile');
  avatar.src = data.avatar;
};

const getProfileData = async () => {
  const response = await fetch('http://localhost:4000/userData', {
    method: 'GET',
  });

  const data = await response.json();

  console.log(data);
};

getProfileData();
