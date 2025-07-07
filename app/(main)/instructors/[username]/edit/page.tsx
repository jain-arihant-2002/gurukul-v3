import { getInstructorByUsername } from "@/lib/dal"
import EditTeacherProfilePage from "./editPage"
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth/session";

export default async function page({ params }: { params: Promise<{ username: string }> }) {

  const { user } = await getAuth();

  if (!user)
    redirect('/sign-in');

  const { username } = await params;

  const instructor = await getInstructorByUsername(username);

  if (!instructor)
    redirect('/not-found')

  if (instructor.id !== user.id) {
    redirect('/not-found');
  }
  const formData = {
    headline: instructor.headline,
    bio: instructor.bio,
    expertise: instructor.expertise,
    socialLinks: instructor.socialLinks,
    id: instructor.id
  }

  return (
    <EditTeacherProfilePage initialData={formData} />
  )
}