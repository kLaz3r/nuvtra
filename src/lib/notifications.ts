import { db } from "~/server/db";
import { notifications } from "~/server/db/schema";
import type { NotificationType } from "~/types";

export async function createNotification({
  type,
  userId,
  createdById,
  message,
}: {
  type: NotificationType;
  userId: string;
  createdById: string;
  message: string;
}) {
  try {
    await db.insert(notifications).values({
      type,
      userId,
      createdById,
      message,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}
