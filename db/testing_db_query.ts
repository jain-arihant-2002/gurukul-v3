import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm"; // <-- IMPORT THE `eq` OPERATOR
import { Pool } from "pg";
import * as schema from "./schema";
import { faker } from "@faker-js/faker";
// Correctly import your application types for type-safe data generation
import { LectureType, type QuizQuestion, type SocialLink } from "../utils/types"; // <-- IMPORT THE ENUM

// --- CONFIGURATION ---
const NUM_USERS = 60;
const NUM_INSTRUCTORS = 35; // Must be <= NUM_USERS
const COURSES_PER_INSTRUCTOR = 3;
const SECTIONS_PER_COURSE = 5;
const LECTURES_PER_SECTION = 7;

// --- DATABASE CONNECTION ---
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.");
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// --- HELPER FUNCTIONS ---

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
// --- SEEDING FUNCTIONS ---
// =================================================================
export const seedDatabaseWithAllFields = async () => {
  console.log("🌱 Seeding database with all fields...");

  // 1. Create Users & Instructors
  console.log("   - Seeding users and instructors...");
  const createdUserIds: string[] = [];
  const createdInstructorIds: string[] = [];

  for (let i = 0; i < NUM_USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const isInstructor = i < NUM_INSTRUCTORS;
    const [newUser] = await db.insert(schema.user).values({
        id: faker.string.uuid(),
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        username: faker.internet.userName({ firstName, lastName }).toLowerCase() + faker.string.alphanumeric(3),
        displayUsername: `${firstName} ${lastName}`,
        image: faker.image.avatar(),
        role: isInstructor ? "instructor" : "user",
      }).returning();
    createdUserIds.push(newUser.id);
    if (isInstructor) {
      await db.insert(schema.instructors).values({
          id: newUser.id,
          headline: faker.person.jobTitle(),
          bio: faker.lorem.paragraph(),
          expertise: faker.helpers.arrayElements(["React", "Node.js", "TypeScript", "SQL", "DevOps"], { min: 2, max: 4 }),
          socialLinks: createRandomSocialLinks(),
        });
      createdInstructorIds.push(newUser.id);
    }
  }

  // 2. Create Courses, Sections, Lectures, and Quizzes
  console.log("   - Seeding courses, sections, and content...");
  const createdCourseIds: string[] = [];
  const allLectureIdsByCourse: Record<string, string[]> = {};

  for (const instructorId of createdInstructorIds) {
    let instructorCoursesCount = 0;
    for (let i = 0; i < COURSES_PER_INSTRUCTOR; i++) {
      instructorCoursesCount++;
      const courseTitle = faker.company.catchPhrase();
      const [newCourse] = await db.insert(schema.courses).values({
          id: faker.string.uuid(),
          slug: faker.helpers.slugify(courseTitle).toLowerCase(),
          title: courseTitle,
          shortDescription: faker.lorem.sentence(),
          longDescriptionHtml: `<p>${faker.lorem.paragraphs({ min: 3, max: 5 }).replace(/\n/g, "</p><p>")}</p>`,
          coverImageUrl: faker.image.urlLoremFlickr({ category: 'technology' }),
          // --- FIX 1: `precision` -> `fractionDigits` ---
          rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }).toString(),
          price: faker.helpers.arrayElement(["0.00", "19.99", "49.99", "99.99"]),
          level: faker.helpers.arrayElement(["beginner", "intermediate", "advanced", "all-levels"]),
          status: "published",
          categories: faker.helpers.arrayElements(["Web Dev", "Data Science", "Design", "Marketing"], { min: 1, max: 2 }),
          whatWillYouLearn: Array.from({ length: faker.number.int({ min: 4, max: 7 }) }, () => faker.lorem.sentence()),
          prerequisites: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.lorem.sentence()),
          authorId: instructorId,
        }).returning();

      createdCourseIds.push(newCourse.id);
      allLectureIdsByCourse[newCourse.id] = [];

      let totalDurationSeconds = 0;
      for (let j = 0; j < SECTIONS_PER_COURSE; j++) {
        const [newSection] = await db.insert(schema.sections).values({
          id: faker.string.uuid(),
          title: `Section ${j + 1}: ${faker.lorem.words(3)}`,
          description: faker.lorem.sentence(),
          order: j + 1,
          courseId: newCourse.id,
        }).returning();

        for (let k = 0; k < LECTURES_PER_SECTION; k++) {
          // --- FIX 2: Use the imported enum, not strings ---
          const lectureType = faker.helpers.arrayElement([LectureType.VIDEO, LectureType.ARTICLE, LectureType.QUIZ]);
          const duration = lectureType === LectureType.VIDEO ? faker.number.int({ min: 120, max: 900 }) : 0;
          totalDurationSeconds += duration;
          
          const [newLecture] = await db.insert(schema.lectures).values({
              id: faker.string.uuid(),
              title: `Lecture ${k + 1}: ${faker.lorem.words(4)}`,
              order: k + 1,
              type: lectureType,
              isFreePreview: k < 2,
              durationInSeconds: duration,
              videoUrl: lectureType === LectureType.VIDEO ? `https://fake-cdn.com/videos/${faker.string.uuid()}.mp4` : undefined,
              articleContentHtml: lectureType === LectureType.ARTICLE ? `<p>${faker.lorem.paragraphs({ min: 4, max: 8 }).replace(/\n/g, "</p><p>")}</p>` : undefined,
              sectionId: newSection.id,
            }).returning();
          
          allLectureIdsByCourse[newCourse.id].push(newLecture.id);

          if (lectureType === LectureType.QUIZ) {
            await db.insert(schema.quizzes).values({
              id: faker.string.uuid(),
              description: faker.lorem.sentence(),
              questions: createRandomQuizQuestions(faker.number.int({ min: 3, max: 5 })),
              lectureId: newLecture.id,
            });
          }
        }
      }
      // --- FIX 3: Use eq() for the where clause ---
      await db.update(schema.courses).set({ totalDurationSeconds }).where(eq(schema.courses.id, newCourse.id));
    }
    // --- FIX 3: Use eq() for the where clause ---
    await db.update(schema.instructors).set({ coursesCount: instructorCoursesCount }).where(eq(schema.instructors.id, instructorId));
  }

  // 3. Create Enrollments and update course counts
  console.log("   - Seeding enrollments...");
  for (const userId of createdUserIds) {
    const coursesToEnroll = faker.helpers.arrayElements(createdCourseIds, { min: 1, max: 4 });
    for (const courseId of coursesToEnroll) {
      const lectureIdsForCourse = allLectureIdsByCourse[courseId];
      const completedLectures = faker.helpers.arrayElements(lectureIdsForCourse, { min: 0, max: lectureIdsForCourse.length });
      await db.insert(schema.enrollments).values({
          id: faker.string.uuid(),
          userId,
          courseId,
          progressPercentage: lectureIdsForCourse.length > 0 ? Math.round((completedLectures.length / lectureIdsForCourse.length) * 100) : 0,
          completedLectureIds: completedLectures,
      });
    }
  }
  const enrollmentsByCourse = await db.select({ courseId: schema.enrollments.courseId }).from(schema.enrollments);
  const counts: Record<string, number> = {};
  enrollmentsByCourse.forEach(e => { counts[e.courseId] = (counts[e.courseId] || 0) + 1; });
  for (const courseId in counts) {
    // --- FIX 3: Use eq() for the where clause ---
    await db.update(schema.courses).set({ enrollmentCount: counts[courseId] }).where(eq(schema.courses.id, courseId));
  }
  console.log("✅ Seeding with all fields complete.");
};

