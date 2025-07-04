import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const requireUser = cache(async function requireUser() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        redirect('/signin');
    }
    return session;
});

