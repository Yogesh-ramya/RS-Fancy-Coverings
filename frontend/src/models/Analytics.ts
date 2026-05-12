import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteStats extends Document {
  totalViews: number;
  totalVisitors: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVisitor extends Document {
  visitorId: string;
  lastVisit: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SiteStatsSchema: Schema = new Schema({
  totalViews: { type: Number, default: 0 },
  totalVisitors: { type: Number, default: 0 }
}, { timestamps: true });

const VisitorSchema: Schema = new Schema({
  visitorId: { type: String, required: true, unique: true },
  lastVisit: { type: Date, default: Date.now }
}, { timestamps: true });

export const SiteStats: Model<ISiteStats> = mongoose.models.SiteStats || mongoose.model<ISiteStats>('SiteStats', SiteStatsSchema);
export const Visitor: Model<IVisitor> = mongoose.models.Visitor || mongoose.model<IVisitor>('Visitor', VisitorSchema);
