import { config } from 'dotenv';

config();

export const PORT = process.env.PORT;
export const PORT_DATABASE = process.env.PORT_DATABASE;
export const DATABASE = process.env.DATABASE;
export const USER_DATABASE = process.env.USER_DATABASE;
export const PASSWORD_DATABASE = process.env.PASSWORD_DATABASE;
export const HOST_DATABASE = process.env.HOST_DATABASE;
export const SECRET = process.env.SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const JWT_EXP_COOKIE = process.env.JWT_EXP_COOKIE;
export const STRIPE_KEY_SECRET = process.env.SECRET_KEY_STRIPE;
export const STRIPE_KEY_PUBLIC = process.env.PUBLIC_KEY_STRIPE;
