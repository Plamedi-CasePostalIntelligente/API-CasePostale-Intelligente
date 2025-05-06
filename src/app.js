const express = require('express');
const cors = require('cors');
const pool = require('./config/config'); // Importer le pool (optionnel, juste pour clarté)
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Case Postale Intelligente !');
});

const usersRoute = require('./routes/usersRoute');
const lockersRoute = require('./routes/lockersRoute');
const brokerRoute = require('./routes/brokerRoute');
const deliveryRoute = require('./routes/deliveryRoute');
const cityRoute = require('./routes/cityRoute');
const accessTryRoute = require('./routes/accessTryRoute');
const casierRoute = require('./routes/casierRoute');

// Routes
app.use('/api/users', usersRoute);
app.use('/api/lockers', lockersRoute);
app.use('/api/broker', brokerRoute);
app.use('/api/delivery', deliveryRoute);
app.use('/api/city', cityRoute);
app.use('/api/accesstry', accessTryRoute);
app.use('/api/casier', casierRoute);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur !' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});