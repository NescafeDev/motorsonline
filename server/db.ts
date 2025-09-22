import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: '185.7.252.206',
  user: 'vhost133032s1', // change as needed
  password: 'OqqdFUAmuq+', // change as needed
  database: 'vhost133032s1',
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