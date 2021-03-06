// ==========================
//          Puerto
// ==========================
process.env.PORT = process.env.PORT || 3000;
//===========================
//          Entorno
//===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================
//          BD
//===========================
let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = 'mongodb+srv://abrahamS:oqNwKdv3Ju6aDBSM@cluster0.esqnp.mongodb.net/cafe';
}
process.env.URLDB = urlBD;

//===========================
//    Vencimiento token
//===========================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//===========================
//          SEED auth
//===========================
process.env.SEED = 'este-es-el-seed-desarrollo';

//===========================
//      Google client
//===========================
process.env.CLIENT_ID = process.env.CLIENT_ID || "673365170010-erl9ge1vrdeb5kvurn2p1rvch1oj0l78.apps.googleusercontent.com";