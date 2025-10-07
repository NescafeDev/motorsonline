import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12801757', // change as needed
  password: '3IfLc2uf4B', // change as needed
  database: 'sql12801757',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}); 


// export const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root', // change as needed
//   password: '', // change as needed
//   database: 'motorsonline',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// }); 