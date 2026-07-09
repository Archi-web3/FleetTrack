"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const user_schema_1 = require("./src/users/schemas/user.schema");
async function test() {
    const uri = 'mongodb+srv://dbGestiondeplacement:ftiS24t2mofJnEVb@cluster0.662bzca.mongodb.net/DB_gestion-des-deplacements?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(uri);
    const userModel = mongoose.model('User', user_schema_1.UserSchema, 'utilisateurs');
    const users = await userModel.find({ $or: [{ _id: { $in: ['697274f0b524b2a467dc64c6'] } }] });
    console.log('Mongoose found:', users.length, 'users');
    await mongoose.disconnect();
}
test().catch(console.error);
//# sourceMappingURL=test_mongoose.js.map