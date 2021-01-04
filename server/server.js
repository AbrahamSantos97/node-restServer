require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(require('./routes/index.js'));
//app.use(require('./routes/login.js'));

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));
//

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos conectada');
    }, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto');
});