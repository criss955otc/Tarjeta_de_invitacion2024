const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql2');
const myConnection = require('express-myconnection');
const bodyParser = require('body-parser');

const app = express();

// Ajustes
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'bdd_boda'
}, 'single'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta principal
app.get('/', (req, res) => {
    res.render('index');
});

// Ruta para mostrar el formulario
app.get('/form', (req, res) => {
    res.render('form');
});

// Ruta para manejar la inserción de datos
app.post('/sub', (req, res) => {
    const { nombres, apellidos, cantidad_acompanantes } = req.body;

    req.getConnection((err, connection) => {
        if (err) {
            console.error('Error de conexión:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Insertar invitado
        const sqlInvitado = 'INSERT INTO tbl_invitado (nombres, apellidos) VALUES (?, ?)';
        connection.query(sqlInvitado, [nombres, apellidos], (errInvitado, resultInvitado) => {
            if (errInvitado) {
                console.error('Error al insertar invitado en la base de datos:', errInvitado);
                res.status(500).send('Error interno del servidor');
                return;
            }

            // Obtener el ID del invitado insertado
            const invitadoId = resultInvitado.insertId;

            // Insertar acompañantes si hay cantidad_acompanantes > 0
            if (cantidad_acompanantes > 0) {
                const acompañantes = [];
                for (let i = 1; i <= cantidad_acompanantes; i++) {
                    const acompañanteNombre = req.body[`acompanante_${i}`];
                    acompañantes.push([invitadoId, acompañanteNombre]);
                }

                const sqlAcompanante = 'INSERT INTO tbl_acompa (id_invitado, nombre_acompanante) VALUES ?';
                connection.query(sqlAcompanante, [acompañantes], (errAcompanantes, resultAcompanantes) => {
                    if (errAcompanantes) {
                        console.error('Error al insertar acompañantes en la base de datos:', errAcompanantes);
                        res.status(500).send('Error interno del servidor');
                        return;
                    }

                    console.log(`Acompañantes insertados correctamente para el invitado ${invitadoId}`);
                    console.log('Datos insertados correctamente');
                    res.status(200).send('Datos insertados correctamente');
                });
            } else {
                console.log('Datos insertados correctamente (sin acompañantes)');
                res.status(200).send('Datos insertados correctamente (sin acompañantes)');
            }
        });
    });
});

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log('Server en puerto', app.get('port'));
});
