const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const app = express();
// Middleware para analizar cuerpos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para solicitudes con cuerpos codificados en URL

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const tareaRoutes = require('./routes/tareas');
app.use('/api/tareas', tareaRoutes);

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('API de gestion de tareas');
});

// Verificar conexión a la base de datos
pool.connect((err, client, release) => {
  if (err) {
      return console.error('Error al conectar a la base de datos:', err.stack);
  }
  console.log('Conectado a la base de datos PostgreSQL');
  release(); // Libera el cliente de la conexión
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