export const seedDatabaseWithOnlyRequiredFields = async () => {
    console.log("🌱 Seeding database with only required fields...");
  
    // 1. Create Users & Instructors (minimal)
    const createdInstructorIds: string[] = [];
    for (let i = 0; i < NUM_INSTRUCTORS; i++) {
        const [newUser] = await db.insert(schema.user).values({
            id: faker.string.uuid(), name: faker.person.fullName(), email: faker.internet.email().toLowerCase(), username: faker.internet.userName().toLowerCase() + faker.string.alphanumeric(3), displayUsername: faker.person.fullName(), role: "instructor",
        }).returning();
        const [newInstructor] = await db.insert(schema.instructors).values({
            id: newUser.id, headline: "Instructor", bio: "An instructor bio.",
        }).returning();
        createdInstructorIds.push(newInstructor.id);
    }
  
    // 2. Create Courses, Sections, Lectures (minimal)
    for (const instructorId of createdInstructorIds) {
        const courseTitle = "A Basic Course";
        const [newCourse] = await db.insert(schema.courses).values({
            id: faker.string.uuid(), slug: faker.helpers.slugify(courseTitle).toLowerCase(), title: courseTitle, shortDescription: "A short description.", longDescriptionHtml: "<p>A long description.</p>", authorId: instructorId,
        }).returning();
        const [newSection] = await db.insert(schema.sections).values({
            id: faker.string.uuid(), title: "A Basic Section", order: 1, courseId: newCourse.id,
        }).returning();
        await db.insert(schema.lectures).values({
            id: faker.string.uuid(), title: "A Basic Lecture", order: 1, 
            // --- FIX 2: Use the imported enum, not a string ---
            type: LectureType.VIDEO, 
            sectionId: newSection.id,
        });
    }
    console.log("✅ Seeding with required fields complete.");
};
