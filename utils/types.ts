export type Instructor = {
  id: string;
  name: string;
  avatar: string;
  expertise: string; // comma-separated string
  bio: string;
  coursesCount: number;
};

export type Course = {
  id: string;
  title: string;
  coverImage: string;
  category: string; // comma-separated string of tags
  price: number;
  updatedAt: string; // ISO string
};
