"use client";

import { useState, useRef, useEffect, memo } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import Header from "@components/Header";
import { apiClient } from "@lib/apiClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDevlogSchema, CreateDevlogDTO } from "@/features/devlogs/schemas/createDevlog.schema";
import useUserProfile from "@/features/users/hooks/useUserProfile";
import { useRouter } from "next/navigation";

function parseList(value?: string) {
    return value?.split(",").map(v => v.trim()).filter(Boolean) ?? [];
}


function CreatePostPage() {
    const router = useRouter()
    const [user, error] = useUserProfile();
    const [step, setStep] = useState(1);
    const {
        register,
        handleSubmit,
        watch,
        trigger,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreateDevlogDTO>({
        resolver: zodResolver(createDevlogSchema("")),
        mode: "onTouched",
        defaultValues: {
            title: "",
            slug: "",
            content: "Welcome to your new devlog entry! Use **Markdown** to write notes, ideas or code snippets.\n- Document what you learn\n- Track your progress\n- Share your journey\n- ![Example Image](https://placehold.co/600x400)"
        }
    });

    const watchedTitle = watch("title");

    useEffect(() => {
        const generatedSlug = watchedTitle
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        setValue("slug", generatedSlug);
    }, [watchedTitle, setValue]);

    useEffect(() => {
        if (error) router.push("/sign-in");
    }, [error, router]);

    const handleNext = async () => {
        const valid = await trigger(["title", "slug", "previewImgUrl"]);
        if (valid) setStep(2);
    };

    const handleBack = () => setStep(1);

    const onSubmit = async (data: CreateDevlogDTO) => {
        const post = {
            title: data.title.trim(),
            slug: data.slug.trim(),
            previewImgUrl:
                data?.previewImgUrl?.trim() === "" ? undefined : data?.previewImgUrl?.trim(),
            description: data?.description?.trim(),
            projects: parseList(data?.projects),
            skills: parseList(data?.skills),
            category: data?.category?.trim() || "General",
            content: data.content,
            authorId: user?.id,
        };
        const response = await apiClient.post("/devlogEvents", post, { withCredentials: true });
        if ([200, 201].includes(response.status)) {
            router.push(`/devlog/${data.slug}`);
        }
    };

    return (
        <>
            <Header />
            <div className="sm:p-8 h-screen flex items-center justify-center bg-background">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex justify-center">
                    {step === 1 && (
                        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-10 space-y-4 flex flex-col">
                            <h1 className="text-4xl font-bold select-none text-primary mb-6">Devlog Entry Metadata</h1>
                            <input
                                type="text"
                                placeholder="Entry title"
                                {...register("title")}
                                className={`p-4 border rounded-xl text-lg font-semibold shadow-md focus:outline-none focus:ring-2 transition ${errors.title ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"
                                    }`}
                            />
                            {errors.title && <p className="text-danger text-sm">{errors.title.message}</p>}
                            <input
                                type="text"
                                placeholder="Slug"
                                {...register("slug")}
                                className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${errors.slug ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"
                                    }`}
                            />
                            {errors.slug && <p className="text-danger text-sm">{errors.slug.message}</p>}
                            <input
                                type="text"
                                placeholder="Preview image URL"
                                {...register("previewImgUrl")}
                                className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${errors.previewImgUrl ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"
                                    }`}
                            />
                            {errors.previewImgUrl && <p className="text-danger text-sm">{errors.previewImgUrl.message}</p>}
                            <input
                                type="text"
                                placeholder="Projects"
                                {...register("projects")}
                                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                            <input
                                type="text"
                                placeholder="Skills"
                                {...register("skills")}
                                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                {...register("category")}
                                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                            <textarea
                                placeholder="Short description..."
                                {...register("description")}
                                className="p-3 border rounded-lg resize-none h-28 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                            <button
                                type="button"
                                onClick={handleNext}
                                className="cursor-pointer self-end rounded-2xl font-bold shadow-lg px-8 py-3 text-white transition bg-primary hover:bg-secondary"
                            >
                                Next: Write Devlog Entry
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white rounded-xl shadow-2xl w-screen sm:w-[90vw] h-[90vh] p-6 flex flex-col">

                            <MarkdownEditor register={register} errors={errors} watch={watch} />
                            <div className="mt-6 flex justify-between flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="cursor-pointer rounded-xl px-8 py-3 font-semibold shadow-md transition bg-muted text-white hover:bg-gray-600"
                                >
                                    Back
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`cursor-pointer rounded-xl px-8 py-3 font-bold shadow-lg transition text-white ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-secondary"
                                        }`}
                                >
                                    {isSubmitting ? "Saving..." : "Save Devlog Entry"}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}

export default CreatePostPage;

