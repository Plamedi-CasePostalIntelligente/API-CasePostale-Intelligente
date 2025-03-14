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
<<<<<<< HEAD
        const pool = await sql.createPool(dbConfig);
        const connection = await pool.getConnection();
=======
        const connection = await sql.createPool(dbConfig);
        console.log("Connexion à la base de données réussie !");
        return connection;

>>>>>>> 12b6dbb8dc904de8524e997b12975786f8c4eb2b

    } catch (err) {
        console.error("Erreur de connexion à la base de données : ", err);
    }
}

module.exports = connectToBD;