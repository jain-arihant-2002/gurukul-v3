"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "@/components/RichTextEditor";
import { toast } from "sonner";
import { Loader2, X, Upload, Plus, ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { convertImageToBase64 } from "@/utils/helperFunctions";
import { CourseLevel, CourseStatus } from "@/utils/types";
import Link from "next/link";

// Zod schema for course creation
const courseSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    shortDescription: z.string().min(10, "Short description must be at least 10 characters").max(200, "Short description must be less than 200 characters"),
    longDescriptionHtml: z.string().min(50, "Long description must be at least 50 characters"),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Price must be a valid number"),
    language: z.string().min(1, "Language is required"),
    level: z.enum(Object.values(CourseLevel) as [string, ...string[]], {
        required_error: "Please select a course level",
    }),
    status: z.enum(Object.values(CourseStatus) as [string, ...string[]], {
        required_error: "Please select a course status",
    }),
    categories: z.array(z.string()).min(1, "At least one category is required"),
    whatWillYouLearn: z.array(z.string()).min(1, "At least one learning outcome is required"),
    prerequisites: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
    totalDurationHours: z.number().min(0, "Total duration must be at least 0"),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
    mode: 'create' | 'edit';
    initialData?: (Partial<CourseFormData> & { id?: string });
    onSubmit: (data: CourseFormData) => Promise<void>;
    isSubmitting: boolean;
}

