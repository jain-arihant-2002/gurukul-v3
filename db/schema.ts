// db/schema.ts

import {
  boolean,
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type {
  CourseLevel,
  CourseStatus,
  LectureType,
  SocialLink,
  QuizQuestion,
} from "../utils/types";

// =================================================================
// --- ENUM DEFINITIONS ---
// =================================================================

export const userRoleEnum = pgEnum("user_role", ["user", "admin", "instructor"]);
export const courseStatusEnum = pgEnum("course_status", ["draft", "published", "archived"]);
export const courseLevelEnum = pgEnum("course_level", ["beginner", "intermediate", "advanced", "all-levels"]);
export const lectureTypeEnum = pgEnum("lecture_type", ["video", "article", "quiz"]);
export const socialPlatformEnum = pgEnum("social_platform", ["twitter", "linkedin", "github", "website"]);


// =================================================================
// --- AUTHENTICATION SCHEMA (Better-Auth Tables) ---
// =================================================================

export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'), // This maps to 'avatarUrl' in types
  username: text('username').unique().notNull(),
  displayUsername: text('display_username').notNull(), // As username will be used for display purposes by default
  role: userRoleEnum('role').default('user').notNull(),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by')
});

export const account = pgTable("account", {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});


// =================================================================
// --- LEARNING MANAGEMENT SYSTEM (LMS) SCHEMA ---
// =================================================================

/**
 * Instructor profiles. Extends the user model.
 * The ID is a foreign key to the user table, creating a one-to-one relationship.
 */
export const instructors = pgTable("instructors", {
  id: text("id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  headline: text("headline").notNull(),
  bio: text("bio").notNull(),
  expertise: jsonb("expertise").$type<string[]>().default([]).notNull(),
  socialLinks: jsonb("social_links").$type<SocialLink[]>().default([]).notNull(),
  coursesCount: integer("courses_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Courses table.
 */
export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  longDescriptionHtml: text("long_description_html").notNull(),
  coverImage: text("cover_image").default("").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0").notNull(),
  enrollmentCount: integer("enrollment_count").default(0).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).default("0.00").notNull(),
  language: text("language").default("English").notNull(),
  level: courseLevelEnum("level").default("all-levels").notNull(),
  status: courseStatusEnum("status").default("draft").notNull(),
  totalDurationHours: integer("total_duration_hours").default(0).notNull(),
  categories: jsonb("categories").$type<string[]>().default([]).notNull(),
  whatWillYouLearn: jsonb("what_will_you_learn").$type<string[]>().default([]).notNull(),
  prerequisites: jsonb("prerequisites").$type<string[]>().default([]).notNull(),
  authorId: text("author_id").notNull().references(() => instructors.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Sections within a course.
 */
export const sections = pgTable("sections", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
});

/**
 * Lectures within a section.
 */
export const lectures = pgTable("lectures", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  order: integer("order").notNull(),
  type: lectureTypeEnum("type").notNull(),
  durationInSeconds: integer("duration_in_seconds").default(0).notNull(),
  isFreePreview: boolean("is_free_preview").default(false).notNull(),
  videoUrl: text("video_url"),
  articleContentHtml: text("article_content_html"),
  sectionId: text("section_id").notNull().references(() => sections.id, { onDelete: "cascade" }),
});

/**
 * Quizzes, which are a type of lecture.
 */
export const quizzes = pgTable("quizzes", {
  id: text("id").primaryKey(),
  description: text("description").notNull(),
  questions: jsonb("questions").$type<QuizQuestion[]>().notNull(),
  lectureId: text("lecture_id").unique().notNull().references(() => lectures.id, { onDelete: "cascade" }),
});

/**
 * Enrollments join table (User <-> Course).
 */
export const enrollments = pgTable("enrollments", {
  id: text("id").primaryKey(),
  progressPercentage: integer("progress_percentage").default(0).notNull(),
  completedLectureIds: jsonb("completed_lecture_ids").$type<string[]>().default([]).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
}, (table) => ({
  uniqueEnrollment: uniqueIndex("unique_enrollment_idx").on(table.userId, table.courseId),
}));


// =================================================================
// --- RELATIONS ---
// =================================================================

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  instructorProfile: one(instructors, {
    fields: [user.id],
    references: [instructors.id],
  }),
  enrollments: many(enrollments),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const instructorsRelations = relations(instructors, ({ one, many }) => ({
  user: one(user, {
    fields: [instructors.id],
    references: [user.id],
  }),
  courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  author: one(instructors, {
    fields: [courses.authorId],
    references: [instructors.id],
  }),
  sections: many(sections),
  enrollments: many(enrollments),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  course: one(courses, {
    fields: [sections.courseId],
    references: [courses.id],
  }),
  lectures: many(lectures),
}));

export const lecturesRelations = relations(lectures, ({ one }) => ({
  section: one(sections, {
    fields: [lectures.sectionId],
    references: [sections.id],
  }),
  quiz: one(quizzes, {
    fields: [lectures.id],
    references: [quizzes.lectureId],
  }),
}));

export const quizzesRelations = relations(quizzes, ({ one }) => ({
  lecture: one(lectures, {
    fields: [quizzes.lectureId],
    references: [lectures.id],
  }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(user, {
    fields: [enrollments.userId],
    references: [user.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));