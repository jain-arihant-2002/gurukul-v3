"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { convertImageToBase64 } from "@/utils/helperFunctions";

// Zod schema for validation, including password confirmation
const formSchema = z
    .object({
        firstName: z.string().min(2, "First name must be at least 2 characters."),
        lastName: z.string().min(2, "Last name must be at least 2 characters."),
        email: z.string().email("Please enter a valid email address."),
        username: z
            .string()
            .min(3, "Username must be at least 3 characters.")
            .regex(
                /^[a-zA-Z0-9_.]+$/,
                "Username can only contain letters, numbers, underscores, and dots."
            ),
        password: z.string().min(8, "Password must be at least 8 characters."),
        passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    });

const fieldConfigs = [
    {
        name: "firstName",
        label: "First name",
        type: "text",
        placeholder: "Arihant",
        colSpan: 1,
    },
    {
        name: "lastName",
        label: "Last name",
        type: "text",
        placeholder: "Jain",
        colSpan: 1,
    },
    {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "example@example.com",
        colSpan: 2,
    },
    {
        name: "username",
        label: "Username",
        type: "text",
        placeholder: "arihant_jain",
        colSpan: 2,
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        colSpan: 2,
        autoComplete: "new-password",
    },
    {
        name: "passwordConfirmation",
        label: "Confirm Password",
        type: "password",
        placeholder: "••••••••",
        colSpan: 2,
        autoComplete: "new-password",
    },
];

// Utility to convert image to base64


export default function SignUp() {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    // Image state
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Image change handler
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            passwordConfirmation: "",
        },
    });

    const { isSubmitting } = form.formState;

    if (session) {
        router.push("/");
        return null;
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let imageBase64: string | undefined = undefined;
        if (image) {
            imageBase64 = await convertImageToBase64(image);
        }

        const { data, error } = await authClient.signUp.email({
            email: values.email,
            password: values.password,
            username: values.username,
            name: `${values.firstName} ${values.lastName}`,
            image: imageBase64, // Pass image as base64 if needed
        });

        if (error) {
            toast.error(error.message || "Sign-up failed. Please try again.");
            return;
        }

        toast.success("Account created successfully! Redirecting...");
        router.push("/");
    }

    return (
        <div className="flex min-h-screen items-center justify-center w-full">
            <Card className="z-50 min-w-screen h-screen md:h-full md:max-w-md md:min-w-md">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                {fieldConfigs.slice(0, 2).map((field) => (
                                    <FormField
                                        key={field.name}
                                        control={form.control}
                                        name={field.name as any}
                                        render={({ field: f }) => (
                                            <FormItem>
                                                <FormLabel>{field.label}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type={field.type}
                                                        placeholder={field.placeholder}
                                                        autoComplete={field.autoComplete}
                                                        {...f}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                            {fieldConfigs.slice(2).map((field) => (
                                <FormField
                                    key={field.name}
                                    control={form.control}
                                    name={field.name as any}
                                    render={({ field: f }) => (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={field.type}
                                                    placeholder={field.placeholder}
                                                    autoComplete={field.autoComplete}
                                                    {...f}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            {/* Image upload and preview */}
                    <div className="grid gap-2 mb-4">
                        <label htmlFor="image" className="font-medium text-sm">
                            Profile Image (optional)
                        </label>
                        <div className="flex items-end gap-4">
                            {imagePreview && (
                                <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                                    <Image
                                        src={imagePreview}
                                        alt="Profile preview"
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-2 w-full">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full"
                                />
                                {imagePreview && (
                                    <X
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview(null);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    "Create an account"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center border-t py-4 mt-4">
                    <p className="text-center text-xs text-neutral-500">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="underline font-semibold cursor-pointer dark:text-white/70 ">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}