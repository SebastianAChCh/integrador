<<<<<<< Updated upstream
import { Router } from 'express';
import { authSeller } from '../middlewares/auth.js';
import { createPost, ShowPosts, ShowPost } from './controllers/Posts.js';

const routes = Router();

routes.post('/createPost', authSeller, createPost);
routes.get('/loadPosts', ShowPosts);
routes.get('/loadPost/:post', ShowPost);

export default routes;
=======
import { Router } from 'express';
import {
  createPost3D,
  createPost,
  ShowPosts,
  ShowPost,
  loadPostsByType,
  showProfessions,
} from './controllers/Posts.js';

const routes = Router();

routes.post('/createPost3D', createPost3D);
routes.post('/createPost', createPost);
routes.get('/loadPosts', ShowPosts);
routes.get('/getProfessions', showProfessions);
routes.get('/loadPost/:post', ShowPost);
routes.get('/loadPosts/:category', loadPostsByType);

export default routes;
>>>>>>> Stashed changes
