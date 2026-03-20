import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const CATEGORY_IMAGES: Record<string, string[]> = {
  'Web Development': [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop',
  ],
  'Mobile Development': [
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&h=450&fit=crop',
  ],
  'Data Science': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&h=450&fit=crop',
  ],
  'Machine Learning': [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800&h=450&fit=crop',
  ],
  'Cloud Computing': [
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1560732488-6b0df240254a?w=800&h=450&fit=crop',
  ],
  'DevOps': [
    'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=450&fit=crop',
  ],
  'Cybersecurity': [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop',
  ],
  'UI/UX Design': [
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=450&fit=crop',
  ],
  'Graphic Design': [
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&h=450&fit=crop',
  ],
  'Business': [
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=450&fit=crop',
  ],
  'Marketing': [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=450&fit=crop',
  ],
  'Finance': [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=450&fit=crop',
  ],
  'Personal Development': [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
  ],
  'Photography': [
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?w=800&h=450&fit=crop',
  ],
  'Music': [
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=450&fit=crop',
  ],
  'Health & Fitness': [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop',
  ],
  'Cooking': [
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&h=450&fit=crop',
  ],
  'Languages': [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1493119508027-2b584f234d6c?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=450&fit=crop',
  ],
  'IT & Software': [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=450&fit=crop',
  ],
};

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getImageForCategory(category: string, seed: string): string {
  const images = CATEGORY_IMAGES[category] || DEFAULT_IMAGES;
  const index = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % images.length;
  return images[index];
}

async function updateCourseImages() {
  console.log('\n🔄 Starting course image update...\n');

  try {
    const courses = await db.select({
      id: schema.courses.id,
      title: schema.courses.title,
      categories: schema.courses.categories,
    }).from(schema.courses);

    console.log(`Found ${courses.length} courses to update`);

    const batchSize = 50;
    let updated = 0;

    for (let i = 0; i < courses.length; i += batchSize) {
      const batch = courses.slice(i, i + batchSize);

      await Promise.all(batch.map(async (course) => {
        const primaryCategory = course.categories?.[0] || 'Web Development';
        const newImageUrl = getImageForCategory(primaryCategory, course.id);

        await db.update(schema.courses)
          .set({ coverImage: newImageUrl })
          .where(eq(schema.courses.id, course.id));

        updated++;
      }));

      console.log(`  Updated ${Math.min(i + batchSize, courses.length)}/${courses.length} courses...`);
    }

    console.log(`\n✅ Successfully updated ${updated} course images!\n`);
  } catch (error) {
    console.error('❌ Update failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

updateCourseImages().catch(console.error);
