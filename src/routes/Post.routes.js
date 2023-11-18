import { Router } from 'express';
import { authSeller, authUser } from '../middlewares/auth.js';
import { createPost, ShowPosts, ShowPost } from './controllers/Posts.js';

const routes = Router();

routes.post('/createPost', authSeller, createPost);
routes.get('/loadPosts', ShowPosts);
routes.get('/loadPost/:post', ShowPost);
routes.get('/editPost/:email', authUser, authSeller, async (req, res) => {});

export default routes;
