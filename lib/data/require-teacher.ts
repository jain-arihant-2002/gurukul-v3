import { redirect } from "next/navigation";
import { requireUser } from "./require-user"
import { cache } from "react";


export const requireTeacher = cache(async () => {
    const session = await requireUser();

    if (session?.user.role !== 'teacher') {
        redirect('/teacher');
    }
    return session;
})