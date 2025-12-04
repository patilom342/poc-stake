import mongoose, { Schema, Document } from 'mongoose';

export interface IStakingTransaction extends Document {
  userAddress: string;
  token: string;
  amount: string;
  protocol: string;
  adapterAddress: string;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  fee: string;
  timestamp: Date;
  network: string;
}

const StakingTransactionSchema: Schema = new Schema({
  userAddress: { type: String, required: true, index: true },
  token: { type: String, required: true },
  amount: { type: String, required: true },
  protocol: { type: String, required: true },
  adapterAddress: { type: String, required: true },
  txHash: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
  fee: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  network: { type: String, required: true }
});

export default mongoose.model<IStakingTransaction>('StakingTransaction', StakingTransactionSchema);
