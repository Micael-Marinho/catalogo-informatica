const mongoose = require('mongoose');

// Define os campos dos documentos de avaliação.
const avaliacaoSchema = mongoose.Schema({
    produtoId: {
        type: Number,
        required: true
    },

    usuario: {
        type: String,
        required: true
    },

    nota: {
        type: Number,
        required: true
    },

    comentario: {
        type: String,
        required: true
    }
});

// Define o model e informa a collection utilizada.
module.exports = mongoose.model(
    'Avaliacao',
    avaliacaoSchema,
    'avaliacoes'
);