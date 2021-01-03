const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                error: 'Usuario o contraseña incorrectos1'
            });
        }
        if (bcrypt.compareSync(body.password, userDB.password)) {
            let token = jwt.sign({ usuario: userDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
            res.json({
                ok: true,
                mess: 'todo ha salido bien',
                userDB,
                token
            });
        } else {
            return res.status(400).json({
                ok: false,
                error: 'Usuario o contraseña incorrectos2'
            });
        }
    });
});

module.exports = app