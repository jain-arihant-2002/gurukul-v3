import { cache } from "react";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { UserRole } from "@/utils/types";


export const getAuth = cache(async () => {
  const session = await auth.api.getSession({ headers:await headers() });

  const user = session?.user ?? null;
  const isAuthenticated = !!user;

  const isAdmin = user?.role === UserRole.ADMIN; 
  const isInstructor = user?.role === UserRole.INSTRUCTOR;

  return {
    session,
    user,
    isAuthenticated,
    isAdmin,
    isInstructor,
  };
});