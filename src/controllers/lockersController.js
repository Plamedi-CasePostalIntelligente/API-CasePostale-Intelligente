const connectToBD = require('../config/config');
const express = require('express');
app = express();
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwtUtil");
app.use(express.json());

exports.UpdateCaseState = async function (req, res) {
    const { uid } = req.body;
    var response = '';
    const newfillValue1 = 1; // Valeur pour "plein"
    const newfillValue2 = 0; // Valeur pour "vide"

    try {
        const connection = await connectToBD();

        // Vérifier l'état actuel
        const [rows] = await connection.query(
            `SELECT C.is_full
             FROM Casiers C
             INNER JOIN Livraisons L ON C.id_casier = L.id_casier
             INNER JOIN Users U ON (L.id_client = U.id_user OR L.id_facteur = U.id_user)
             WHERE U.uid_user = ?`,
            [req.body.uid]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Locker not found" });
        }

        // Déterminer la nouvelle valeur
        const newValue = rows[0].is_full === 0 ? newfillValue1 : newfillValue2;

        // Mettre à jour l'état
        const [row2] = await connection.query(
            `UPDATE Casiers C
             INNER JOIN Livraisons L ON C.id_casier = L.id_casier
             INNER JOIN Users U ON (L.id_client = U.id_user OR L.id_facteur = U.id_user)
             SET C.is_full = ?
             WHERE U.uid_user = ?`,
            [newValue, req.body.uid]
        );

        // Vérifier si la mise à jour a eu lieu
        if (row2.affectedRows === 0) {
            return res.status(400).json({ message: "Aucune mise à jour effectuée" });
        }

        response = newValue; // Utiliser la nouvelle valeur calculée
        return res.status(200).json({ response, message: "Casier state updated" });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};


exports.UpdateDeliveryState = async function (req, res) {
    const { uid } = req.body;
    var response = '';

    try {
        const connection = await connectToBD();

        // Vérifier l'état actuel
        const [rows] = await connection.query(
            `SELECT L.is_delivered
             FROM Livraisons L
             INNER JOIN Casiers C ON C.id_casier = L.id_casier
             INNER JOIN Users U ON (L.id_client = U.id_user OR L.id_facteur = U.id_user)
             WHERE U.uid_user = ?`,
            [req.body.uid]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Delivery not found" });
        }

        // Déterminer la nouvelle valeur
        const newValue = rows[0].is_delivered === 0 ? 1 : 0;

        // Mettre à jour l'état
        const [row2] = await connection.query(
            `UPDATE Livraisons L
             INNER JOIN Users U ON (L.id_client = U.id_user OR L.id_facteur = U.id_user)
             SET L.is_delivered = ?
             WHERE U.uid_user = ?`,
            [newValue, req.body.uid]
        );

        // Vérifier si la mise à jour a eu lieu
        if (row2.affectedRows === 0) {
            return res.status(400).json({ message: "Aucune mise à jour effectuée" });
        }

        response = newValue; // Utiliser la nouvelle valeur calculée
        return res.status(200).json({ isDelivered: response, message: "Delivery state updated" });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

exports.verifyIfFactor = async function (req, res) {
    const { uid } = req.body;
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(' SELECT U.is_facteur FROM Users U WHERE U.uid_user=?', [req.body.uid]);

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFacteur = rows[0].is_facteur;
        const UserType = isFacteur ? "Factor" : "Client";

        return res.status(200).json({ is_facteur: isFacteur, UserType });

    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};

exports.verifyIfFactorHasDelivery = async function (req, res) {
    const { uid } = req.body;
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(
            `SELECT L.id_facteur
             FROM Livraisons L
             INNER JOIN Users U ON (L.id_client = U.id_user OR L.id_facteur = U.id_user)
             WHERE U.uid_user = ?`,
            [req.body.uid]
        );

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const idHasDelivery = rows[0].id_facteur;
        const hasFactorDelivery = idHasDelivery ? "1" : "0";

        return res.status(200).json({ hasFactorDelivery, idHasDelivery });

    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};

exports.verifyIfClientHasDelivery = async function (req, res) {
    const { uid } = req.body;
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(
            `SELECT L.id_client
             FROM Livraisons L
             INNER JOIN Users U ON L.id_client = U.id_user 
             WHERE U.uid_user = ?`,
            [req.body.uid]
        );

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const idhasDelivery = rows[0].id_client;
        const hasClientDelivery = idhasDelivery ? "1" : "0";

        return res.status(200).json({ hasClientDelivery, idhasDelivery });
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};

exports.isClientDelivered = async function (req, res) {
    const { uid } = req.body;
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(
            `SELECT L.is_delivered
             FROM Livraisons L
             INNER JOIN Users U ON L.id_client = U.id_user 
             WHERE U.uid_user = ?`,
            [req.body.uid]
        );

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const isDelivered = rows[0].is_delivered;
        const isClientDelivered = isDelivered ? "Delivered" : "Not delivered";

        return res.status(200).json({ isClientDelivered, isDelivered });
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};

exports.hasFactorDelivered = async function (req, res) {
    const { uid } = req.body;
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(
            `SELECT L.is_delivered
             FROM Livraisons L
             INNER JOIN Users U ON L.id_facteur = U.id_user 
             WHERE U.uid_user = ?`,
            [req.body.uid]
        );

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const hasDelivered = rows[0].is_delivered;
        const hasFactorDelivered = hasDelivered ? "Delivered" : "Not delivered";

        return res.status(200).json({ hasFactorDelivered, hasDelivered });
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};

exports.isClientCaseFilled = async function (req, res) {
    const { uid } = req.body;
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(
            `SELECT C.is_full
             FROM Casiers C
             INNER JOIN Livraisons L ON C.id_casier = L.id_casier
             INNER JOIN Users U ON L.id_client = U.id_user 
             WHERE U.uid_user = ?`,
            [req.body.uid]
        );

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFull = rows[0].is_full;
        const isClientCaseFull = isFull ? "Full" : "empty";

        return res.status(200).json({ isClientCaseFull, isFull });
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};

exports.isFactorCaseEmptied = async function (req, res) {
    const { uid } = req.body;
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(
            `SELECT C.is_full
             FROM Casiers C
             INNER JOIN Livraisons L ON C.id_casier = L.id_casier
             INNER JOIN Users U ON L.id_facteur = U.id_user 
             WHERE U.uid_user = ?`,
            [req.body.uid]
        );

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFull = rows[0].is_full;
        const isFactorCaseEmpty = !isFull ? "Empty" : "Full";

        return res.status(200).json({ isFactorCaseEmpty, isFull });
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};

exports.openFactorCase = async function (req, res) {
    const { uid } = req.body;
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(
            `SELECT C.numero_casier
             FROM Casiers C
             INNER JOIN Livraisons L ON C.id_casier = L.id_casier
             INNER JOIN Users U ON L.id_facteur = U.id_user 
             WHERE U.uid_user = ?`,
            [req.body.uid]
        );

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const caseNumber = rows[0].numero_casier;
        const isCaseNumber = caseNumber ? "yes" : "no";

        return res.status(200).json({ isCaseNumber, caseNumber });
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};

exports.openClientCase = async function (req, res) {
    const { uid } = req.body;
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(
            `SELECT C.numero_casier
             FROM Casiers C
             INNER JOIN Livraisons L ON C.id_casier = L.id_casier
             INNER JOIN Users U ON L.id_client = U.id_user 
             WHERE U.uid_user = ?`,
            [req.body.uid]
        );

        if (rows.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const caseNumber = rows[0].numero_casier;
        const isCaseNumber = caseNumber ? "yes" : "no";

        return res.status(200).json({ isCaseNumber, caseNumber });
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la vérification" });
    }
};





