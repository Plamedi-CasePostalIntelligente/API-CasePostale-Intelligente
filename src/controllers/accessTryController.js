const pool = require('../config/config');
const express = require('express');
app = express();
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwtUtil");
app.use(express.json());

exports.getAllAccessTries = async function (req, res) {
    try {
        const [rows] = await pool.query(
            `SELECT TA.uid, TA.tentativedatetime, TA.status
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

exports.InsertAccessTries = async function (req, res) {
    try {
        const { uid, status } = req.body;
        const tentativedatetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const raison = status ? "Reussi" : "Carte non autorisé";

        if (!uid || status === undefined) {
            return res.status(400).json({
                success: false,
                message: "Les champs uid et status sont requis",
                accessTry: null
            });
        }

        const [result] = await pool.query(
            `INSERT INTO TentativeAcces (uid, tentativedatetime, status, raison)
             VALUES (?, ?, ?, ?)`,
            [uid, tentativedatetime, !!status, raison]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: "Échec de l'insertion de la tentative",
                accessTry: null
            });
        }

        const insertedTry = { uid, tentativedatetime, success: !!status, raison };
        return res.status(201).json({
            success: true,
            message: "Tentative insérée avec succès",
            accessTry: insertedTry
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'insertion de la tentative",
            accessTry: null
        });
    }
};