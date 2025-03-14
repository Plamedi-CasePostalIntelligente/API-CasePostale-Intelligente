const sql = require('mysql2/promise');  // Notez le /promise ici
const dotenv = require('dotenv');
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectTimeout: 10000
}

const connectToBD = async () => {
    try {
        const connection = await sql.createPool(dbConfig);
        console.log("Connexion à la base de données réussie !");
        return connection;


    } catch (err) {
        console.error("Erreur de connexion à la base de données : ", err);
    }
}

module.exports = connectToBD;