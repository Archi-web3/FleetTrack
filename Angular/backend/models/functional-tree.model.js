const mongoose = require('mongoose');

const FunctionalTreeSchema = new mongoose.Schema({
    treeId: { type: String, required: true, unique: true, default: 'MASTER' }, // Singleton ID
    content: { type: Object, required: true }, // The entire JSON tree
    lastUpdated: { type: Date, default: Date.now },
    updatedBy: { type: String } // Optional: user ID
}, { timestamps: true });

module.exports = mongoose.model('FunctionalTree', FunctionalTreeSchema);
