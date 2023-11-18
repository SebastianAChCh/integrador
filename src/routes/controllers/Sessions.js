import bcrypt from 'bcrypt';
import Pool from '../../db/db.js';
import jwt from 'jsonwebtoken';
import { SECRET, JWT_EXP_COOKIE } from '../../conf.js';

//Creacion de cuenta normal
export const SingUp = async (req, res) => {
  try {
    const { names, lastnames, email, pass, phone } = req.body;

    if (!names || !lastnames || !email || !pass || !phone)
      return res.status(400).json({
        status: 'failed',
        message: 'error, the field can not be avoid',
      });

    const [exist] = await Pool.query('SELECT * FROM users WHERE Names = ?', [
      names,
    ]);

    if (exist.length > 1)
      return res.status(400).json({
        status: 'failed',
        message: 'That user already exist',
      });

    const encryptPass = await bcrypt.hash(pass, 10);

    const [rows] = await Pool.query(
      'INSERT INTO users ( Names, LastNames, Email, Password, Phone, IsSeller) VALUES (?,?,?,?,?,?)',
      [names, lastnames, email, encryptPass, phone, 0]
    );

    if (rows.affectedRows < 1)
      return res.status(500).json({
        status: 'failed',
        message: 'There was an unexpected error creating the user',
      });

    const [_user] = await Pool.query(`CALL getUserID(?, @user)`, [email]);
    const [userID] = await Pool.query(`SELECT @user as userID`);

    const tokenUser = jwt.sign({ user: userID[0].userID }, SECRET, {
      expiresIn: JWT_EXP_COOKIE * 24 * 60 * 60 * 1000,
    });

    const cookieOptions = {
      expiresIn: JWT_EXP_COOKIE * 24 * 60 * 60 * 1000,
      path: '/',
    };

    res.cookie('normalUser', tokenUser, cookieOptions);
    res.cookie('userEmail', email, cookieOptions);

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.log(error);
  }
};

//Inicio de sesion
export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { normalUser } = req.cookies;
    console.log(email, password);
    if (normalUser)
      return res.status(400).json({
        status: 'failed',
        message: 'Error, you already log in',
      });

    if (!email || !password)
      return res.status(404).json({
        status: 'failed',
        message: 'the fields can not be avoid',
      });

    const [userIS] = await Pool.query(
      'SELECT ID, Names, Email, Password FROM users WHERE Email = ?',
      [email]
    );

    if (userIS.length < 1) {
      return res.status(404).json({
        status: 'failed',
        message: 'Error, that user does not exist',
      });
    }

    const compare = await bcrypt.compare(password, userIS[0].Password);

    if (!compare)
      return res.status(400).json({
        status: 'failed',
        message: 'Error, the password is incorrect',
      });

    const tokenUser = jwt.sign({ user: userIS[0].ID }, SECRET, {
      expiresIn: JWT_EXP_COOKIE * 24 * 60 * 60 * 1000,
    });

    const cookieOptions = {
      expiresIn: JWT_EXP_COOKIE * 24 * 60 * 60 * 1000,
      path: '/',
    };

    const [sellerIS] = await Pool.query(
      'SELECT ID FROM seller WHERE ID_USER = ?',
      [userIS[0].ID]
    );

    if (sellerIS.length > 0) {
      const token = jwt.sign({ seller: sellerIS[0].ID }, SECRET, {
        expiresIn: JWT_EXP_COOKIE * 24 * 60 * 60 * 1000,
      });

      res.cookie('Seller', token, cookieOptions);
    }

    res.cookie('normalUser', tokenUser, cookieOptions);
    res.cookie('userEmail', email, cookieOptions);
    res.status(200).json({ status: 'ok', Names: userIS[0].Names });
  } catch (error) {
    console.log(error);
  }
};

//Creacion de cuenta de vendedor
export const createAccountSeller = async (req, res) => {
  try {
    const { normalUser, Seller } = req.cookies;
    const { NoEmision, NoIne, curp, claveElector, birth } = req.body;
    const UserIs = jwt.verify(normalUser, SECRET);

    if (Seller)
      return res.status(409).json({
        status: 'failed',
        message: 'You already an account of seller',
      });

    if (!UserIs)
      return res.status(404).json({
        status: 'failed',
        message: 'you do not have an account of seller',
      });

    if (!NoEmision || !NoIne || !curp || !claveElector || !birth)
      return res.status(400).json({
        status: 'failed',
        message: 'The fields can not be avoid',
      });

    const [SellerExist] = await Pool.query(
      'SELECT IsSeller FROM users WHERE id = ?',
      [UserIs.user]
    );

    if (SellerExist[0].IsSeller == 1)
      return res.status(409).json({
        status: 'failed',
        message: 'You already have an account as seller',
      });

    const [seller] = await Pool.query(
      'INSERT INTO seller (ID_USER, Birth_Date, ClaveElector, Curp, NoIne, NoEmision, Calificaciones) VALUES (?,?,?,?,?,?,?)',
      [UserIs.user, birth, claveElector, curp, NoIne, NoEmision, 0]
    );

    if (seller.affectedRows < 1)
      return res.status(500).json({
        status: 'failed',
        message: 'there was an error creating the account',
      });

    const [id] = await Pool.query('SELECT ID FROM seller WHERE ID_USER = ?', [
      UserIs.user,
    ]);

    const SellerIs = jwt.sign({ seller: id[0].ID }, SECRET, {
      expiresIn: JWT_EXP_COOKIE * 24 * 60 * 60 * 1000,
    });

    res.cookie('Seller', SellerIs, {
      expiresIn: JWT_EXP_COOKIE * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.log(error);
  }
};
