import connectDB from "../../../lib/mongodb";

import Client from "../../../models/Client";

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const branchId =
      req.nextUrl.searchParams.get(
        "branchId"
      );

    let filter = {};

    if (branchId) {
      filter.branchId = branchId;
    }

    const clients =
      await Client.find(filter).populate(
        "branchId"
      );

    return NextResponse.json({
      success: true,
      clients,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const client =
      await Client.create(body);

    return NextResponse.json({
      success: true,
      client,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}