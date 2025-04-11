const connectToBD = require('../config/config');
const express = require('express');
app = express();
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwtUtil");
app.use(express.json());

function sanitizeField(field) {
    return validator.escape(field);
}

exports.getUser = async function (req, res) {
    try {
        const connection = await connectToBD();
        const [rows] = await connection.query(' SELECT * FROM Users');
        console.log(rows);
        return res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de la récupération des clients" });
    }
}

exports.getAppToken = async function (req, res) {
    console.log("users/getAppToken");
    console.log(process.env.CREATION_EMAIL);
    console.log(process.env.CREATION_PASS);

    const email = req.body.email;
    const pass = req.body.pass;
    const user = { uname: email };

    // Validate user input
    if (!(email && pass)) {
        return res.status(400).send({ message: "All input is required" });
    }
    //Verifier si on l'authorise
    if (email != process.env.CREATION_EMAIL || pass != process.env.CREATION_PASS)
        return res.status(401).send({ message: "Ask administrator for access" });

    const accessToken = jwtUtil.generateAppToken(user);
    res.status(200).json({ AppToken: accessToken });
};

exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;
        console.log(email + " + " + password);

        const connection = await connectToBD();

        if (!(email && password)) {
            return res.status(400).send({ message: "Tout les champs sont requis" });
        }

        let Tempemail = sanitizeField(email);
        let TempPassword = sanitizeField(password);

        if (email != Tempemail || password != TempPassword) {
            console.log("Champs invalide");
            return res
                .status(400)
                .send({
                    message:
                        "Champs invalide. Veuillez vérifier les caractère spéciaux et veuillez réesayer !",
                });
        }

        const [rows] = await connection.execute(
            'SELECT * FROM Users WHERE courriel = ?',
            [email] // Paramètre à passer pour l'email
        );
        if ([rows] == null) {
            res.status(409);
            res.send({
                message: "Erreur lors de la sélection de l'usager. Veuillez reesayer",
            });
        } else {
            const user = rows[0];
            if (user && (await bcrypt.compare(password, user.mot_de_passe))) {
                const bearerToken = jwtUtil.generateAccessToken(
                    user.courriel,
                    user.is_admin
                );
                userId = user.id_user;
                userAdmin = user.is_admin;
                console.log("idUtilisateur: " + userId);
                res.status(201).json({ bearerToken, userId, userAdmin , message: "Connexion réussie" });
            } else {
                res.status(400).send({ message: "Courriel ou mot de passe invalide" });
            }
        }
    } catch (err) {
        console.log(err);
    }
};

