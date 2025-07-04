import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { faker } from "@faker-js/faker";
import { like } from "drizzle-orm";

// =================================================================
// --- CONFIGURATION ---
// =================================================================
const NUM_USERS = 15;
const NUM_INSTRUCTORS = 10; // Must be <= NUM_USERS
const NUM_COURSES_PER_INSTRUCTOR = 2;
const NUM_SECTIONS_PER_COURSE = 3;
const NUM_LECTURES_PER_SECTION = 4;

const userRoles = Object.values(schema.userRoleEnum.enumValues);
const courseLevels = Object.values(schema.courseLevelEnum.enumValues);
const courseStatuses = Object.values(schema.courseStatusEnum.enumValues);
const lectureTypes = Object.values(schema.lectureTypeEnum.enumValues);

/**
 * The main seeding function.
 */
export async function seedDatabase() {
    console.log("🔥 Starting database seeding process...");

    // Use a transaction to ensure all or nothing is inserted
    await db.transaction(async (tx) => {
        console.log("✅ Creating god_users and god_instructors...");

        const createdUserIds: string[] = [];
        const createdInstructorIds: string[] = [];

        // --- Create Users & Instructors ---
        for (let i = 0; i < NUM_USERS; i++) {
            const userId = `god_user_${i + 1}`;
            const username = `god_username_${i + 1}`;
            const isInstructor = i < NUM_INSTRUCTORS;

            // Insert User
            await tx.insert(schema.user).values({
                id: userId,
                name: `God User ${i + 1}`,
                email: `god_user_${i + 1}@example.com`,
                username: username,
                displayUsername: `God User ${i + 1}`,
                role: isInstructor ? "instructor" : "user",
                emailVerified: true,
                image: faker.image.avatar(),
            });
            createdUserIds.push(userId);

            // If user is an instructor, create instructor profile
            if (isInstructor) {
                await tx.insert(schema.instructors).values({
                    id: userId, // ID must match the user's ID
                    headline: "Expert in Divine Web Technologies",
                    bio: faker.lorem.paragraph(),
                    expertise: ["Theology", "TypeScript", "Miracles", "Drizzle ORM"],
                    socialLinks: [{ platform: "github", url: `https://github.com/${username}` }],
                });
                createdInstructorIds.push(userId);
            }
        }

        console.log(`✅ Created ${NUM_USERS} users and ${NUM_INSTRUCTORS} instructors.`);

        // --- Create Courses, Sections, Lectures, and Quizzes ---
        const createdCourseIds: string[] = [];

        console.log("✅ Creating god_courses with all related content...");
        for (const instructorId of createdInstructorIds) {
            for (let i = 0; i < NUM_COURSES_PER_INSTRUCTOR; i++) {
                const courseId = `god_course_${instructorId}_${i + 1}`;
                const courseSlug = `god-course-${instructorId}-${i + 1}`;

                // Insert Course
                const [newCourse] = await tx.insert(schema.courses).values({
                    id: courseId,
                    slug: courseSlug,
                    title: `God Course: The Art of Seeding ${i + 1}`,
                    shortDescription: faker.lorem.sentence(),
                    longDescriptionHtml: `<h1>About this God Course</h1><p>${faker.lorem.paragraphs(3)}</p>`,
                    authorId: instructorId,
                    level: courseLevels[i % courseLevels.length],
                    status: "published",
                    price: faker.commerce.price({ min: 10, max: 200 }),
                    rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
                    categories: ["Testing", "Databases", "Drizzle"],
                    whatWillYouLearn: ["How to seed", "How to test", "How to query"],
                    prerequisites: ["A working computer"],
                }).returning();
                createdCourseIds.push(newCourse.id);

                // --- Create Sections for this Course ---
                for (let j = 0; j < NUM_SECTIONS_PER_COURSE; j++) {
                    const sectionId = `${courseId}_section_${j + 1}`;
                    await tx.insert(schema.sections).values({
                        id: sectionId,
                        title: `God Section ${j + 1}: The Beginning`,
                        order: j + 1,
                        courseId: newCourse.id,
                    });

                    // --- Create Lectures for this Section ---
                    for (let k = 0; k < NUM_LECTURES_PER_SECTION; k++) {
                        const lectureId = `${sectionId}_lecture_${k + 1}`;
                        const lectureType = lectureTypes[k % lectureTypes.length];

                        await tx.insert(schema.lectures).values({
                            id: lectureId,
                            title: `God Lecture ${k + 1}: ${lectureType}`,
                            order: k + 1,
                            type: lectureType,
                            sectionId: sectionId,
                            isFreePreview: k < 1, // Make the first lecture a free preview
                            videoUrl: lectureType === "video" ? faker.internet.url() : undefined,
                            articleContentHtml: lectureType === "article" ? `<p>This is a holy article.</p>` : undefined,
                        });

                        // --- Create Quiz if lecture type is quiz ---
                        if (lectureType === "quiz") {
                            await tx.insert(schema.quizzes).values({
                                id: `god_quiz_${lectureId}`,
                                description: "A divine test of your knowledge.",
                                lectureId: lectureId,
                                questions: [{
                                    id: "q1",
                                    questionText: "Is this a god query?",
                                    options: ["Yes", "No", "Maybe"],
                                    correctOptionIndex: 0,
                                }],
                            });
                        }
                    }
                }
            }
        }
        console.log(`✅ Created a total of ${createdCourseIds.length} courses with content.`);

        // --- Create Enrollments ---
        console.log("✅ Creating god_enrollments...");
        const enrollmentData = createdUserIds.flatMap(userId =>
            // Enroll each user in 1 or 2 of the created courses
            createdCourseIds.slice(0, 2).map(courseId => ({
                id: `god_enrollment_${userId}_${courseId}`,
                userId,
                courseId,
                progressPercentage: Math.floor(Math.random() * 100),
            }))
        );

        await tx.insert(schema.enrollments).values(enrollmentData);
        console.log(`✅ Enrolled users in ${enrollmentData.length} courses.`);

    });

    console.log("🎉 Database seeding completed successfully!");
}

/**
 * Deletes all data created by the seeder.
 */
export async function cleanupGodData() {
    console.log("🧹 Starting cleanup of all 'god_' data...");
    await db.transaction(async (tx) => {
        console.log("🗑️ Deleting god_courses and their cascaded content...");
        // Deleting courses first due to the 'restrict' foreign key on authorId
        await tx.delete(schema.courses).where(like(schema.courses.slug, 'god_%'));

        console.log("🗑️ Deleting god_users and their cascaded profiles...");
        // This will cascade to instructors, enrollments, sessions, etc.
        await tx.delete(schema.user).where(like(schema.user.username, 'god_%'));
    });
    console.log("✨ Cleanup complete.");
}

