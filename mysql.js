const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost', // Cambia esto si tu base de datos no está en localhost
  user: 'root', // Tu usuario de MySQL
  password: 'rootroot', // Tu contraseña de MySQL
  database: 'bdd_boda' // El nombre de tu base de datos
});

connection.connect((err) => {
    if(err) throw err
    console.log('conexion establecida')
}) 
