require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql2/promise');

const app = express();
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootroot',
  database: process.env.DB_NAME || 'bdd_boda',
  charset: 'utf8mb4',
  connectionLimit: 5,
});
const evento = { fecha: process.env.EVENT_DATE || '2024-07-20T11:30:00-05:00' };

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.render('index', { evento, confirmado: req.query.confirmado === '1' }));

app.post('/sub', async (req, res) => {
  const limpio = (v) => String(v || '').trim().slice(0, 100);
  const nombres = limpio(req.body.nombres);
  const apellidos = limpio(req.body.apellidos);
  const cantidad = Math.min(Math.max(parseInt(req.body.cantidad_acompanantes, 10) || 0, 0), 4);
  const acompanantes = [];
  for (let i = 1; i <= cantidad; i++) acompanantes.push(limpio(req.body[`acompanante_${i}`]));

  const json = req.is('json');
  if (!nombres || !apellidos || acompanantes.some((n) => !n)) {
    const error = 'Completa tu nombre, apellido y el nombre de cada acompañante.';
    return json ? res.status(400).json({ error }) : res.status(400).send(error);
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.query('INSERT INTO tbl_invitado (nombres, apellidos) VALUES (?, ?)', [nombres, apellidos]);
    if (acompanantes.length) {
      await conn.query('INSERT INTO tbl_acompa (id_invitado, nombre_acompanante) VALUES ?', [acompanantes.map((n) => [r.insertId, n])]);
    }
    await conn.commit();
    json ? res.json({ ok: true, mensaje: '¡Gracias! Tu asistencia quedó confirmada.' }) : res.redirect('/?confirmado=1#confirmar');
  } catch (err) {
    await conn.rollback();
    console.error('Error al guardar la confirmación:', err);
    const error = 'No pudimos guardar tu confirmación. Inténtalo de nuevo en unos minutos.';
    json ? res.status(500).json({ error }) : res.status(500).send(error);
  } finally {
    conn.release();
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Servidor en http://localhost:' + (process.env.PORT || 3000)));
