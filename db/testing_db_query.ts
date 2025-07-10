// In: db/testing_db_query.ts

import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { Pool } from "pg";
import * as schema from "./schema";
import { faker } from "@faker-js/faker";
import { LectureType, type QuizQuestion, type SocialLink } from "../utils/types";
import { nanoid } from "nanoid";

// --- CONFIGURATION ---
const NUM_RANDOM_USERS = 20;
const NUM_RANDOM_INSTRUCTORS = 5; // Must be <= NUM_RANDOM_USERS
const COURSES_PER_INSTRUCTOR = 2;
const SECTIONS_PER_COURSE = 3;
const LECTURES_PER_SECTION = 5;

// --- DATABASE CONNECTION ---
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.");
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// --- HELPER FUNCTIONS ---
// [CTO's Note]: These helper functions remain unchanged. They are good utilities for generating varied data.
const createRandomSocialLinks = (): SocialLink[] => {
  const platforms: SocialLink["platform"][] = ["github", "linkedin", "twitter", "website"];
  const selectedPlatforms = faker.helpers.arrayElements(platforms, faker.number.int({ min: 2, max: 4 }));
  
  return selectedPlatforms.map(platform => ({
    platform,
    url: platform === 'github' ? `https://github.com/${faker.internet.userName()}`
        : platform === 'linkedin' ? `https://linkedin.com/in/${faker.internet.userName()}`
        : platform === 'twitter' ? `https://twitter.com/${faker.internet.userName()}`
        : faker.internet.url(),
  }));
};

const createRandomQuizQuestions = (count: number): QuizQuestion[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `question_${i + 1}_${faker.string.uuid()}`,
    questionText: faker.lorem.sentence({ min: 5, max: 10 }).replace(/\.$/, "?"),
    options: Array.from({ length: 4 }, () => faker.lorem.words(faker.number.int({ min: 2, max: 4 }))),
    correctOptionIndex: faker.number.int({ min: 0, max: 3 }),
  }));
};


// =================================================================
// --- CLEANUP FUNCTION ---
// =================================================================
export const cleanupData = async () => {
  console.log("🧹 Cleaning up old data...");
  try {
    await db.delete(schema.purchases);
    await db.delete(schema.enrollments);
    await db.delete(schema.quizzes);
    await db.delete(schema.lectures);
    await db.delete(schema.sections);
    await db.delete(schema.courses);
    await db.delete(schema.instructors);
    await db.delete(schema.session);
    await db.delete(schema.account);
    await db.delete(schema.verification);
    await db.delete(schema.user);
    console.log("✅ Cleanup complete.");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw error;
  }
};

