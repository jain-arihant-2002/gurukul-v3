import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import { faker } from '@faker-js/faker';
import * as schema from './schema';
import { eq, sql, desc } from 'drizzle-orm';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const db = drizzle(pool, { schema });

type UserInsert = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  username: string;
  displayUsername: string;
  role: 'user' | 'admin' | 'instructor';
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type CourseInsert = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescriptionHtml: string;
  coverImage: string;
  rating: string;
  enrollmentCount: number;
  price: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  status: 'draft' | 'published' | 'archived';
  totalDurationHours: number;
  categories: string[];
  whatWillYouLearn: string[];
  prerequisites: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

const INDIAN_FIRST_NAMES = [
  'Aarav', 'Aadhira', 'Aarush', 'Aanya', 'Advik', 'Aarohi', 'Arnav', 'Ananya', 'Ayaan', 'Aishi',
  'Vivaan', 'Vani', 'Vihaan', 'Vanya', 'Vedant', 'Vidhi', 'Viaan', 'Vaishnavi', 'Kabir', 'Kavya',
  'Krishna', 'Kriti', 'Lakshit', 'Lakshmi', 'Madhav', 'Myra', 'Nakul', 'Navya', 'Parth', 'Pihu',
  'Pratham', 'Prisha', 'Raghav', 'Riya', 'Ritvik', 'Radhika', 'Sahil', 'Saanvi', 'Siddharth', 'Srishti',
  'Tarun', 'Tanisha', 'Uday', 'Urvi', 'Varun', 'Vansh', 'Yash', 'Yashika', 'Zaid', 'Zara',
  'Aditya', 'Anchal', 'Amit', 'Anita', 'Anil', 'Asha', 'Ashok', 'Bina', 'Bharat', 'Bhavna',
  'Chetan', 'Chhavi', 'Darshan', 'Divya', 'Deepak', 'Deepa', 'Dinesh', 'Disha', 'Gaurav', 'Gita',
  'Harish', 'Hema', 'Ishaan', 'Ishita', 'Jatin', 'Jaya', 'Karan', 'Kiran', 'Kishore', 'Lalita',
  'Manish', 'Maya', 'Mohan', 'Monika', 'Naveen', 'Neha', 'Nikhil', 'Nisha', 'Pankaj', 'Pooja',
  'Pradeep', 'Priya', 'Puneet', 'Rashmi', 'Ravi', 'Rekha', 'Rohit', 'Ritu', 'Sanjay', 'Sarita',
  'Shankar', 'Shreya', 'Shyam', 'Sneha', 'Suresh', 'Sunita', 'Tarun', 'Usha', 'Vijay', 'Vinita',
  'Vikas', 'Vivek', 'Vijaya', 'Yogesh', 'Yogita', 'Abhishek', 'Abhilasha', 'Ankur', 'Ankita',
  'Arjun', 'Astha', 'Ayush', 'Chandni', 'Dev', 'Diksha', 'Gopal', 'Harsh', 'Harshita',
  'Himanshu', 'Ishwar', 'Jeet', 'Kajol', 'Kamal', 'Kamesh', 'Kapil', 'Kavita', 'Kriti',
  'Lalit', 'Madhuri', 'Mahesh', 'Meera', 'Mithun', 'Nidhi', 'Nimesh', 'Nitin', 'Palak',
  'Piyush', 'Rahul', 'Rajni', 'Rajiv', 'Rakesh', 'Richa', 'Rishabh', 'Ritu', 'Sakshi',
  'Sameer', 'Sanjay', 'Shiv', 'Shivani', 'Shubham', 'Sonam', 'Srishti', 'Sumit',
  'Supriya', 'Umesh', 'Urvashi', 'Vikram', 'Vishal', 'Vishnu', 'Yashwant', 'Zeenat'
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Joshi', 'Reddy', 'Nair', 'Iyer', 'Menon',
  'Agarwal', 'Verma', 'Agarwal', 'Mehta', 'Shah', 'Parekh', 'Trivedi', 'Desai', 'Chandra', 'Kapoor',
  'Mukherjee', 'Banerjee', 'Chatterjee', 'Bhatia', 'Sinha', 'Rao', 'Krishnan', 'Swaminathan', 'Iyengar',
  'Subramanian', 'Venkatraman', 'Ramaswamy', 'Chidambaram', 'Kalyanaraman', 'Srinivasan', 'Narayanan',
  'Mahajan', 'Kulkarni', 'Jadhav', 'Pawar', 'Thakur', 'Yadav', 'Gupta', 'Jain', 'Maheshwari',
  'Modi', 'Shah', 'Dalal', 'Shroff', 'Bajaj', 'Tata', 'Birla', 'Godbole', 'Apte', 'Kamat',
  'Pillai', 'Nambiar', 'Potti', 'Kurup', 'Nair', 'Warrier', 'Kartha', 'Menon', 'Kutty', 'Mol',
  'Devi', 'Dev', 'Dutt', 'Das', 'Dasgupta', 'Mitra', 'Sarkar', 'Basu', 'Ganguly', 'Ray',
  'Roy', 'Chowdhury', 'Dey', 'Biswas', 'Bandyopadhyay', 'Majumdar', 'Maitra', 'Bhattacharya', 'Ghosh',
  'Talwar', 'Kashyap', 'Mishra', 'Pandey', 'Dubey', 'Choubey', 'Tripathi', 'Maurya', 'Singh'
];

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
  'Cloud Computing', 'DevOps', 'Cybersecurity', 'UI/UX Design', 'Graphic Design',
  'Business', 'Marketing', 'Finance', 'Personal Development', 'Photography',
  'Music', 'Health & Fitness', 'Cooking', 'Languages', 'IT & Software'
];

