const getProfileData = async () => {
  const response = await fetch('http://localhost:4000/userData', {
    method: 'GET',
  });

  const data = await response.json();

  console.log(data);
};

getProfileData();
