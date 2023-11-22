const CreatePost = document.getElementById('CreatePost');

CreatePost.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append('name', e.target.title.value);
  formData.append('description', e.target.description.value);
  formData.append('cost', e.target.cost.value);
  formData.append('type', e.target.type.value);

  const screen = e.target.screen.files[0];
  const pos = screen.name.lastIndexOf('.');
  const type = screen.name.slice(pos);
  const modifiedFile = new File([screen], `screen${type}`, {
    type: screen.type,
  });

  formData.append('postImages', modifiedFile);

  // Loop through and append each file from e.target.files.files
  const arrFiles = Object.values(e.target.files.files);

  arrFiles.forEach((file) => {
    formData.append('postImages', file);
  });

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
});
