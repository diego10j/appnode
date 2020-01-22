const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    urlImagen: {
        type: String,
        required: true,
    },
    precio: {
        type: Number,
        required: true
    },
    fechaCrea: {
        type: Date,
        default: Date.now,
    }
});

mongoose.model('Curso', CursoSchema);
