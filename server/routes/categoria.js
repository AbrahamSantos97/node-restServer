const express = require('express');
let { verifyToken } = require('../middlewares/autenticacion');
const { verificaAdminRole } = require('../middlewares/autenticacion');
let app = express();
const Categoria = require('../models/categoria');

app.get('/categorias', (req, res) => {
    Categoria.find({ estado: true }).populate('usuario', 'nombre email').
    exec((err, categoriasDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoriasDB
        });
    });
});

app.get('categorias/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriasDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoriasDB
        });
    });
});

app.post('/categorias', [verifyToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let Cat = new Categoria({
        usuario: req.usuario._id,
        descripcion: body.descripcion
    });
    Cat.save((err, categoriasDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoriasDB
        });
    });
});

app.put('/categorias/:id', [verifyToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriasDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoriasDB
        });
    });
});

app.delete('/categorias/:id', [verifyToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }
    Categoria.findByIdAndUpdate(id, cambiaEstado, (err, categoriasDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoriasDB
        });
    });
});

module.exports = app;