// =================================================================
// --- ENUMS (Enumerated Types) ---
// These are well-defined and do not need changes.
// =================================================================

/** Defines the roles a user can have within the system. */
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  INSTRUCTOR = "instructor",
}

/** Defines the publication status of a course. */
export enum CourseStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

/** Defines the difficulty level of a course. */
export enum CourseLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  ALL_LEVELS = "all-levels",
}

/** Defines the type of content a lecture can represent. */
export enum LectureType {
  VIDEO = "video",
  ARTICLE = "article",
  QUIZ = "quiz",
}

// =================================================================
// --- STANDALONE DATA MODELS ---
// Each type is now self-contained for clarity and decoupling.
// =================================================================

/**
 * Represents a basic user of the application.
 */
export type User = {
  id: string;
  name: string;
  username: string; // Unique, slugified name for profile URLs
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  role: UserRole[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  isBanned?: boolean;
  banReason?: string;
  banExpiresAt?: string | null; // ISO string
};

/**
 * Represents the full data model for a course instructor, including their user info.
 * This is a complete, standalone type.
 */
export type Instructor = {
  // User-related fields
  id: string; // This ID corresponds to the author/instructor record
  userId: string; // This ID links back to the core user record
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;

  // Instructor-specific fields
  headline: string;
  bio: string;
  expertise: string[];
  socialLinks: SocialLink[];
  coursesCount: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

/**
 * Represents a single lecture or piece of content within a section.
 */
export interface Lecture {
  id: string;
  title: string;
  durationInSeconds: number;
  isFreePreview: boolean;
  videoPublicId?: string | undefined;
  videoUrl?: string
  quiz?: Quiz | null | undefined;
  order: number;
  type: string;
}

/**
 * Represents a logical grouping of lectures within a course.
 */
export type Section = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lectures?: Lecture[];
};

/**
 * Represents the complete, fully-nested data model for a single course.
 * Ideal for when you need all course information at once.
 */
export type Course = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescriptionHtml: string;
  coverImage: string | null;
  rating: number;
  enrollmentCount: number;
  categories: string[];
  price: number;
  level: CourseLevel;
  language: string;
  status: CourseStatus;
  whatWillYouLearn: string[];
  prerequisites: string[];
  totalDurationHours: number;
  author: Instructor; // Nests the full instructor object
  sections: Section[]; // Nests the full sections array
  createdAt: string;
  updatedAt: string;
};

// =================================================================
// --- VIEW-SPECIFIC & COMPONENT MODELS ---
// These types are tailored for specific UI components or API responses.
// =================================================================

/**
 * A simplified course representation, perfect for displaying in a list or grid.
 */
export type CourseCard = {
  id: string;
  slug: string;
  title: string;
  status?: CourseStatus;
  coverImage: string | null;
  categories: string[];
  price: number;
  rating: number;
  level: CourseLevel;
  authorName: string;
  updatedAt: string; // ISO string
  createdAt: string; // ISO string
  enrollmentCount: number;
  shortDescription: string;
};

/**
 * A simplified instructor representation, perfect for an author card.
 */
export type InstructorCard = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  expertise: string[];
  coursesCount: number;
  bio: string;
};

/**
 * The precise data shape needed for the `CourseDetailPage` component.
 * This is the most efficient type for that specific page.
 */
export type CourseDetails = {
  // Course fields
  id: string;
  authorId: string
  slug: string;
  title: string;
  shortDescription: string;
  longDescriptionHtml: string;
  coverImage: string | null;
  rating: number;
  enrollmentCount: number;
  categories: string[];
  price: number;
  level: CourseLevel;
  language: string;
  status: CourseStatus;
  whatWillYouLearn: string[];
  prerequisites: string[];
  totalDurationHours: number;
  createdAt: string;
  updatedAt: string;
  // Simplified author fields
  authorName: string;
  authorUsername: string;
  // Fully detailed sections and lectures
  sections?: Section[] // Including quiz for potential future use
};

/**
 * The data shape for an instructor's dedicated profile page.
 * It omits the `courses` array, which would likely be fetched separately with pagination.
 */
export type InstructorDetails = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  headline: string;
  bio: string;
  expertise: string[];
  socialLinks: SocialLink[];
  coursesCount: number;
  createdAt: string;
  updatedAt: string;
  status?: CourseStatus;
  courses: CourseCard[]; // This can be a simplified version of CourseCard for listing
};

// =================================================================
// --- UTILITY & OTHER MODELS ---
// =================================================================

/** Represents a quiz, which can be a type of lecture. */
export type Quiz = {
  id: string;
  description: string;
  questions: QuizQuestion[];
};

export type QuizQuestion = {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
};

/** Represents a user's enrollment in a course. */
export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string; // ISO string
  progressPercentage: number;
  completedLectureIds: string[];
};

/** Represents a structured social media link for an instructor. */
export type SocialLink = {
  platform: "twitter" | "linkedin" | "github" | "website";
  url: string;
};

/** A generic wrapper for standardized API responses. */
export type ApiResponseType<T = null> = {
  success: boolean;
  data: T | null;
  code: number;
  message: string;
  error: string | null;
};

export type CourseFormData = {
  id: string
  title: string;
  slug: string;
  shortDescription: string;
  longDescriptionHtml: string;
  price: string; // Can be a string or number, but should be stored as a string in the database
  language: string;
  level: CourseLevel;
  status: CourseStatus;
  categories: string[];
  whatWillYouLearn: string[];
  prerequisites?: string[];
  coverImage?: string;
  createdAt?: Date; // used for updated courses
  authorId: string;
};

export type CreateCourseDbInput = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescriptionHtml: string;
  coverImage?: string;
  rating?: string; // default 0.0
  enrollmentCount?: number; // default 0
  price: number;
  language: string;
  level: CourseLevel;
  status: CourseStatus;
  totalDurationHours?: number; // default 0
  categories: string[];
  whatWillYouLearn: string[];
  prerequisites?: string[];
  authorId: string;
  createdAt?: Date;
  updatedAt?: Date;
};