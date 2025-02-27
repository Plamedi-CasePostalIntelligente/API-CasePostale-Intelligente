const sql = require('mysql2');
const dotenv = require('dotenv');
const connectToBD = require('../config/config');
const express = require('express');
app = express();
app.use(express.json());


exports.getUser = async function (req, res) {
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(' SELECT * FROM Clients');
        console.log(rows);
        return res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la récupération des clients" });
    }
}
