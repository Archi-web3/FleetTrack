import * as mongoose from 'mongoose';
import { UserSchema } from './src/users/schemas/user.schema';

async function test() {
  const uri = 'mongodb+srv://dbGestiondeplacement:ftiS24t2mofJnEVb@cluster0.662bzca.mongodb.net/DB_gestion-des-deplacements?retryWrites=true&w=majority&appName=Cluster0';
  await mongoose.connect(uri);
  const userModel = mongoose.model('User', UserSchema, 'utilisateurs');

  const users = await userModel.find({ $or: [{ _id: { $in: ['697274f0b524b2a467dc64c6'] } }] });
  console.log('Mongoose found:', users.length, 'users');
  await mongoose.disconnect();
}
test().catch(console.error);
