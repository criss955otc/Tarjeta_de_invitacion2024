const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Asegúrate de manejar JSON también


// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'bdd_boda'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as ID', connection.threadId);
});




app.get("/ingreso", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Ruta para manejar el envío del formulario
app.post('/sub', (req, res) => {
    const { nombres, apellidos, cantidad_acompanantes, ...acompanantes } = req.body;

    // Insertar en la tabla tbl_invitado
    connection.query('INSERT INTO tbl_invitado (nombres, apellidos) VALUES (?, ?)', [nombres, apellidos], (err, result) => {
        if (err) {
            console.error('Error insertando en tbl_invitado:', err);
            res.status(500).send('Error insertando en tbl_invitado');
            return;
        }

        const invitadoId = result.insertId;

        // Insertar en la tabla tbl_acompa
        const values = [];
        for (let i = 1; i <= cantidad_acompanantes; i++) {
            values.push([invitadoId, acompanantes[`acompanante${i}`]]);
        }

        connection.query('INSERT INTO tbl_acompa (id_invitado, nombre_acompanante) VALUES ?', [values], (err, result) => {
            if (err) {
                console.error('Error insertando en tbl_acompa:', err);
                res.status(500).send('Error insertando en tbl_acompa');
                return;
            }
            res.send('Datos insertados correctamente');
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}/`);
});

