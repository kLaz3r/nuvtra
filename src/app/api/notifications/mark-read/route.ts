import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { notifications } from "~/server/db/schema";

type MarkReadRequest = {
  notificationId: string;
};

export async function POST(request: Request) {
  try {
    const { notificationId } = (await request.json()) as MarkReadRequest;

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 },
      );
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId));

    return NextResponse.json({ success: true });
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to mark notification as read" }),
      {
        status: 500,
      },
    );
  }
}
