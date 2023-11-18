import jwt from 'jsonwebtoken';
import { SECRET } from '../conf.js';

export const authUser = (req, res, next) => {
  const { normalUser } = req.cookies;

  if (!normalUser) {
    return res.redirect('/');
  }

  const user = jwt.verify(normalUser, SECRET);

  if (!user) {
    return res.redirect('/');
  }

  next();
};

export const authSeller = (req, res, next) => {
  const { Seller } = req.cookies;

  if (!Seller) return res.redirect('/');

  const seller = jwt.verify(Seller, SECRET);

  if (!seller) return res.redirect('/');

  next();
};

export const userExist = (req, res, next) => {
  const { normalUser } = req.cookies;

  if (normalUser) {
    return res.redirect('/');
  }

  next();
};

export const sellerExist = (req, res, next) => {
  const { Seller } = req.cookies;

  if (Seller) return res.redirect('/');

  next();
};
