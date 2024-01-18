const CreatePost = document.getElementById('CreatePost');
let error = false;

CreatePost.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append('name', e.target.title.value);
  formData.append('description', e.target.description.value);
  formData.append('type', e.target.type.value);

  // Loop through and append each file from e.target.files.files
  const arrFiles = Object.values(e.target.files.files);

  arrFiles.forEach((file) => {
    if (file.type.startsWith('image')) {
      formData.append('postImages', file);
    } else {
      error = true;
      document.getElementById('error').style = 'display:block; color:#ffffff';
    }
  });

  if (!error) {
    const response = await fetch(`${location.origin}/createPost`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.status === 'ok') {
      setTimeout(() => {
        location.href = '/';
      }, 3000);
    }
  }
});
