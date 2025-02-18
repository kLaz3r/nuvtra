import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { notifications } from "~/server/db/schema";

export async function POST(request: Request) {
  try {
    // Get userId from request body
    const { userId } = (await request.json()) as { userId: string };
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Query the database for unread notifications
    const unreadNotifications = await db.query.notifications.findMany({
      where: and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false),
      ),
      columns: {
        id: true,
        type: true,
        message: true,
        isRead: true,
        timestamp: true,
        postId: true,
      },
      with: {
        creator: {
          columns: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: (notifications, { desc }) => [desc(notifications.timestamp)],
    });

    return NextResponse.json(unreadNotifications);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch notifications" }),
      {
        status: 500,
      },
    );
  }
}
