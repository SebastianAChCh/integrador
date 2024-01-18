<<<<<<< Updated upstream
const CreatePost = document.getElementById('CreatePost');

CreatePost.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append('name', e.target.name.value);
  formData.append('description', e.target.description.value);
  formData.append('cost', e.target.cost.value);

  const screen = e.target.screen.files[0];
  const pos = screen.name.lastIndexOf('.');
  const type = screen.name.slice(pos);
  const modifiedFile = new File([screen], `screen${type}`, {
    type: screen.type,
  });

  const arrFiles = Object.values(e.target.files.files);

  arrFiles.push(modifiedFile);

  arrFiles.forEach((file) => {
    formData.append(`files`, file);
  });
  formData.append('type', e.target.kind.value);

  const response = await fetch('http://localhost:4000/createPost', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (data.status === 'ok') {
    const result = await Swal.fire({
      title: 'Post created successfully!',
      text: 'Click in ok to go to the main page or wait 3 seconds',
      icon: 'success',
      confirmButtonText: 'Ok',
    });
    if (result.isConfirmed) {
      location.href = '/';
    }
    setTimeout(() => {
      location.href = '/';
    }, 3000);
  }
});
=======
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
>>>>>>> Stashed changes
