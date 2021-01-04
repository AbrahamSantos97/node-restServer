const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

//Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //console.log(payload.name);
    //console.log(payload.email);
    //console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
//verify().catch(console.error);

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let gluser = await verify(token).catch(err => {
        res.status(403).json({
            ok: false,
            err
        });
    });
    Usuario.findOne({ email: gluser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (usuarioDB) {
            if (usuarioDB.google == false) {
                return res.status(400).json({
                    ok: false,
                    error: 'Debe de usar su autenticacion normal'
                });
            } else {
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            let usuario = new Usuario();
            usuario.nombre = gluser.nombre;
            usuario.email = gluser.email;
            usuario.img = gluser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }

    });
    /* res.json({
        user: gluser
    }); */
});
module.exports = app