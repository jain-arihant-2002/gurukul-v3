// lib/auth-utils.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserRole } from "@/utils/types";

type AuthResult = {
  session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
  user: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>["user"];
};

type AuthorizeOptions = {
  require?: UserRole[];
};

/**
 * A centralized function to handle session and role-based authorization.
 * It's designed for use in Server Actions and API Routes.
 * It returns the session and user on success, or an error message on failure.
 *
 * @param {AuthorizeOptions} options - Optional roles to check against.
 * @returns {Promise<{ data: AuthResult | null, error: string | null }>}
 */

export async function authorize(options: AuthorizeOptions = {}): Promise<{ data: AuthResult | null, error: string | null }> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    return { data: null, error: "Unauthorized: You must be logged in." };
  }

  if (options.require && !options.require.includes(session.user.role as UserRole)) {
    return { data: null, error: "Forbidden: You do not have the required permissions." };
  }

  // Type assertion to ensure session and user are not null past this point
  return { data: { session, user: session.user }, error: null };
}