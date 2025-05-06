const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectTimeout: 10000,
    waitForConnections: true,
    connectionLimit: 10, // Limite à 10 connexions simultanées
    queueLimit: 0 // Pas de limite pour les requêtes en attente
};

// Créer un pool global unique
const pool = mysql.createPool(dbConfig);

pool.getConnection()
    .then(() => console.log("Connexion à la base de données réussie !"))
    .catch(err => console.error("Erreur de connexion à la base de données : ", err));

module.exports = pool;