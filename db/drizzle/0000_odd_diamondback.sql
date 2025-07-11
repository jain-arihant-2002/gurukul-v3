CREATE TYPE "public"."course_level" AS ENUM('beginner', 'intermediate', 'advanced', 'all-levels');--> statement-breakpoint
CREATE TYPE "public"."course_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."lecture_type" AS ENUM('video', 'article', 'quiz');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('completed', 'pending', 'failed');--> statement-breakpoint
CREATE TYPE "public"."social_platform" AS ENUM('twitter', 'linkedin', 'github', 'website');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'instructor');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"short_description" text NOT NULL,
	"long_description_html" text NOT NULL,
	"cover_image" text DEFAULT '' NOT NULL,
	"rating" numeric(2, 1) DEFAULT '0.0' NOT NULL,
	"enrollment_count" integer DEFAULT 0 NOT NULL,
	"price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"language" text DEFAULT 'English' NOT NULL,
	"level" "course_level" DEFAULT 'all-levels' NOT NULL,
	"status" "course_status" DEFAULT 'draft' NOT NULL,
	"total_duration_hours" integer DEFAULT 0 NOT NULL,
	"categories" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"what_will_you_learn" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"prerequisites" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"author_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" text PRIMARY KEY NOT NULL,
	"progress_percentage" integer DEFAULT 0 NOT NULL,
	"completed_lecture_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"course_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instructors" (
	"id" text PRIMARY KEY NOT NULL,
	"headline" text NOT NULL,
	"bio" text NOT NULL,
	"expertise" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"social_links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"courses_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lectures" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"order" integer NOT NULL,
	"type" "lecture_type" NOT NULL,
	"duration_in_seconds" integer DEFAULT 0 NOT NULL,
	"is_free_preview" boolean DEFAULT false NOT NULL,
	"video_public_id" text,
	"article_content_html" text,
	"section_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"course_id" text NOT NULL,
	"purchased_at" timestamp DEFAULT now() NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_status" "payment_status" DEFAULT 'completed' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"questions" jsonb NOT NULL,
	"lecture_id" text NOT NULL,
	CONSTRAINT "quizzes_lecture_id_unique" UNIQUE("lecture_id")
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"course_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"username" text NOT NULL,
	"display_username" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_author_id_instructors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."instructors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lectures" ADD CONSTRAINT "lectures_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_lecture_id_lectures_id_fk" FOREIGN KEY ("lecture_id") REFERENCES "public"."lectures"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_enrollment_idx" ON "enrollments" USING btree ("user_id","course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_purchase_idx" ON "purchases" USING btree ("user_id","course_id");