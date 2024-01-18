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
