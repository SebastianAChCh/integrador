const CreatePost = document.getElementById('CreatePost');
let error = false;

CreatePost.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append('name', e.target.title.value);
  formData.append('description', e.target.description.value);
  formData.append('type', e.target.type.value);

  console.log(e.target.screen.files);
  const screen = e.target.screen.files[0];
  const modifiedFile = new File([screen], `screen.png`, {
    type: '.png',
  });

  formData.append('postImages', modifiedFile);

  // Loop through and append each file from e.target.files.files
  const arrFiles = Object.values(e.target.files.files);
  arrFiles.forEach((file, currentPos) => {
    console.log(file.type.split('/')[2]);
    formData.append('postImages', file);
  });

  const response = await fetch(`${location.origin}/createPost3D`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (data.status === 'ok') {
    setTimeout(() => {
      location.href = '/';
    }, 3000);
  }
});
