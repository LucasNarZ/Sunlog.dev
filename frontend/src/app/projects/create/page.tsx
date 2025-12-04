'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/apiClient'

const schema = z.object({
    name: z.string().min(3).max(60),
    description: z.string().optional(),
    readme: z.string().optional()
})

export default function CreateProjectPage() {
    const router = useRouter()
    const [form, setForm] = useState({ name: '', description: '', readme: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(e: any) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: any) {
        e.preventDefault()
        const result = schema.safeParse(form)
        if (!result.success) {
            setError('Invalid data')
            return
        }
        setLoading(true)
        setError('')

        try {
            const res = await apiClient.post('projects', result, { withCredentials: true })
            if (res.status === 200) {
                setError('Failed to create project')
                setLoading(false)
                return
            }

            const json = await res.data()
            router.push(`/project/${json.id}`)
        } catch {
            setError('Network error')
        }

        setLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-3xl font-semibold mb-6">Create Project</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    name="name"
                    placeholder="Project name"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="description"
                    placeholder="Small description"
                    value={form.description}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <textarea
                    name="readme"
                    placeholder="Readme (optional)"
                    value={form.readme}
                    onChange={handleChange}
                    className="border p-2 rounded min-h-[150px]"
                />

                {error && <div className="text-red-500">{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </form>
        </div>
    )
}

