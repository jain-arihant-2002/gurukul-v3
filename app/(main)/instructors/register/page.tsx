'use client';
import React, { useState } from 'react';
import InstructorForm from './_component/instructorForm';
import { createInstructorProfileAction } from '../_action/action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/use-session';

const RegisterTeacherPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, refetch } = useAuth()

    const handleSubmit = async (data: { headline: string; bio: string; expertise: string[]; socialLinks?: { platform: string; url: string; }[] }) => {
        setIsSubmitting(true);
        try {
            // Map socialLinks to restrict platform to allowed values
            const allowedPlatforms = ["twitter", "linkedin", "github", "website"] as const;
            const formattedData = {
                ...data,
                socialLinks: data.socialLinks?.filter(link =>
                    allowedPlatforms.includes(link.platform as any)
                ).map(link => ({
                    ...link,
                    platform: link.platform as "twitter" | "linkedin" | "github" | "website"
                }))
            };

            const result = await createInstructorProfileAction(formattedData);

            if (result?.error) {
                toast.error(result.message || "Failed to create instructor profile.");
            } else {
                //maybe this is causing race condition needs more testing
                refetch(); //So that the session is updated with the new instructor role
                console.log('User', user)
                toast.success("Instructor profile created successfully!");
                router.push('/courses/create');
            }
        } catch (error) {
            toast.error("Failed to register instructor. Please try again.");
            console.error('Failed to register instructor:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <InstructorForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        />
    );
};

export default RegisterTeacherPage;