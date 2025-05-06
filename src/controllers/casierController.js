const pool = require('../config/config');
const express = require('express');
app = express();
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwtUtil");
app.use(express.json());

exports.getAllCasierStatut = async function (req, res) {
    try {
        const [rows] = await pool.query(
            `SELECT 
                C.id_casier AS id,
                V.ville,
                C.erreur_temperature,
                C.erreur_oled,
                C.erreur_porte,
                C.temperature_status,
                C.oled_status,
                C.rfid_status,
                C.ultrasonic_status
             FROM Casiers C
             JOIN Ville V ON C.id_ville = V.idville`
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Aucun casier trouvé",
                casiers: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Casiers récupérés avec succès",
            casiers: rows
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des casiers",
            casiers: []
        });
    }
};