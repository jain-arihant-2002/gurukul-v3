"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Loader2 } from "lucide-react";
import type { SocialLink } from "@/utils/types";
import { useAuth } from "@/lib/auth/use-session";
import { useRouter } from "next/navigation";

// Extract platform type from SocialLink
type SocialPlatform = SocialLink["platform"];

// Zod schema using your types
const socialLinkSchema = z.object({
  platform: z.enum(["twitter", "linkedin", "github", "website"]),
  url: z.string().url("Must be a valid URL"),
});

const instructorSchema = z.object({
  headline: z.string().min(5, "Headline must be at least 5 characters"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  expertise: z.array(z.string().min(1)).min(1, "Add at least one expertise"),
  socialLinks: z.array(socialLinkSchema).optional(),
});

type InstructorFormData = z.infer<typeof instructorSchema>;

type InstructorFormProps = {
  mode?: 'create' | 'edit';
  initialData?: Partial<InstructorFormData>;
  onSubmit: (data: InstructorFormData) => Promise<void>;
  isSubmitting: boolean;
};

export default function InstructorForm({
  mode = 'create',
  initialData,
  onSubmit,
  isSubmitting
}: InstructorFormProps) {
  const { user } = useAuth()
  const router = useRouter();

  const [expertiseInput, setExpertiseInput] = useState("");
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>("twitter");
  const [socialUrl, setSocialUrl] = useState("");

  if (!user)
    router.push('/sign-in');

  const form = useForm<InstructorFormData>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      headline: initialData?.headline || "",
      bio: initialData?.bio || "",
      expertise: initialData?.expertise || [],
      socialLinks: initialData?.socialLinks || [],
    },
  });

  // Expertise handlers
  const addExpertise = () => {
    if (expertiseInput.trim()) {
      const current = form.getValues("expertise") || [];
      if (!current.includes(expertiseInput.trim())) {
        form.setValue("expertise", [...current, expertiseInput.trim()], { shouldValidate: true });
        setExpertiseInput("");
      }
    }
  };

  const removeExpertise = (item: string) => {
    const current = form.getValues("expertise") || [];
    form.setValue("expertise", current.filter((e) => e !== item), { shouldValidate: true });
  };

  // Social link handlers
  const addSocialLink = () => {
    if (!socialUrl.trim()) return;
    const current = form.getValues("socialLinks") || [];
    if (!current.some((l) => l.platform === socialPlatform)) {
      form.setValue(
        "socialLinks",
        [...current, { platform: socialPlatform, url: socialUrl.trim() }],
        { shouldValidate: true }
      );
      setSocialUrl("");
    }
  };

  const removeSocialLink = (platform: SocialPlatform) => {
    const current = form.getValues("socialLinks") || [];
    form.setValue(
      "socialLinks",
      current.filter((l) => l.platform !== platform),
      { shouldValidate: true }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {mode === 'create' ? 'Become an Instructor' : 'Edit Instructor Profile'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'create'
              ? 'Fill in your profile information to start teaching on our platform. All fields marked with * are required.'
              : 'Update your instructor profile information below.'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Instructor Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Headline */}
                <FormField
                  control={form.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="instructor-headline">Professional Headline *</FormLabel>
                      <FormControl>
                        <Input
                          id="instructor-headline"
                          placeholder="e.g. Senior Frontend Engineer & React Expert"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief professional headline that describes your expertise
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="instructor-bio">Bio *</FormLabel>
                      <FormControl>
                        <Textarea
                          id="instructor-bio"
                          placeholder="Tell us about yourself, your experience, and what you're passionate about teaching..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0} characters (minimum 20)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Expertise */}
                <FormField
                  control={form.control}
                  name="expertise"
                  render={() => (
                    <FormItem>
                      <FormLabel htmlFor="instructor-expertise">Areas of Expertise *</FormLabel>
                      <div className="flex gap-2 mb-3">
                        <Input
                          id="instructor-expertise"
                          name="expertise"
                          placeholder="Add a technology or skill (e.g. React, Python, Machine Learning)"
                          value={expertiseInput}
                          onChange={(e) => setExpertiseInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addExpertise();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" onClick={addExpertise}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.watch("expertise")?.map((item) => (
                          <Badge key={item} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => removeExpertise(item)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <FormDescription>
                        Add technologies, programming languages, or skills you can teach
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Social Links */}
                <FormField
                  control={form.control}
                  name="socialLinks"
                  render={() => (
                    <FormItem>
                      <FormLabel>Social Links (Optional)</FormLabel>
                      <div className="flex gap-2 mb-3">
                        <div className="w-36">
                          <Select value={socialPlatform} onValueChange={(value) => setSocialPlatform(value as SocialPlatform)}>
                            <SelectTrigger className="w-full" name="socialPlatform">
                              <SelectValue placeholder="Platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="twitter">Twitter</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="github">GitHub</SelectItem>
                              <SelectItem value="website">Website</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          name="socialUrl"
                          placeholder="https://yourprofile.com"
                          value={socialUrl}
                          onChange={(e) => setSocialUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSocialLink();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" onClick={addSocialLink}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.watch("socialLinks")?.map((link) => (
                          <Badge key={link.platform} variant="outline" className="flex items-center gap-2">
                            <span className="capitalize">{link.platform}</span>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-muted-foreground hover:text-foreground underline truncate max-w-32"
                            >
                              {link.url.replace(/^https?:\/\//, '')}
                            </a>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => removeSocialLink(link.platform)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <FormDescription>
                        Add your social media profiles and personal website
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mode === 'create' ? 'Create Instructor Profile' : 'Update Profile'}
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