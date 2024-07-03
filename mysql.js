const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "db_boda",
});

// Conectar a MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conexión establecida con MySQL');
});

// Middleware para procesar JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Ruta para manejar el POST del formulario
app.post('/sub', (req, res) => {
  const { nombres, apellidos, cantidad_acompanantes } = req.body;
  const acompañantes = [];

  // Insertar invitado
  const sqlInvitado = 'INSERT INTO tbl_invitado (nombres, apellidos) VALUES (?, ?)';
  connection.query(sqlInvitado, [nombres, apellidos], (err, resultInvitado) => {
    if (err) {
      console.error('Error al insertar invitado en la base de datos:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }

    // Obtener el ID del invitado insertado
    const invitadoId = resultInvitado.insertId;

    // Insertar acompañantes
    for (let i = 1; i <= cantidad_acompanantes; i++) {
      const acompañanteNombre = req.body[`acompanante_${i}`];
      const sqlAcompanante = 'INSERT INTO tbl_acompanante (invitado_id, nombre) VALUES (?, ?)';
      connection.query(sqlAcompanante, [invitadoId, acompañanteNombre], (errAcompanante, resultAcompanante) => {
        if (errAcompanante) {
          console.error('Error al insertar acompañante en la base de datos:', errAcompanante);
          res.status(500).send('Error interno del servidor');
          return;
        }
        console.log(`Acompañante ${acompañanteNombre} insertado correctamente para el invitado ${invitadoId}`);
      });
    }

    console.log('Datos insertados correctamente');
    res.status(200).send('Datos insertados correctamente');
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});