const COURSE_TITLES = {
  'Web Development': [
    'Complete Web Development Bootcamp', 'React - The Complete Guide', 'Node.js Backend Development',
    'Full Stack MERN Developer', 'Next.js 15 Masterclass', 'TypeScript for Beginners',
    'HTML5 & CSS3 Complete Course', 'JavaScript Algorithms & Data Structures', 'CSS Grid & Flexbox',
    'Responsive Web Design', 'Web Performance Optimization', 'Frontend Interview Preparation'
  ],
  'Mobile Development': [
    'Flutter & Dart Complete Guide', 'React Native - Build Mobile Apps', 'iOS Development with Swift',
    'Android Kotlin Masterclass', 'Cross-Platform Mobile Development', 'Mobile UI/UX Design'
  ],
  'Data Science': [
    'Python for Data Science', 'Data Analysis with Pandas', 'SQL for Data Analysis',
    'Statistical Analysis Bootcamp', 'Data Visualization with Tableau', 'Excel for Business Analytics'
  ],
  'Machine Learning': [
    'Machine Learning A-Z', 'Deep Learning Specialization', 'TensorFlow Developer Certificate',
    'Natural Language Processing', 'Computer Vision with Python', 'AI & Machine Learning Bootcamp'
  ],
  'Cloud Computing': [
    'AWS Certified Solutions Architect', 'Google Cloud Platform Complete Guide', 'Microsoft Azure Fundamentals',
    'Cloud Computing for Beginners', 'DevOps on AWS', 'Kubernetes Masterclass'
  ],
  'DevOps': [
    'Docker & Kubernetes Complete Guide', 'CI/CD with Jenkins', 'Linux Administration',
    'Terraform Infrastructure as Code', 'Ansible Automation', 'DevOps Best Practices'
  ],
  'Cybersecurity': [
    'Ethical Hacking Complete Course', 'Cybersecurity Fundamentals', 'Network Security Masterclass',
    'Penetration Testing Bootcamp', 'CompTIA Security+ Preparation', 'Cyber Defense Strategies'
  ],
  'UI/UX Design': [
    'UI/UX Design Masterclass', 'Figma - Complete Design Course', 'Adobe XD for Beginners',
    'Mobile App Design Principles', 'Design Thinking Workshop', 'Wireframing & Prototyping'
  ],
  'Graphic Design': [
    'Adobe Photoshop Complete Guide', 'Illustrator for Beginners', 'Canva Design Mastery',
    'Brand Identity Design', 'Logo Design Fundamentals', 'Print Design Essentials'
  ],
  'Business': [
    'Business Administration Complete', 'Entrepreneurship Fundamentals', 'Project Management Professional',
    'Business Strategy Masterclass', 'Startup Launchpad', 'Leadership Skills Development'
  ],
  'Marketing': [
    'Digital Marketing Complete Course', 'Social Media Marketing', 'SEO Mastery',
    'Content Marketing Strategy', 'Email Marketing Bootcamp', 'Google Ads & Analytics'
  ],
  'Finance': [
    'Financial Analysis & Modeling', 'Investment Banking Prep', 'Personal Finance Management',
    'Trading & Stock Market', 'Cryptocurrency Fundamentals', 'Accounting for Beginners'
  ],
  'Personal Development': [
    'Communication Skills Mastery', 'Time Management Secrets', 'Public Speaking Excellence',
    'Critical Thinking & Problem Solving', 'Emotional Intelligence', 'Productivity Hacks'
  ],
  'Photography': [
    'Photography Complete Guide', 'Portrait Photography Masterclass', 'Landscape Photography',
    'Photo Editing with Lightroom', 'Street Photography', 'Mobile Photography'
  ],
  'Music': [
    'Music Production Complete Course', 'Piano for Beginners', 'Guitar Mastery',
    'Music Theory Fundamentals', 'DJ Skills & Mixing', 'Vocals Training'
  ],
  'Health & Fitness': [
    'Yoga Teacher Training', 'Nutrition & Diet Planning', 'Personal Training Certification',
    'Meditation & Mindfulness', 'CrossFit Training', 'Weight Loss Journey'
  ],
  'Cooking': [
    'Indian Cooking Masterclass', 'Italian Cuisine Fundamentals', 'Baking & Pastry Arts',
    'Healthy Meal Prep', 'Street Food Around the World', 'Chef Skills Development'
  ],
  'Languages': [
    'Hindi for Beginners', 'Spanish Complete Course', 'French Language Mastery',
    'Japanese Language Course', 'German for Beginners', 'English Grammar & Speaking'
  ],
  'IT & Software': [
    'Linux Administration', 'Git & GitHub Complete Guide', 'Database Design with SQL',
    'Python Programming Masterclass', 'C++ for Beginners', 'Java Programming'
  ]
};

