const connectToBD = require('../config/config');
const express = require('express');
app = express();
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwtUtil");
app.use(express.json());

exports.getAllCity = async function (req, res) {
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(
            `SELECT V.ville
             FROM Ville V`
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Aucune ville trouvée",
                cities: []
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "villes récupérées avec succès",
            cities: rows
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des villes",
            cities: []
        });
    }
};