const express = require('express');
const cors = require('cors');
const connectToBD = require('./config/config');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

connectToBD();

app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Case Postale Intelligente !');
});

const usersRoute = require('./routes/usersRoute');
app.use('/api/users', usersRoute);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur !' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

