const connectToBD = require('../config/config');
const express = require('express');
app = express();
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwtUtil");
app.use(express.json());

exports.getAllAccessTries = async function (req, res) {
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(
            `SELECT TA.uidrfid , TA.tentativedatetime ,TA.status
             FROM TentativeAcces TA`
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Aucune tentative trouvée",
                accessTries: []
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "tentatives récupérées avec succès",
            accessTries: rows
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des tentatives",
            accessTries: []
        });
    }
};