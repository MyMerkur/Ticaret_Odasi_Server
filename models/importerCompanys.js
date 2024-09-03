const mongoose = require('mongoose');

const importerCompany = mongoose.Schema({
    uyeSicil: {
        type: Number,
        required: true
    },
    unvan: {
        type: String,
        required: true
    },
    adresTip: {
        type: String,
        required: true
    },
    adres: {
        type: String,
        required: true
    },
    isTelefon: {
        type: String, 
        required: true
    },
    uyeKayitTarihi: {
        type: Date,
        required: true
    },
    naceKodu: {
        type: String,
        required: true
    },
    naceAdi: {
        type: String,
        required: true
    },
    durumu: {
        type: String,
        enum: ['İthalatçı', 'İhracatçı'], 
        required: true
    }

})

module.exports = mongoose.model('Importer Company',importerCompany);