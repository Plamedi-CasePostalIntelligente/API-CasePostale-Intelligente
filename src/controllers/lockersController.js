const pool = require('../config/config');
const express = require('express');
app = express();
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwtUtil");
app.use(express.json());

exports.updateCaseState = async function (req, res) {
    const uid = req.body.uid;
    const newfillValue1 = 1; // Valeur pour "plein"
    const newfillValue2 = 0; // Valeur pour "vide"

    try {
        const [rows] = await pool.query(
            `SELECT C.is_full
             FROM Casiers C
             INNER JOIN Livraisons L ON C.id_casier = L.id_casier
             INNER JOIN Users U ON (L.id_client = U.id_user OR L.id_facteur = U.id_user)
             WHERE U.uid = ?`,
            [uid]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Locker not found" });
        }
        const newValue = rows[0].is_full === 0 ? newfillValue1 : newfillValue2;

        const [row2] = await pool.query(
            `UPDATE Casiers C
             INNER JOIN Livraisons L ON C.id_casier = L.id_casier
             INNER JOIN Users U ON (L.id_client = U.id_user OR L.id_facteur = U.id_user)
             SET C.is_full = ?
             WHERE U.uid = ?`,
            [newValue, uid]
        );

        if (row2.affectedRows === 0) {
            return res.status(400).json({ message: "Aucune mise à jour effectuée" });
        }
        const response = newValue;
        return res.status(200).json({ response, message: "Casier state updated" });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

exports.updateDeliveryState = async function (req, res) {
    const uid = req.body.uid;
    let response = '';

    try {
        const [rows] = await pool.query(
            `SELECT L.is_delivered
             FROM Livraisons L
             INNER JOIN Casiers C ON C.id_casier = L.id_casier
             INNER JOIN Users U ON (L.id_client = U.id_user OR L.id_facteur = U.id_user)
             WHERE U.uid = ?`,
            [uid]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Delivery not found" });
        }
        const newValue = rows[0].is_delivered === 0 ? 1 : 0;

        const [row2] = await pool.query(
            `UPDATE Livraisons L
             INNER JOIN Users U ON (L.id_client = U.id_user OR L.id_facteur = U.id_user)
             SET L.is_delivered = ?
             WHERE U.uid = ?`,
            [newValue, uid]
        );

        if (row2.affectedRows === 0) {
            return res.status(400).json({ message: "Aucune mise à jour effectuée" });
        }

        response = newValue;
        return res.status(200).json({ isDelivered: response, message: "Delivery state updated" });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

exports.verifyIfFactor = async function (req, res) {
    const uid = req.params.uid;
    try {
        const [rows] = await pool.query('SELECT U.is_facteur FROM Users U WHERE U.uid = ?', [uid]);

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFacteur = rows[0].is_facteur;
        const UserType = isFacteur ? "Factor" : "Client";
        return res.status(200).json({ is_facteur: isFacteur, UserType });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};

exports.verifyIfHasDelivery = async function (req, res) {
    const uid = req.params.uid;
    try {
        const [rows] = await pool.query(
            `SELECT L.id_facteur , L.id_client
             FROM Livraisons L
             INNER JOIN Users U ON (L.id_client = U.id_user OR L.id_facteur = U.id_user)
             WHERE U.uid = ?`,
            [uid]
        );

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const idFactorHasDelivery = rows[0].id_facteur;
        const idClientHasDelivery = rows[0].id_client;
        const hasFactorDelivery = idFactorHasDelivery ? "1" : "0";
        return res.status(200).json({ hasFactorDelivery, idFactorHasDelivery, idClientHasDelivery });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};

exports.isDelivered = async function (req, res) {
    const uid = req.params.uid;
    try {
        const [rows] = await pool.query(
            `SELECT L.is_delivered , L.id_client
             FROM Livraisons L
             INNER JOIN Users U ON (L.id_client = U.id_user OR L.id_facteur = U.id_user)
             WHERE U.uid = ?`,
            [uid]
        );

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const isDelivered = rows[0].is_delivered;
        const isClientDelivered = isDelivered ? "Delivered" : "Not delivered";

        return res.status(200).json({ isClientDelivered, isDelivered });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};

exports.isCaseFilled = async function (req, res) {
    const uid = req.params.uid;
    try {
        const [rows] = await pool.query(
            `SELECT C.is_full 
             FROM Casiers C
             INNER JOIN Livraisons L ON C.id_casier = L.id_casier
             INNER JOIN Users U ON (L.id_client = U.id_user OR L.id_facteur = U.id_user)
             WHERE U.uid = ?`,
            [uid]
        );

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFull = rows[0].is_full;
        const isClientCaseFull = isFull ? "Full" : "empty";

        return res.status(200).json({ isClientCaseFull, isFull });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};

exports.isCaseEmptied = async function (req, res) {
    const uid = req.params.uid;
    try {
        const [rows] = await pool.query(
            `SELECT C.is_full
             FROM Casiers C
             INNER JOIN Livraisons L ON C.id_casier = L.id_casier
             INNER JOIN Users U ON (L.id_facteur = U.id_user OR L.id_client = U.id_user)
             WHERE U.uid = ?`,
            [uid]
        );

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFull = rows[0].is_full;
        const isFactorCaseEmpty = !isFull ? "Empty" : "Full";

        return res.status(200).json({ isFactorCaseEmpty, isFull });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};

exports.openCase = async function (req, res) {
    const uid = req.params.uid;
    try {
        const [rows] = await pool.query(
            `SELECT C.numero_casier
             FROM Casiers C
             INNER JOIN Livraisons L ON C.id_casier = L.id_casier
             INNER JOIN Users U ON (L.id_facteur = U.id_user OR L.id_client = U.id_user)
             WHERE U.uid = ?`,
            [uid]
        );

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const caseNumbers = rows.map(row => row.numero_casier);
        
        return res.status(200).json({
            isCaseNumber: "yes",
            caseNumbers: caseNumbers
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};