"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getSectionsAndLecturesAction, upsertSectionsAndLecturesAction } from "../_action/action";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Plus,
    GripVertical,
    Trash2,
    Video,
    FileText,
    HelpCircle,
    Edit,
    Upload,
    Loader2,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useAuth } from "@/lib/auth/use-session";
import { generateUploadSignature } from "@/lib/cloudinary.action";

// Validation schemas
const lectureSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Lecture title is required"),
    type: z.enum(["video"]), // Only allow "video" for now
    order: z.number(),
    isFreePreview: z.boolean(),
    videoPublicId: z.string().optional(),
    // videoPublicId will be set internally after upload, not by user
    // articleContentHtml: z.string().optional(), // Commented for now
});

const sectionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Section title is required"),
    description: z.string().optional(),
    order: z.number(),
    lectures: z.array(lectureSchema),
});

const formSchema = z.object({
    sections: z.array(sectionSchema).min(1, "At least one section is required"),
});

type FormData = z.infer<typeof formSchema>;
type Section = z.infer<typeof sectionSchema>;
type Lecture = z.infer<typeof lectureSchema>;

// Sortable Section Component
function SortableSection({
    section,
    sectionIndex,
    onUpdateSection,
    onDeleteSection,
    onAddLecture,
    onUpdateLecture,
    onDeleteLecture,
}: {
    section: Section;
    sectionIndex: number;
    onUpdateSection: (index: number, section: Section) => void;
    onDeleteSection: (index: number) => void;
    onAddLecture: (sectionIndex: number, lecture: Lecture) => void;
    onUpdateLecture: (sectionIndex: number, lectureIndex: number, lecture: Lecture) => void;
    onDeleteLecture: (sectionIndex: number, lectureIndex: number) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleLectureDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = section.lectures.findIndex((lecture) => lecture.id === active.id);
            const newIndex = section.lectures.findIndex((lecture) => lecture.id === over.id);

            const reorderedLectures = arrayMove(section.lectures, oldIndex, newIndex);

            // Update order numbers
            const updatedLectures = reorderedLectures.map((lecture, index) => ({
                ...lecture,
                order: index + 1,
            }));

            onUpdateSection(sectionIndex, {
                ...section,
                lectures: updatedLectures,
            });
        }
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="mb-4">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
                        >
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-lg">
                                Section {section.order}: {section.title}
                            </CardTitle>
                            {section.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {section.description}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <EditSectionDialog
                                section={section}
                                onUpdate={(updatedSection) => onUpdateSection(sectionIndex, updatedSection)}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteSection(sectionIndex)}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                                Lectures ({section.lectures.length})
                            </h4>
                            <AddLectureDialog
                                sectionIndex={sectionIndex}
                                onAdd={onAddLecture}
                            />
                        </div>

                        {section.lectures.length > 0 && (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleLectureDragEnd}
                                modifiers={[restrictToVerticalAxis]}
                            >
                                <SortableContext
                                    items={section.lectures.map((lecture) => lecture.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-2">
                                        {section.lectures.map((lecture, lectureIndex) => (
                                            <SortableLecture
                                                key={lecture.id}
                                                lecture={lecture}
                                                lectureIndex={lectureIndex}
                                                sectionIndex={sectionIndex}
                                                onUpdate={onUpdateLecture}
                                                onDelete={onDeleteLecture}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Sortable Lecture Component
function SortableLecture({
    lecture,
    lectureIndex,
    sectionIndex,
    onUpdate,
    onDelete,
}: {
    lecture: Lecture;
    lectureIndex: number;
    sectionIndex: number;
    onUpdate: (sectionIndex: number, lectureIndex: number, lecture: Lecture) => void;
    onDelete: (sectionIndex: number, lectureIndex: number) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lecture.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "video":
                return <Video className="h-4 w-4" />;
            case "article":
                return <FileText className="h-4 w-4" />;
            case "quiz":
                return <HelpCircle className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-background">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                    {getTypeIcon(lecture.type)}
                    <span className="text-xs">#{lecture.order}</span>
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{lecture.title}</span>
                        {lecture.isFreePreview && (
                            <Badge variant="outline" className="text-xs">
                                Free Preview
                            </Badge>
                        )}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                        {lecture.type}
                    </div>
                </div>

                <div className="flex gap-2">
                    <EditLectureDialog
                        lecture={lecture}
                        onUpdate={(updatedLecture) => onUpdate(sectionIndex, lectureIndex, updatedLecture)}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(sectionIndex, lectureIndex)}
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Edit Section Dialog
function EditSectionDialog({
    section,
    onUpdate,
}: {
    section: Section;
    onUpdate: (section: Section) => void;
}) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(section.title);
    const [description, setDescription] = useState(section.description || "");

    const handleSave = () => {
        if (!title.trim()) {
            toast.error("Section title is required");
            return;
        }

        onUpdate({
            ...section,
            title: title.trim(),
            description: description.trim() || undefined,
        });

        setOpen(false);
        toast.success("Section updated successfully");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Section</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium">Title *</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Section title"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional section description"
                            className="mt-1"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Edit Lecture Dialog
function EditLectureDialog({
    lecture,
    onUpdate,
}: {
    lecture: Lecture;
    onUpdate: (lecture: Lecture) => void;
}) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(lecture.title);
    const [type, setType] = useState<"video">("video");
    const [isFreePreview, setIsFreePreview] = useState(lecture.isFreePreview);
    // Remove videoPublicId input from dialog

    const handleSave = () => {
        if (!title.trim()) {
            toast.error("Lecture title is required");
            return;
        }

        onUpdate({
            ...lecture,
            title: title.trim(),
            type: "video",
            isFreePreview,
            // videoPublicId will be set after upload, not by user
        });

        setOpen(false);
        toast.success("Lecture updated successfully");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Lecture</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium">Title *</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Lecture title"
                            className="mt-1"
                        />
                    </div>

                    {/* Only show video type, comment others */}
                    <div>
                        <label className="text-sm font-medium">Type *</label>
                        <Select value={type} onValueChange={() => { }}>
                            <SelectTrigger className="mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="video">Video</SelectItem>
                                {/* <SelectItem value="article">Article</SelectItem>
                                <SelectItem value="quiz">Quiz</SelectItem> */}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Remove Video Public ID input */}

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="free-preview"
                            checked={isFreePreview}
                            onCheckedChange={setIsFreePreview}
                        />
                        <label htmlFor="free-preview" className="text-sm font-medium">
                            Free Preview
                        </label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Add Section Dialog
function AddSectionDialog({ onAdd }: { onAdd: (section: Section) => void }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleAdd = () => {
        if (!title.trim()) {
            toast.error("Section title is required");
            return;
        }

        const newSection: Section = {
            id: `section_${nanoid()}`,
            title: title.trim(),
            description: description.trim() || undefined,
            order: 0, // Will be set by parent
            lectures: [],
        };

        onAdd(newSection);
        setTitle("");
        setDescription("");
        setOpen(false);
        toast.success("Section added successfully");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Section</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium">Title *</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Section title"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional section description"
                            className="mt-1"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAdd}>Add Section</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Add Lecture Dialog
function AddLectureDialog({
    sectionIndex,
    onAdd,
}: {
    sectionIndex: number;
    onAdd: (sectionIndex: number, lecture: Lecture) => void;
}) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [type] = useState<"video">("video");
    const [isFreePreview, setIsFreePreview] = useState(false);

    // NEW: state for upload
    const [videoPublicId, setVideoPublicId] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const searchParams = useSearchParams();
    const courseId = searchParams.get("courseId");

    const handleVideoUpload = async (file: File) => {
        if (!file || !courseId) return;

        setIsUploading(true);
        setUploadProgress(0);

        // 1. Get signature from our server action
        const sigResult = await generateUploadSignature(`courses/${courseId}/lectures`);
        if (!sigResult.success || !sigResult.data) {
            toast.error(sigResult.message || "Failed to get upload signature.");
            setIsUploading(false);
            return;
        }

        const { timestamp, signature, apiKey, cloudName, folder } = sigResult.data;

        // 2. Prepare form data for Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", folder);

        // 3. Upload directly to Cloudinary using fetch with progress tracking
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                setVideoPublicId(response.public_id);
                toast.success("Video uploaded successfully!");
            } else {
                const response = JSON.parse(xhr.responseText);
                toast.error(response.error?.message || "Video upload failed.");
            }
            setIsUploading(false);
        };

        xhr.onerror = () => {
            toast.error("An error occurred during the upload.");
            setIsUploading(false);
        };

        xhr.send(formData);
    };

    const handleAdd = () => {
        if (!title.trim()) {
            toast.error("Lecture title is required");
            return;
        }

        const newLecture: Lecture = {
            id: `lecture_${nanoid()}`,
            title: title.trim(),
            type,
            order: 0,
            isFreePreview,
            // CHANGE: use videoPublicId
            videoPublicId: type === "video" ? videoPublicId : undefined,
        };

        onAdd(sectionIndex, newLecture);

        // Reset state
        setTitle("");
        setIsFreePreview(false);
        setVideoPublicId("");
        setOpen(false);
        toast.success("Lecture added successfully");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lecture
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Lecture</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium">Title *</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Lecture title"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Type *</label>
                        <Select value={type} disabled>
                            <SelectTrigger className="mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="video">Video</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* UPDATED: Video Upload Section */}
                    {type === "video" && (
                        <div>
                            <label className="text-sm font-medium">Lecture Video</label>
                            <div className="mt-1 space-y-2">
                                {isUploading ? (
                                    <div className="w-full text-center">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Uploading... {uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2.5">
                                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                        </div>
                                    </div>
                                ) : videoPublicId ? (
                                    <div className="text-sm text-green-600 dark:text-green-400 p-2 bg-green-50 dark:bg-green-950/50 rounded-md">
                                        Video ready: <span className="font-mono text-xs">{videoPublicId}</span>
                                    </div>
                                ) : (
                                    <Input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => e.target.files && handleVideoUpload(e.target.files[0])}
                                        disabled={isUploading}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* ... Free Preview switch remains the same ... */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="free-preview"
                            checked={isFreePreview}
                            onCheckedChange={setIsFreePreview}
                        />
                        <label htmlFor="free-preview" className="text-sm font-medium">
                            Free Preview
                        </label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAdd} disabled={isUploading}>
                            {isUploading ? "Uploading..." : "Add Lecture"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Content Component
function SectionLectureManagerContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get("courseId");
    const courseSlug = searchParams.get("courseSlug");
    const { isAuthenticated, isInstructor, isAdmin } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasExistingData, setHasExistingData] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sections: [],
        },
    });

    // Fetch existing data using server action
    useEffect(() => {
        const fetchExistingData = async () => {
            if (!courseId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const result = await getSectionsAndLecturesAction(courseId);

                if (result.success && result.data && result.data.length > 0) {
                    // Filter and map result.data to match the expected schema
                    const filteredSections = result.data.map((section: any) => ({
                        ...section,
                        lectures: section.lectures
                            .filter((lecture: any) => lecture.type === "video")
                            .map((lecture: any) => ({
                                id: lecture.id,
                                title: lecture.title,
                                order: lecture.order,
                                type: "video",
                                isFreePreview: lecture.isFreePreview,
                                videoPublicId: lecture.videoPublicId,
                            })),
                    }));
                    form.setValue("sections", filteredSections);
                    setHasExistingData(true);
                    toast.success(`Loaded ${filteredSections.length} existing sections`);
                } else if (!result.success) {
                    toast.error(result.message || "Failed to load course structure");
                } else {
                    setHasExistingData(false);
                }
            } catch (error) {
                console.error("Error fetching existing data:", error);
                toast.error("Failed to load existing course structure");
            } finally {
                setIsLoading(false);
            }
        };

        if (courseId && isAuthenticated) {
            fetchExistingData();
        }
    }, [courseId, isAuthenticated, form]);

    // Permission checks
    useEffect(() => {
        if (!courseId || !courseSlug) {
            toast.error("Course ID and slug are required.");
            router.replace("/courses");
            return;
        }
        if (!isAuthenticated) {
            router.replace("/sign-in");
            return;
        }
        if (!isInstructor && !isAdmin) {
            router.replace("/");
            return;
        }
    }, [courseId, courseSlug, isAuthenticated, isInstructor, isAdmin, router]);

    const { fields: sections, append, remove, update } = useFieldArray({
        control: form.control,
        name: "sections",
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    // Optionally, show nothing or a loading spinner while redirecting
    if (
        !courseId ||
        !courseSlug ||
        !isAuthenticated ||
        (!isInstructor && !isAdmin)
    ) {
        return null;
    }
    const handleSectionDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((section) => section.id === active.id);
            const newIndex = sections.findIndex((section) => section.id === over.id);

            const reorderedSections = arrayMove(sections, oldIndex, newIndex);

            // Update order numbers
            const updatedSections = reorderedSections.map((section, index) => ({
                ...section,
                order: index + 1,
            }));

            // Replace all sections with reordered ones
            form.setValue("sections", updatedSections);
        }
    };

    const addSection = (newSection: Section) => {
        const sectionWithOrder = {
            ...newSection,
            order: sections.length + 1,
        };
        append(sectionWithOrder);
    };

    const updateSection = (index: number, updatedSection: Section) => {
        update(index, updatedSection);
    };

    const deleteSection = (index: number) => {
        remove(index);

        // Reorder remaining sections
        const remainingSections = form.getValues("sections");
        const reorderedSections = remainingSections.map((section, idx) => ({
            ...section,
            order: idx + 1,
        }));
        form.setValue("sections", reorderedSections);

        toast.success("Section deleted successfully");
    };

    const addLecture = (sectionIndex: number, newLecture: Lecture) => {
        const currentSections = form.getValues("sections");
        const section = currentSections[sectionIndex];

        const lectureWithOrder = {
            ...newLecture,
            order: section.lectures.length + 1,
        };

        const updatedSection = {
            ...section,
            lectures: [...section.lectures, lectureWithOrder],
        };

        update(sectionIndex, updatedSection);
    };

    const updateLecture = (sectionIndex: number, lectureIndex: number, updatedLecture: Lecture) => {
        const currentSections = form.getValues("sections");
        const section = currentSections[sectionIndex];

        const updatedLectures = [...section.lectures];
        updatedLectures[lectureIndex] = updatedLecture;

        const updatedSection = {
            ...section,
            lectures: updatedLectures,
        };

        update(sectionIndex, updatedSection);
    };

    const deleteLecture = (sectionIndex: number, lectureIndex: number) => {
        const currentSections = form.getValues("sections");
        const section = currentSections[sectionIndex];

        const updatedLectures = section.lectures.filter((_, idx) => idx !== lectureIndex);

        // Reorder remaining lectures
        const reorderedLectures = updatedLectures.map((lecture, idx) => ({
            ...lecture,
            order: idx + 1,
        }));

        const updatedSection = {
            ...section,
            lectures: reorderedLectures,
        };

        update(sectionIndex, updatedSection);
        toast.success("Lecture deleted successfully");
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const result = await upsertSectionsAndLecturesAction(courseId, data, courseSlug);

            if (!result.success) {
                toast.error(result.message || "Failed to save sections and lectures.");
                return;
            }
            router.refresh();
            toast.success(hasExistingData ? "Course structure updated successfully!" : "Course structure created successfully!");
            router.push(`/courses/${courseSlug}`);

        } catch (error) {
            console.error("Error saving sections and lectures:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Course Sections & Lectures
                    </h1>
                    <p className="text-muted-foreground">
                        Organize your course content into sections and lectures. Drag and drop to reorder.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Course Structure</CardTitle>
                                    <AddSectionDialog onAdd={addSection} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {sections.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium mb-2">No sections yet</p>
                                        <p className="text-sm">Add your first section to get started</p>
                                    </div>
                                ) : (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleSectionDragEnd}
                                        modifiers={[restrictToVerticalAxis]}
                                    >
                                        <SortableContext
                                            items={sections.map((section) => section.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-4">
                                                {sections.map((section, index) => (
                                                    <SortableSection
                                                        key={section.id}
                                                        section={section}
                                                        sectionIndex={index}
                                                        onUpdateSection={updateSection}
                                                        onDeleteSection={deleteSection}
                                                        onAddLecture={addLecture}
                                                        onUpdateLecture={updateLecture}
                                                        onDeleteLecture={deleteLecture}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                )}
                            </CardContent>
                        </Card>

                        {sections.length > 0 && (
                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => form.reset({ sections: [] })}
                                    disabled={isSubmitting}
                                >
                                    Clear All
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Course Structure"}
                                </Button>
                            </div>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );
}

// Main export
export default function SectionLectureManager() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
            <SectionLectureManagerContent />
        </Suspense>
    );
}