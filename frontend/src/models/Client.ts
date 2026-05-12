import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClient extends Document {
  name: string;
  phone?: string;
  email?: string;
  branchId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true }
}, { timestamps: true });

const Client: Model<IClient> = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);

export default Client;
