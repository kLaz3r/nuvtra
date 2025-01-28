DO $$ BEGIN
 CREATE TYPE "public"."notification_type" AS ENUM('LIKE', 'COMMENT', 'FOLLOW');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nexa_comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"post_id" uuid NOT NULL,
	"author_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nexa_follow" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"follower_id" uuid NOT NULL,
	"following_id" uuid NOT NULL,
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nexa_like" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nexa_notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "notification_type" NOT NULL,
	"message" text NOT NULL,
	"user_id" uuid NOT NULL,
	"created_by_id" uuid NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nexa_post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"image_url" varchar(512),
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"author_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nexa_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(256) NOT NULL,
	"username" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"bio" text,
	"avatar" varchar(512),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"location" varchar(256),
	CONSTRAINT "nexa_user_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "nexa_user_username_unique" UNIQUE("username"),
	CONSTRAINT "nexa_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nexa_comment" ADD CONSTRAINT "nexa_comment_post_id_nexa_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."nexa_post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nexa_comment" ADD CONSTRAINT "nexa_comment_author_id_nexa_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."nexa_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nexa_follow" ADD CONSTRAINT "nexa_follow_follower_id_nexa_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."nexa_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nexa_follow" ADD CONSTRAINT "nexa_follow_following_id_nexa_user_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."nexa_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nexa_like" ADD CONSTRAINT "nexa_like_user_id_nexa_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."nexa_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nexa_like" ADD CONSTRAINT "nexa_like_post_id_nexa_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."nexa_post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nexa_notification" ADD CONSTRAINT "nexa_notification_user_id_nexa_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."nexa_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nexa_notification" ADD CONSTRAINT "nexa_notification_created_by_id_nexa_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."nexa_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nexa_post" ADD CONSTRAINT "nexa_post_author_id_nexa_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."nexa_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
