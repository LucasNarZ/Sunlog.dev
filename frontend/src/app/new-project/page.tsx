'use client'

import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/apiClient'
import { MarkdownEditor } from '@/components/MarkdownEditor'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useUserProfile from '@/features/users/hooks/useUserProfile'
import Header from '@/components/Header'

const Schema = z.object({
    name: z.string()
        .min(3)
        .max(60)
        .regex(/^[^/]+$/, "Name cannot contain '/'"),
    description: z.string().optional(),
    content: z.string().optional()
})


export type CreateProjectDTO = z.infer<typeof Schema>;

export default function CreateProjectPage() {
    const router = useRouter()
    const [user, error] = useUserProfile()

    if (error) {
        router.push('/sign-in')
    }

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateProjectDTO>({
        resolver: zodResolver(Schema)
    });

    async function onSubmit(data: CreateProjectDTO) {
        try {
            const project = {
                ...data,
                readme: data.content,
                name: data.name,
            }
            const res = await apiClient.post('projects', project, { withCredentials: true })

            if(res.status === 201){
                router.push(`/${project.name}`)
            }

        } catch {
        }
    }

    return (
        <>
            <Header />
            <div className="w-screen mx-auto mt-10 min-h-screen flex flex-col items-center">
                <h1 className="text-3xl font-semibold mb-6">Create Project</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 min-w-2xs w-4/5">
                    <input
                        placeholder="Project name"
                        {...register("name")}
                        className="border p-2 rounded"
                    />

                    <input
                        placeholder="Small description"
                        {...register("description")}
                        className="border p-2 rounded"
                    />


                    <MarkdownEditor register={register} watch={watch} errors={errors} />

                    {errors && <div className="text-red-500">{errors?.name?.message}</div>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-5 cursor-pointer"
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>
                </form>
            </div>
        </>
    )
}

