'use client';

import { useState, useEffect } from 'react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import Header from '@components/Header';
import { apiClient } from '@lib/apiClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    createDevlogSchema,
    CreateDevlogDTO,
} from '@/features/devlogs/schemas/createDevlog.schema';
import useUserProfile from '@/features/users/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import useUserProjects from '@/features/users/hooks/useUserProjects';

function CreateDevlogEventPage() {
    const router = useRouter();
    const [user, error] = useUserProfile();
    const [projects] = useUserProjects(user?.id);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreateDevlogDTO>({
        resolver: zodResolver(createDevlogSchema()),
        mode: 'onTouched',
        defaultValues: {
            summary: '',
            projectId: '',
            content: '',
        },
    });

    useEffect(() => {
        if (error) router.push('/sign-in');
    }, [error, router]);

    const onSubmit = async (data: CreateDevlogDTO) => {
        const post = {
            summary: data.summary.trim(),
            description: data?.description?.trim(),
            projectId: data.projectId,
            content: data?.content,
            authorId: user?.id,
        };
        const response = await apiClient.post('/devlogEvents', post, {
            withCredentials: true,
        });
        if ([200, 201].includes(response.status)) {
            router.push(`/${user?.name}`);
        }
    };

    return (
        <>
            <Header />

            <div className="min-h-screen bg-background pt-24 pb-24 px-4 sm:px-8">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="max-w-5xl mx-auto w-full"
                >
                    <div className="bg-white rounded-xl shadow-2xl w-full p-10 space-y-4 flex flex-col">
                        <h1 className="text-4xl font-bold select-none text-primary mb-6">
                            New Devlog Entry
                        </h1>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-600">
                                Summary <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter the title"
                                {...register('summary')}
                                className={`p-4 border rounded-xl text-lg font-semibold shadow-md focus:outline-none focus:ring-2 transition ${errors.summary ? 'border-danger focus:ring-danger' : 'border-secondary focus:ring-primary'}`}
                            />
                            {errors.summary && (
                                <p className="text-danger text-sm">
                                    {errors.summary.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-600">
                                Project <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('projectId')}
                                className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${errors.projectId ? 'border-danger focus:ring-danger' : 'border-secondary focus:ring-primary'}`}
                            >
                                <option value="">Select a project</option>
                                {projects?.map((project: any) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name.split('/').pop()}
                                    </option>
                                ))}
                            </select>
                            {errors.projectId && (
                                <p className="text-danger text-sm">
                                    {errors.projectId.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-600">
                                Short description{' '}
                                <span className="text-gray-400 text-xs">
                                    (optional)
                                </span>
                            </label>
                            <textarea
                                placeholder="Write a short description…"
                                {...register('description')}
                                className="p-3 border rounded-lg resize-none h-28 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-600">
                                Content{' '}
                                <span className="text-gray-400 text-xs">
                                    (optional)
                                </span>
                            </label>
                            <MarkdownEditor
                                register={register}
                                errors={errors}
                                watch={watch}
                            />
                        </div>

                        <div className="mt-6 flex justify-between flex-col sm:flex-row gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`cursor-pointer rounded-xl px-8 py-3 font-bold shadow-lg transition text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-secondary'}`}
                            >
                                {isSubmitting ? 'Saving...' : 'Save devlog'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateDevlogEventPage;
