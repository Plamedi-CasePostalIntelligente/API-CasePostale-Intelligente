const connectToBD = require('../config/config');
const express = require('express');
app = express();
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwtUtil");
app.use(express.json());

exports.openLocker = async function (req, res) {

    const { uid , dateLivraisonUser} = req.body;
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query('SELECT U.Id ,U.IsAdmin , L.statusCas , C.NumeroCasier ,C.StatusLiv ,C.IsFull FROM Users U INNER JOIN Livraisons L ON U.Id=L.IdUser',
            ' INNER JOIN Casier C ON L.IdCasier = C.IdCasier WHERE U.uid=?', [req.body.uid] ,' AND L.dateLivraisonLivraison =?', [req.body.dateLivraisonUser],
             'AND WHERE L.IdCasier = C.IdCasier');
        
        if (rows.length == 0) {
            return res.status(404).json({ message: "Locker not found" });
        }

        if (rows[0].statusCas == 'Ouvert' ) {
            return res.status(400).json({ message: "Locker already open" });
        }

        if(rows[0].StatusLiv == 'Non Livré' && rows[0].IsFull == '0' && rows[0].IsAdmin == '1'){
            return res.status(200).json( rows.NumeroCasier ,{ message: "Locker opened for factor" });
        }else if(rows[0].StatusLiv == 'Livré' && rows[0].IsFull == '1' && rows[0].IsAdmin == '0'){
            return res.status(200).json( rows.NumeroCasier ,{ message: "Locker opened for user" });
        }else{
            return res.status(400).json({ message: "Invalid RFID card" });
        }

    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de l'ouverture du locker" });
    }
};

exports.UpdateShippingStatus = async function (req, res) {
    const { dateLivraison , statusCas , StatusLiv } = req.body;
    try {
        const connection = await connectToBD();
        await connection.query('UPDATE FROM Users U SET U.DateLivraison = ?'[dateLivraison],
            ' AND Casiers SET statusCasier = ?',[statusCas],
            ' AND Livraison SET StatusLivraison = ?',[StatusLiv],
            ' AND L.DateLivraison = ?',[dateLivraison]
        );

    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

/*
exports.openLocker = async function (req, res) {

    try {
        const connection = await connectToBD();
        const [rows] = await connection.query('SELECT * FROM lockers WHERE id=?', [req.body.lockerId]);

        if (rows.length == 0) {
            return res.status(404).json({ message: "Locker not found" });
        }

        if (rows[0].status == 1) {
            return res.status(400).json({ message: "Locker already open" });
        }

        const [rows2] = await connection.query('UPDATE lockers SET status=1 WHERE id=?', [req.body.lockerId]);

        return res.status(200).json({ message: "Locker opened" });

    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de l'ouverture du locker" });
    }
};*/