const mongoose = require('mongoose');

const EstudianteSchema = new mongoose.Schema({
    nombres: {
        type: String,
        required: true,
    },
    apellidos: {
        type: String,
        required: true,
    },
    correo: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },    
    telefono: {
        type: String
    },
    fechaNacimiento: {
        type: Date,
        required: true,
    },
    avatar: {
        type: String
    }
});

mongoose.model('Estudiante', EstudianteSchema);
