import jwt from 'jsonwebtoken';
import { SECRET } from '../conf.js';

export const authUser = (req, res, next) => {
  const { normalUser } = req.cookies;

  if (normalUser) {
    const response = jwt.verify(normalUser, SECRET);

    if (!response) {
      return res.redirect('/signIn');
    } else {
      next();
    }
  } else {
    return res.redirect('/signIn');
  }
};

export const authSeller = (req, res, next) => {
  const { Seller } = req.cookies;

  if (Seller) {
    const response = jwt.verify(Seller, SECRET);

    console.log('se ejecuto');

    if (!response) {
      return res.redirect('/signIn');
    } else {
      next();
    }
  } else {
    return res.redirect('/signIn');
  }
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
