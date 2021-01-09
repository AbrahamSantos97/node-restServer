const express = require('express');
const fs = require('fs');
let app = express();
const path = require('path');
const { verifyToken } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verifyToken, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathVerdadera = '';
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) pathVerdadera = pathImagen;
    else pathVerdadera = path.resolve(__dirname, '../assets/no-image.jpg');

    //let pathImg = `./uploads/${tipo}/${img}`;

    //let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathVerdadera);
});
module.exports = app;