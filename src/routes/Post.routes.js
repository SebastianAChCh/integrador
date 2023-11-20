import { Router } from 'express';
import {
  createPost,
  ShowPosts,
  ShowPost,
  loadPostsByType,
} from './controllers/Posts.js';

const routes = Router();

routes.post('/createPost', createPost);
routes.get('/loadPosts', ShowPosts);
routes.get('/loadPost/:post', ShowPost);
routes.get('/loadPosts/:category', loadPostsByType);

export default routes;
