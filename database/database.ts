// database/database.ts
import mysql from 'mysql2/promise';


const pool = mysql.createPool({
  host: 'localhost',         // Cambia según tu configuración
  user: 'root',         // Tu usuario de la BD
  password: '1998Javi',  // Tu contraseña
  database: 'myCierzoApp',   // El nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 3306
});

export default pool;
