const mongoose = require('mongoose');

const siteStatsSchema = new mongoose.Schema({
  totalViews: { type: Number, default: 0 },
  totalVisitors: { type: Number, default: 0 }
}, { timestamps: true });

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, unique: true }, // e.g., a UUID or IP hash
  lastVisit: { type: Date, default: Date.now }
}, { timestamps: true });

const SiteStats = mongoose.model('SiteStats', siteStatsSchema);
const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = { SiteStats, Visitor };
