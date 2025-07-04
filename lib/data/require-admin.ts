
import { cache } from "react";
import { requireUser } from "./require-user"
import { notFound } from 'next/navigation'


export const requireTeacher = cache(async () => {
    const session = await requireUser();

    if (session?.user.role !== 'admin') {
        notFound(); // as dont want to tell user admin only page
    }
    return session;
})