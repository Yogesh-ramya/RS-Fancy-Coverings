import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SiteStats, Visitor } from '@/models/Analytics';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { visitorId } = await req.json();
    console.log(`[Analytics] Tracking visit for visitor: ${visitorId}`);

    // 1. Update Total Views
    let stats = await SiteStats.findOne();
    if (!stats) {
      stats = await SiteStats.create({ totalViews: 1, totalVisitors: 1 });
    } else {
      stats.totalViews += 1;
      await stats.save();
    }

    // 2. Track Unique Visitor
    if (visitorId) {
      const existingVisitor = await Visitor.findOne({ visitorId });
      if (!existingVisitor) {
        await Visitor.create({ visitorId });
        
        // Increment total visitors count in stats
        stats.totalVisitors += 1;
        await stats.save();
      } else {
        existingVisitor.lastVisit = new Date();
        await existingVisitor.save();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
