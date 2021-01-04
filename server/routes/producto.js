const express = require('express');
let { verifyToken } = require('../middlewares/autenticacion');
let Producto = require('../models/producto');
let app = express();

//============================
//  Todos los productos (get) populando el usuario y categoria, paginado
//============================
app.get('/producto', (req, res) => {
    let desde = req.body.desde;
    let hasta = req.body.hasta;
    desde = Number(desde);
    hasta = Number(hasta);
    Producto.find({ disponible: true }).skip(desde).limit(hasta)
        .populate('usuario')
        .populate('categoria')
        .exec((err, prodcutoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                prodcutoDB
            });
        });
});
//============================
//  Producto por ID con su populate
//============================
app.get('/producto/:id', (req, res) => {
    let id = req.params.id;
    Producto.findById(id).populate('usuario').populate('categoria').exec((err, prodcutoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            prodcutoDB
        });
    });
});
//============================
//  CrearProducto, grabar usuario y grabar listado de categoria
//============================
app.post('/producto', verifyToken, (req, res) => {
    let body = req.body;
    let iduser = req.usuario._id;
    let produc = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: iduser
    });
    produc.save((err, prodcutoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            prodcutoDB
        });
    });
});
//============================
//  Actualizar
//============================
app.put('/producto/:id', (req, res) => {
    let body = req.body;
    let id = req.params.id;
    edicionRegistro = {
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni
    }
    Producto.findByIdAndUpdate(id, edicionRegistro, (err, prodcutoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            prodcutoDB
        });
    });
});
//============================
//  Borrar producto
//============================
app.delete('/producto/:id', (req, res) => {
    let id = req.params.id;
    edicionRegistro = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, edicionRegistro, (err, prodcutoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            prodcutoDB
        });
    });
});
module.exports = app;