const LEVELS: ('beginner' | 'intermediate' | 'advanced' | 'all-levels')[] = ['beginner', 'intermediate', 'advanced', 'all-levels'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali'];
const LECTURE_TYPES: ('video' | 'article' | 'quiz')[] = ['video', 'article', 'quiz'];

const SAMPLE_HTML_DESCRIPTION = `
<h2>Course Overview</h2>
<p>Welcome to this comprehensive course designed to take you from beginner to advanced level. This course covers all the essential concepts with practical examples and real-world applications.</p>

<h3>What You'll Learn</h3>
<ul>
  <li>Fundamental concepts and core principles</li>
  <li>Advanced techniques used by industry professionals</li>
  <li>Hands-on projects and practical exercises</li>
  <li>Best practices and common pitfalls to avoid</li>
  <li>Industry-standard tools and technologies</li>
  <li>Problem-solving strategies and approaches</li>
</ul>

<h3>Course Structure</h3>
<p>This course is divided into multiple sections, each focusing on a specific topic. Each section contains video lectures, reading materials, quizzes, and practical assignments to reinforce your learning.</p>

<h3>Who Should Take This Course</h3>
<ul>
  <li>Beginners looking to start their journey</li>
  <li>Professionals wanting to upgrade their skills</li>
  <li>Anyone interested in mastering this subject</li>
</ul>

<h3>Requirements</h3>
<ul>
  <li>Basic understanding of fundamentals</li>
  <li>A computer with internet access</li>
  <li>Willingness to learn and practice</li>
</ul>

<blockquote>
  <p>"Education is not the filling of a pail, but the lighting of a fire."</p>
</blockquote>

<p>By the end of this course, you'll have the confidence and skills to apply what you've learned in real-world scenarios. Let's get started!</p>
`;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateIndianName(): string {
  const firstName = randomElement(INDIAN_FIRST_NAMES);
  const lastName = randomElement(INDIAN_LAST_NAMES);
  return `${firstName} ${lastName}`;
}

function generateUsername(name: string): string {
  const cleaned = name.toLowerCase().replace(/\s+/g, '');
  const suffix = randomInt(1, 999);
  return `${cleaned}${suffix}`;
}

function generateEmail(name: string): string {
  const cleaned = name.toLowerCase().replace(/\s+/g, '.');
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com'];
  return `${cleaned}${randomInt(1, 999)}@${randomElement(domains)}`;
}

function generateUnsplashUrl(keyword: string): string {
  const seed = keyword.replace(/\s+/g, '-').toLowerCase();
  return `https://images.unsplash.com/photo-${randomInt(1500000000000, 1700000000000)}?w=800&h=450&fit=crop&q=80`;
}

function generateExpertise(): string[] {
  const count = randomInt(3, 6);
  const shuffled = [...CATEGORIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateSocialLinks(username: string) {
  const platforms = ['twitter', 'linkedin', 'github', 'website'] as const;
  return platforms.map(platform => ({
    platform,
    url: platform === 'website' ? `https://${username}.example.com` : `https://${platform}.com/${username}`
  }));
}

function generateWhatYouLearn(): string[] {
  const items = [
    'Core concepts and fundamental principles',
    'Practical implementation strategies',
    'Industry best practices and standards',
    'Advanced techniques and optimization',
    'Real-world project experience',
    'Problem-solving and debugging skills',
    'Performance optimization methods',
    'Testing and quality assurance'
  ];
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, randomInt(4, 6));
}

function generatePrerequisites(): string[] {
  const items = [
    'Basic computer skills',
    'Willingness to learn',
    'A computer with internet access',
    'Basic understanding of related concepts',
    'No prior experience required'
  ];
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, randomInt(2, 3));
}

function generatePrice(): string {
  const tiers = [
    { min: 0, max: 0, weight: 15 },
    { min: 9.99, max: 19.99, weight: 35 },
    { min: 29.99, max: 49.99, weight: 30 },
    { min: 49.99, max: 99.99, weight: 20 }
  ];

  const totalWeight = tiers.reduce((sum, t) => sum + t.weight, 0);
  let random = Math.random() * totalWeight;

  for (const tier of tiers) {
    random -= tier.weight;
    if (random <= 0) {
      return (Math.random() * (tier.max - tier.min) + tier.min).toFixed(2);
    }
  }
  return '29.99';
}

async function createUsers(count: number): Promise<UserInsert[]> {
  console.log(`Creating ${count} users...`);
  const users: UserInsert[] = [];

  for (let i = 0; i < count; i++) {
    const name = generateIndianName();
    const username = generateUsername(name);

    users.push({
      id: `user_${nanoid()}`,
      name,
      email: generateEmail(name),
      emailVerified: true,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      username,
      displayUsername: username,
      role: 'user',
      banned: false,
      banReason: null,
      banExpires: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if ((i + 1) % 50 === 0) {
      console.log(`  Created ${i + 1}/${count} users...`);
    }
  }

  await db.insert(schema.user).values(users);
  console.log(`✓ Created ${count} users`);
  return users;
}

async function createInstructors(users: UserInsert[], count: number): Promise<UserInsert[]> {
  console.log(`Creating ${count} instructors...`);

  type InstructorInsert = typeof schema.instructors.$inferInsert;

  const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
  const selectedUsers = shuffledUsers.slice(0, count);

  const instructors: InstructorInsert[] = [];

  for (const user of selectedUsers) {
    const expertise = generateExpertise();
    const username = user.username;

    instructors.push({
      id: user.id,
      headline: `${expertise[0] || 'Web Development'} Expert & Trainer`,
      bio: faker.lorem.paragraph(3),
      expertise,
      socialLinks: generateSocialLinks(username),
      coursesCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  for (const instructor of instructors) {
    await db.transaction(async (tx) => {
      await tx.insert(schema.instructors).values(instructor);
      await tx.update(schema.user)
        .set({ role: 'instructor' as const, updatedAt: new Date() })
        .where(eq(schema.user.id, instructor.id));
    });
  }

  console.log(`✓ Created ${count} instructors`);
  return selectedUsers as UserInsert[];
}

async function createCourses(
  instructorUsers: UserInsert[],
  instructorCount: number,
  coursesPerInstructor: number
): Promise<CourseInsert[]> {
  console.log(`Creating courses...`);

  const shuffledInstructors = [...instructorUsers].sort(() => Math.random() - 0.5);
  const selectedInstructors = shuffledInstructors.slice(0, instructorCount);

  const allCourses: CourseInsert[] = [];
  let courseCounter = 0;

  for (const instructor of selectedInstructors) {
    const numCourses = randomInt(1, coursesPerInstructor);

    for (let i = 0; i < numCourses; i++) {
      courseCounter++;
      const category = randomElement(CATEGORIES);
      const titles = COURSE_TITLES[category as keyof typeof COURSE_TITLES] || COURSE_TITLES['Web Development'];
      const title = randomElement(titles);
      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nanoid(6)}`;

      const course = {
        id: `course_${nanoid()}`,
        slug,
        title,
        shortDescription: faker.lorem.sentence(10),
        longDescriptionHtml: SAMPLE_HTML_DESCRIPTION,
        coverImage: generateUnsplashUrl(title),
        rating: (Math.random() * 2 + 3).toFixed(1),
        enrollmentCount: 0,
        price: generatePrice(),
        language: randomElement(LANGUAGES),
        level: randomElement(LEVELS),
        status: 'published' as const,
        totalDurationHours: randomInt(5, 50),
        categories: [category],
        whatWillYouLearn: generateWhatYouLearn(),
        prerequisites: generatePrerequisites(),
        authorId: instructor.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      allCourses.push(course);
    }
  }

  for (const course of allCourses) {
    await db.insert(schema.courses).values(course);
    await db.update(schema.instructors)
      .set({ coursesCount: sql`${schema.instructors.coursesCount} + 1` })
      .where(eq(schema.instructors.id, course.authorId));
  }

  console.log(`✓ Created ${allCourses.length} courses`);
  return allCourses;
}

async function createSectionsAndLectures(courses: CourseInsert[]) {
  console.log('Creating sections and lectures...');

  let totalLectures = 0;

  for (const course of courses) {
    const numSections = randomInt(2, 5);

    for (let s = 0; s < numSections; s++) {
      const sectionId = `section_${nanoid()}`;
      const numLectures = randomInt(3, 8);

      await db.insert(schema.sections).values({
        id: sectionId,
        title: `Section ${s + 1}: ${faker.lorem.words(4)}`,
        description: faker.lorem.sentence(),
        order: s + 1,
        courseId: course.id
      });

      for (let l = 0; l < numLectures; l++) {
        const lectureType = randomElement(LECTURE_TYPES);
        const isFreePreview = Math.random() < 0.2;

        const lectureData: typeof schema.lectures.$inferInsert = {
          id: `lecture_${nanoid()}`,
          title: `Lecture ${l + 1}: ${faker.lorem.words(3)}`,
          order: l + 1,
          type: lectureType,
          durationInSeconds: lectureType === 'video' ? randomInt(300, 1800) : 0,
          isFreePreview,
          videoPublicId: null,
          articleContentHtml: lectureType === 'article' ? `<h3>${faker.lorem.words(4)}</h3><p>${faker.lorem.paragraphs(2)}</p>` : null,
          sectionId
        };

        await db.insert(schema.lectures).values(lectureData);
        totalLectures++;
      }
    }

    if ((courses.indexOf(course) + 1) % 10 === 0) {
      console.log(`  Processed ${courses.indexOf(course) + 1}/${courses.length} courses...`);
    }
  }

  console.log(`✓ Created sections and ${totalLectures} lectures`);
}

async function createEnrollments(
  allUsers: UserInsert[],
  instructors: UserInsert[],
  courses: CourseInsert[]
) {
  console.log('Creating enrollments...');

  const students = allUsers.filter(u => !instructors.some(i => i.id === u.id));
  const publishedCourses = courses.filter(c => c.status === 'published');

  let totalEnrollments = 0;

  for (const student of students) {
    const numEnrollments = randomInt(1, 5);
    const shuffledCourses = [...publishedCourses].sort(() => Math.random() - 0.5);
    const selectedCourses = shuffledCourses.slice(0, numEnrollments);

    for (const course of selectedCourses) {
      const existingEnrollment = await db.query.enrollments.findFirst({
        where: (enrollments, { and, eq }) => and(
          eq(enrollments.userId, student.id),
          eq(enrollments.courseId, course.id)
        )
      });

      if (existingEnrollment) continue;

      await db.transaction(async (tx) => {
        await tx.insert(schema.purchases).values({
          id: `purch_${nanoid()}`,
          userId: student.id,
          courseId: course.id,
          amount: course.price,
          paymentStatus: 'completed',
          purchasedAt: new Date()
        });

        await tx.insert(schema.enrollments).values({
          id: `enrl_${nanoid()}`,
          userId: student.id,
          courseId: course.id,
          progressPercentage: randomInt(0, 100),
          completedLectureIds: [],
          enrolledAt: new Date()
        });

        await tx.update(schema.courses)
          .set({ enrollmentCount: sql`${schema.courses.enrollmentCount} + 1` })
          .where(eq(schema.courses.id, course.id));
      });

      totalEnrollments++;
    }

    if ((students.indexOf(student) + 1) % 30 === 0) {
      console.log(`  Enrolled ${students.indexOf(student) + 1}/${students.length} students...`);
    }
  }

  console.log(`✓ Created ${totalEnrollments} enrollments`);
}

async function seed() {
  console.log('\n🚀 Starting database seed...\n');

  try {
    const users = await createUsers(200);
    const instructors = await createInstructors(users, 50);
    const instructorUsers = users.filter(u => instructors.some(i => i.id === u.id));
    const courses = await createCourses(instructorUsers, 40, 3);
    await createSectionsAndLectures(courses);
    await createEnrollments(users, instructors, courses);

    console.log('\n✅ Seed completed successfully!\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed().catch(console.error);
