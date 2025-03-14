const connectToBD = require('../config/config');
const express = require('express');
app = express();
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwtUtil");
app.use(express.json());

exports.getAllDelivery = async function (req, res) {
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(
            `SELECT L.description, L.expediteur, L.is_delivered, L.adresse
             FROM Livraisons L`
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Aucune livraison trouvée",
                deliveries: []
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Livraisons récupérées avec succès",
            deliveries: rows
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des livraisons",
            deliveries: []
        });
    }
};