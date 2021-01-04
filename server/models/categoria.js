const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    descripcion: {
        type: String,
        required: [true, 'Llene el campo de descripcion']
    },
    estado: {
        type: Boolean,
        default: true
    }
});
module.exports = mongoose.model('Categoria', categoriaSchema);