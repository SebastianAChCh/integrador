import { createPool } from 'mysql2/promise.js';
import {
  PORT_DATABASE,
  DATABASE,
  USER_DATABASE,
  PASSWORD_DATABASE,
  HOST_DATABASE,
} from '../conf.js';

const Pool = createPool({
  database: DATABASE,
  password: PASSWORD_DATABASE,
  user: USER_DATABASE,
  host: HOST_DATABASE,
  port: PORT_DATABASE,
});

export default Pool;