// =================================================================
// --- MAIN SEEDING FUNCTION ---
// =================================================================
export const seedDatabaseWithAllFields = async () => {
  console.log("🌱 Seeding database with test data...");

  // [CTO's Note]: We're wrapping the entire seed in a transaction.
  // This ensures that if any part of the seed fails, the entire operation is rolled back,
  // leaving the database in a clean state. This is critical for data consistency.
  await db.transaction(async (tx) => {
    
    // === 1. CREATE DEDICATED TEST USERS AND INSTRUCTOR ===
    console.log("   - Creating dedicated test users and instructor...");
    
    const [mainInstructorUser] = await tx.insert(schema.user).values({
      id: `user_main_instructor_${nanoid(10)}`,
      name: "Dr. Evelyn Reed",
      email: "evelyn.reed@example.com",
      username: "evelyn-reed",
      displayUsername: "evelyn-reed",
      role: "instructor",
    }).returning();

    await tx.insert(schema.instructors).values({
      id: mainInstructorUser.id,
      headline: "Lead Cloud Architect & Educator",
      bio: "Expert in scalable systems and cloud infrastructure, passionate about mentoring the next generation of engineers.",
      expertise: ["AWS", "System Design", "DevOps", "TypeScript"],
      socialLinks: createRandomSocialLinks(),
    });

    const [enrolledUser] = await tx.insert(schema.user).values({
      id: `user_enrolled_${nanoid(10)}`,
      name: "Alex Johnson (Enrolled)",
      email: "alex.enrolled@example.com",
      username: "alex-enrolled",
      displayUsername: "alex-enrolled",
    }).returning();

    const [unenrolledUser] = await tx.insert(schema.user).values({
      id: `user_unenrolled_${nanoid(10)}`,
      name: "Beth Smith (Unenrolled)",
      email: "beth.unenrolled@example.com",
      username: "beth-unenrolled",
      displayUsername: "beth-unenrolled",
    }).returning();

    // === 2. CREATE THE "GURUKUL PRIME" COURSE FOR TESTING ===
    console.log("   - Creating the primary test course...");

    const [primeCourse] = await tx.insert(schema.courses).values({
      id: `course_prime_${nanoid(10)}`,
      title: "Gurukul Prime: Scalable Systems Design",
      slug: "gurukul-prime-scalable-systems",
      shortDescription: "A deep dive into the principles and patterns of building robust, scalable, and maintainable systems.",
      longDescriptionHtml: `<p>This is the definitive course on system design.</p>`,
      price: "99.99",
      status: "published",
      authorId: mainInstructorUser.id,
      coverImage: 'https://cdn.jsdelivr.net/gh/jain-arihant-2002/gurukul-v3@b88f345e69e855c7865c3614139886475b817923/public/images/course-image.jpg'
    }).returning();

    // === 3. CREATE SECTIONS AND LECTURES FOR THE PRIME COURSE ===
    const [primeSection] = await tx.insert(schema.sections).values({
      id: `section_prime_intro_${nanoid(10)}`,
      title: "Module 1: Foundations of Scalability",
      order: 1,
      courseId: primeCourse.id,
    }).returning();

    // [CTO's Note]: Here we create our two key lectures for testing.
    // We hardcode placeholder Cloudinary URLs. You MUST replace these with real,
    // short video URLs from your Cloudinary account for the test to work.
    // The public ID is the part after `.../upload/` and before the file extension.
    const [freeLecture] = await tx.insert(schema.lectures).values({
      id: "lect_free_preview_1", // Using a static ID for easy reference in test page.
      title: "Introduction (Free Preview)",
      order: 1,
      type: LectureType.VIDEO,
      isFreePreview: true,
      sectionId: primeSection.id,
      // IMPORTANT: Replace with a REAL video URL from your Cloudinary account.
      videoUrl: "https://res.cloudinary.com/demo/video/upload/dog.mp4", 
    }).returning();

    const [protectedLecture] = await tx.insert(schema.lectures).values({
      id: "lect_protected_2", // Using a static ID for easy reference in test page.
      title: "The CAP Theorem In-Depth (Protected)",
      order: 2,
      type: LectureType.VIDEO,
      isFreePreview: false,
      sectionId: primeSection.id,
      // IMPORTANT: Replace with a different REAL video URL from your Cloudinary account.
      videoUrl: "https://res.cloudinary.com/demo/video/upload/skiing.mp4",
    }).returning();

    // === 4. ENROLL THE DEDICATED USER ===
    console.log("   - Enrolling the test user...");
    await tx.insert(schema.enrollments).values({
      id: `enrl_${nanoid(10)}`,
      userId: enrolledUser.id,
      courseId: primeCourse.id,
    });
    
    // Update enrollment count for the prime course
    await tx.update(schema.courses)
      .set({ enrollmentCount: 1 })
      .where(eq(schema.courses.id, primeCourse.id));

    // Update main instructor's course count
    await tx.update(schema.instructors)
      .set({ coursesCount: 1 })
      .where(eq(schema.instructors.id, mainInstructorUser.id));

    console.log("✅ Dedicated test data created successfully!");
    console.log("---");
    console.log("Enrolled User Login: alex.enrolled@example.com");
    console.log("Unenrolled User Login: beth.unenrolled@example.com");
    console.log("You can use any password during local development sign-in.");
    console.log(`Free Preview Lecture ID: ${freeLecture.id}`);
    console.log(`Protected Lecture ID: ${protectedLecture.id}`);
    console.log("---");
  });

  console.log("✅ Seeding complete.");
};