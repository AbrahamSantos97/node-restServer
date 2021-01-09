const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
app.use(fileUpload({ useTempFiles: true }));
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;
    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no valido',
                opc: tiposValidos.join(', ')
            }
        });
    }
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha cargado ningun archivo'
        });
    }
    let archivo = req.files.archivo;
    //Validar extensiones
    let extValidas = ['png', 'jpg', 'gif', 'jpng'];
    let nomArchivo = archivo.name.split('.');
    let extension = nomArchivo[nomArchivo.length - 1];
    if (extValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extension de archivo no valida',
                opc: extValidas.join(', ')
            }
        });
    }
    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo === 'usuarios') imagenUsuario(id, res, nombreArchivo);
        else imagenProducto(id, res, nombreArchivo);

    });
});

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            BorraArchivo('productos', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            BorraArchivo('productos', nombreArchivo);
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario ingresado'
            });
        }
        BorraArchivo('productos', productoDB.img);
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoG) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                productoG
            });
        });
    });
}

function imagenUsuario(id, res, nombre) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            BorraArchivo('usuarios', nombre);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            BorraArchivo('usuarios', nombre);
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }
        //let pathUrl = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        BorraArchivo('usuarios', usuarioDB.img);
        //BorraArchivo(pathUrl)
        usuarioDB.img = nombre;
        usuarioDB.save((err, usuarioG) => {
            res.json({
                ok: true,
                usuarioG,
                img: nombre
            });
        });
    });
}

function BorraArchivo(tipo, nombreArchivo) {
    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathUrl)) {
        console.log('Existe la imagen');
        fs.unlinkSync(pathUrl);
    } else {
        console.log('No existe la imagen');
    }
}
module.exports = app;