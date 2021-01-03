const express = require('express');
const Usuario = require('../models/usuario');
const { verifyToken } = require('../middlewares/autenticacion');
const { verificaAdminRole } = require('../middlewares/autenticacion');
const bcrypt = require('bcrypt');
const app = express();
const _ = require('underscore');
const { isNumber } = require('underscore');


app.get('/usuarios', verifyToken, (req, res) => {
    /* return res.json({
        usuario: req.usuario
    }); */
    let desde = req.query.desde || 0;
    let limite = req.query.limit || 5;
    limite = Number(limite);
    desde = Number(desde);
    if (!isNumber(desde) || !isNumber(limite)) return res.status(400).json({ ok: false, err: 'La paginacion debe ser numerica' });
    Usuario.find({ estado: true }, 'nombre email').skip(desde).limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                total: usuarios.length,
                usuarios
            });
        });
});

app.post('/usuarios', [verifyToken, verificaAdminRole], function(req, res) {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuarios/:id', [verifyToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: user
        });
    });

});

app.delete('/usuarios/:id', [verifyToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
            estado: false
        }
        //Eliminacion logica
    Usuario.findByIdAndUpdate(id, cambiaEstado, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: user
        });
    });

    //Eliminacion fisica
    /* Usuario.findByIdAndRemove(id, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: 'El usuario no existe'
            });
        }
        res.json({
            ok: true,
            usuario
        });
    }); */
});

module.exports = app

/*User: abrahamS
password: oqNwKdv3Ju6aDBSM 
mongodb+srv://abrahamS:oqNwKdv3Ju6aDBSM@cluster0.esqnp.mongodb.net/test
*/