export default function CourseForm({ mode, initialData, onSubmit, isSubmitting }: CourseFormProps) {
    const [categoryInput, setCategoryInput] = useState("");
    const [learningOutcomeInput, setLearningOutcomeInput] = useState("");
    const [prerequisiteInput, setPrerequisiteInput] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit');

    // Image preview state
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.coverImage || null);

    const form = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            shortDescription: initialData?.shortDescription || "",
            longDescriptionHtml: initialData?.longDescriptionHtml || "",
            price: initialData?.price || "0.00",
            language: initialData?.language || "English",
            level: initialData?.level || "all-levels",
            status: initialData?.status || "draft",
            categories: initialData?.categories || [],
            whatWillYouLearn: initialData?.whatWillYouLearn || [],
            prerequisites: initialData?.prerequisites || [],
            coverImage: initialData?.coverImage || "",
        },
    });

    // Generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
    };

    // Watch title changes and auto-generate slug
    const watchTitle = form.watch("title");

    useEffect(() => {
        if (watchTitle && !slugManuallyEdited && mode === 'create') {
            const newSlug = generateSlug(watchTitle);
            form.setValue("slug", newSlug);
        }
    }, [watchTitle, slugManuallyEdited, form, mode]);

    // Handle image selection and preview
    const handleImageSelection = async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file");
            return;
        }

        // Validate file size (3MB limit)
        if (file.size > 3 * 1024 * 1024) {
            toast.error("Image size should be less than 3MB");
            return;
        }

        setSelectedImage(file);

        try {
            // Convert image to base64 using utility function
            const base64String = await convertImageToBase64(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Store base64 string in form 
            form.setValue("coverImage", base64String);

            toast.success("Image selected and converted to base64 successfully!");
        } catch (error) {
            console.error("Error converting image to base64:", error);
            toast.error("Failed to process image. Please try again.");
        }
    };

    // Remove selected image
    const removeSelectedImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        form.setValue("coverImage", "");

        // Reset file input
        const fileInput = document.getElementById("cover-image") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    // Add category
    const addCategory = () => {
        if (categoryInput.trim()) {
            const currentCategories = form.getValues("categories") || [];
            if (!currentCategories.includes(categoryInput.trim())) {
                form.setValue("categories", [...currentCategories, categoryInput.trim()], { shouldValidate: true });
                setCategoryInput("");
            }
        }
    };

    // Remove category
    const removeCategory = (categoryToRemove: string) => {
        const currentCategories = form.getValues("categories") || [];
        form.setValue(
            "categories",
            currentCategories.filter(cat => cat !== categoryToRemove),
            { shouldValidate: true }
        );
    };

    // Add learning outcome
    const addLearningOutcome = () => {
        if (learningOutcomeInput.trim()) {
            const currentOutcomes = form.getValues("whatWillYouLearn") || [];
            if (!currentOutcomes.includes(learningOutcomeInput.trim())) {
                form.setValue(
                    "whatWillYouLearn",
                    [...currentOutcomes, learningOutcomeInput.trim()],
                    { shouldValidate: true }
                );
                setLearningOutcomeInput("");
            }
        }
    };

    // Remove learning outcome
    const removeLearningOutcome = (index: number) => {
        const currentOutcomes = form.getValues("whatWillYouLearn") || [];
        form.setValue(
            "whatWillYouLearn",
            currentOutcomes.filter((_, i) => i !== index),
            { shouldValidate: true }
        );
    };

    // Add prerequisite
    const addPrerequisite = () => {
        if (prerequisiteInput.trim()) {
            const currentPrerequisites = form.getValues("prerequisites") || [];
            if (!currentPrerequisites.includes(prerequisiteInput.trim())) {
                form.setValue(
                    "prerequisites",
                    [...currentPrerequisites, prerequisiteInput.trim()],
                    { shouldValidate: true }
                );
                setPrerequisiteInput("");
            }
        }
    };

    // Remove prerequisite
    const removePrerequisite = (index: number) => {
        const currentPrerequisites = form.getValues("prerequisites") || [];
        form.setValue(
            "prerequisites",
            currentPrerequisites.filter((_, i) => i !== index),
            { shouldValidate: true }
        );
    };

    // Handle drag and drop
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleImageSelection(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleImageSelection(files[0]);
        }
    };

    const resetForm = () => {
        if (mode === 'create') {
            form.reset();
            setSlugManuallyEdited(false);
            setSelectedImage(null);
            setImagePreview(null);
        } else {
            // Reset to initial data for edit mode
            form.reset(initialData as CourseFormData);
            setSelectedImage(null);
            setImagePreview(initialData?.coverImage || null);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        {mode === 'create' ? 'Create New Course' : 'Edit Course'}
                    </h1>
                    <p className="text-muted-foreground">
                        {mode === 'create'
                            ? 'Fill in the details below to create your new course. All fields marked with * are required.'
                            : 'Update the course details below. All fields marked with * are required.'
                        }
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Course Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Title and Slug */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="course-title">Course Title *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="course-title"
                                                        placeholder="Enter course title"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="course-slug">Course Slug *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="course-slug"
                                                        placeholder="course-slug"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setSlugManuallyEdited(true);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Short Description */}
                                <FormField
                                    control={form.control}
                                    name="shortDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="course-short-description">Short Description *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    id="course-short-description"
                                                    placeholder="Brief description of your course (max 200 characters)"
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                {field.value?.length || 0}/200 characters
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Long Description */}
                                <FormField
                                    control={form.control}
                                    name="longDescriptionHtml"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="course-long-description">Detailed Description *</FormLabel>
                                            <FormControl>
                                                <RichTextEditor
                                                    content={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Write a detailed description of your course..."
                                                    className="min-h-[300px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Price, Language, Level, Duration, Status */}
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="course-status">Status *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger id="course-status" className="w-full">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="published">Published</SelectItem>
                                                        {mode === 'edit' && <SelectItem value="archived">Archived</SelectItem>}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={form.control}
                                        name="language"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="course-language">Language *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger id="course-language"  className="w-full">
                                                            <SelectValue placeholder="Select language" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="English">English</SelectItem>
                                                        <SelectItem value="Spanish">Spanish</SelectItem>
                                                        <SelectItem value="French">French</SelectItem>
                                                        <SelectItem value="German">German</SelectItem>
                                                        <SelectItem value="Hindi">Hindi</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="level"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="course-level">Course Level *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger id="course-level"  className="w-full">
                                                            <SelectValue placeholder="Select level" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="beginner">Beginner</SelectItem>
                                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                                        <SelectItem value="advanced">Advanced</SelectItem>
                                                        <SelectItem value="all-levels">All Levels</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="totalDurationHours"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="course-total-duration">Total Course Time (hours)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="course-total-duration"
                                                        type="number"
                                                        min={0}
                                                        step={0.1}
                                                        placeholder="e.g. 5.5"
                                                        {...field}
                                                    />
                                                </FormControl>  
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="course-price">Price (USD) *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="course-price"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Cover Image with Preview */}
                                <FormField
                                    control={form.control}
                                    name="coverImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="cover-image">Course Cover Image</FormLabel>

                                            {/* Image Preview */}
                                            {imagePreview && (
                                                <div className="mb-4">
                                                    <div className="relative w-full max-w-md mx-auto">
                                                        <div className="aspect-video relative rounded-lg overflow-hidden border-2 border-border">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Course cover preview"

                                                                className="object-cover fill"
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
                                                            onClick={removeSelectedImage}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    {selectedImage && (
                                                        <p className="text-sm text-muted-foreground text-center mt-2">
                                                            {selectedImage.name} ({((selectedImage.size || 0) / 1024 / 1024).toFixed(2)} MB)
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Upload Area */}
                                            {!imagePreview && (
                                                <div
                                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                                        ? "border-primary bg-primary/10"
                                                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                                                        }`}
                                                    onDragEnter={handleDrag}
                                                    onDragLeave={handleDrag}
                                                    onDragOver={handleDrag}
                                                    onDrop={handleDrop}
                                                >
                                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                                    <p className="text-lg font-medium text-foreground mb-2">
                                                        Drop your image here, or click to browse
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        Supports JPG, PNG, GIF up to 3MB
                                                    </p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileInput}
                                                        className="hidden"
                                                        id="cover-image"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => document.getElementById("cover-image")?.click()}
                                                    >
                                                        <ImageIcon className="mr-2 h-4 w-4" />
                                                        Choose File
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Change Image Button */}
                                            {imagePreview && (
                                                <div className="text-center">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileInput}
                                                        className="hidden"
                                                        id="change-cover-image"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => document.getElementById("change-cover-image")?.click()}
                                                    >
                                                        <ImageIcon className="mr-2 h-4 w-4" />
                                                        Change Image
                                                    </Button>
                                                </div>
                                            )}

                                            <FormDescription>
                                                Upload will be handled with presigned URLs in production
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Categories */}
                                <FormField
                                    control={form.control}
                                    name="categories"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="course-categories">Course Categories *</FormLabel>
                                            <div className="flex gap-2 mb-3">
                                                <Input
                                                    id="course-categories"
                                                    placeholder="Add a category"
                                                    value={categoryInput}
                                                    onChange={(e) => setCategoryInput(e.target.value)}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            addCategory();
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={addCategory}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {(Array.isArray(field.value) ? field.value : []).map((category, index) => (
                                                    <Badge key={index} variant="secondary" className="text-sm">
                                                        {category}
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="ml-2 h-auto p-0"
                                                            onClick={() => removeCategory(category)}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </Badge>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Learning Outcomes */}
                                <FormField
                                    control={form.control}
                                    name="whatWillYouLearn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="course-what-will-you-learn">What Will Students Learn? *</FormLabel>
                                            <div className="flex gap-2 mb-3">
                                                <Input
                                                    id="course-what-will-you-learn"
                                                    placeholder="Add a learning outcome"
                                                    value={learningOutcomeInput}
                                                    onChange={(e) => setLearningOutcomeInput(e.target.value)}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            addLearningOutcome();
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={addLearningOutcome}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                {Array.isArray(field.value) ? field.value.map((outcome, index) => (
                                                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                                                        <span className="flex-1">{outcome}</span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeLearningOutcome(index)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )) : null}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Prerequisites */}
                                <FormField
                                    control={form.control}
                                    name="prerequisites"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="course-prerequisites">Course Prerequisites (Optional)</FormLabel>
                                            <div className="flex gap-2 mb-3">
                                                <Input
                                                    id="course-prerequisites"
                                                    placeholder="Add a prerequisite"
                                                    value={prerequisiteInput}
                                                    onChange={(e) => setPrerequisiteInput(e.target.value)}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            addPrerequisite();
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={addPrerequisite}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                {(field.value || []).map((prerequisite, index) => (
                                                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                                                        <span className="flex-1">{prerequisite}</span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removePrerequisite(index)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <div className="flex justify-end gap-4 pt-6">

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resetForm}
                                        disabled={isSubmitting}
                                    >
                                        {mode === 'create' ? 'Reset Form' : 'Reset Changes'}
                                    </Button>

                                    {/* Manage Sections & Lectures Button (shown only in edit mode) */}
                                    {mode === "edit" && initialData?.slug && initialData?.id && (
                                        <Button asChild variant="outline">
                                            <Link
                                                href={`/courses/create/section?courseId=${initialData.id}&courseSlug=${initialData.slug}`}
                                            >
                                                Manage Sections & Lectures
                                            </Link>
                                        </Button>
                                    )}
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {mode === 'create' ? 'Creating Course...' : 'Updating Course...'}
                                            </>
                                        ) : (
                                            mode === 'create' ? 'Create Course' : 'Update Course'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>


            </div>
        </div>
    );
}