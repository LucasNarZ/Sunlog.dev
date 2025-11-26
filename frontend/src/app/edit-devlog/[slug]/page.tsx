"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { useRouter, useParams } from "next/navigation"
import Header from "@components/Header"
import { apiClient } from "@lib/apiClient"
import useAuthor from "@hooks/getAuthor"
import { AxiosError } from "axios"

const generateSlug = (value: string) =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")

function useIsMobile(breakpoint = 728) {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint}px)`)
        const update = () => setIsMobile(mql.matches)
        update()
        mql.addEventListener("change", update)
        return () => mql.removeEventListener("change", update)
    }, [breakpoint])
    return isMobile
}

function EditPostPage() {
    const router = useRouter()
    const { slug } = useParams()
    const [user, error] = useAuthor()
    const [originalSlug, setOriginalSlug] = useState("")
    const [step, setStep] = useState(1)
    const [title, setTitle] = useState("")
    const [slugValue, setSlugValue] = useState("")
    const [slugTouched, setSlugTouched] = useState(false)
    const [previewImgUrl, setPreviewImgUrl] = useState("")
    const [description, setDescription] = useState("")
    const [projects, setProjects] = useState("")
    const [skills, setSkills] = useState("")
    const [category, setCategory] = useState("")
    const [content, setContent] = useState("")
    const [titleError, setTitleError] = useState("")
    const [slugError, setSlugError] = useState("")
    const [urlError, setUrlError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [leftWidth, setLeftWidth] = useState(50)
    const containerRef = useRef(null)
    const isResizingRef = useRef(false)
    const isMobile = useIsMobile()
    const [postId, setPostId] = useState("")

    useEffect(() => {
        if (error) router.push("/sign-in")
    }, [error, router])

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await apiClient.get(`/post/${slug}`)
                const post = response.data
                if (post.userId !== user?.id) router.push("/")
                setPostId(post.id)
                setTitle(post.title)
                setSlugValue(post.slug)
                setOriginalSlug(post.slug)
                setPreviewImgUrl(post.previewImgUrl || "")
                setDescription(post.description || "")
                setProjects(post.projects?.join(", ") || "")
                setSkills(post.skills?.join(", ") || "")
                setCategory(post.category || "")
                setContent(post.content || "")
            } catch {
                router.push("/")
            }
        }
        if (user) fetchPost()
    }, [slug, user, router])

    const validateTitle = (value: string) => {
        if (!value.trim()) return setTitleError("Title is required"), false
        if (value.trim().length < 3) return setTitleError("Title must be at least 3 characters"), false
        setTitleError("")
        return true
    }

    const validateSlug = async (value: string) => {
        const v = value.trim()
        if (!v) return setSlugError("Slug is required"), false
        if (!/^[a-z0-9-_]+$/i.test(v)) return setSlugError("Slug can only contain letters, numbers, hyphens and underscores"), false
        if (v === originalSlug) {
            setSlugError("")
            return true
        }
        try {
            const response = await apiClient.get(`/post/${v}`)
            if (response.status === 200) return setSlugError("Slug already exists"), false
        } catch (err: unknown) {
            if ((err as AxiosError)?.response?.status !== 404) {
                setSlugError("Failed to validate slug")
                return false
            }
        }
        setSlugError("")
        return true
    }

    const validateUrl = (value: string) => {
        if (value && !/^https?:\/\//.test(value)) {
            setUrlError("Image URL must start with http or https")
            return false
        }
        if (!value) {
            setUrlError("")
            return true
        }
        return new Promise<boolean>((resolve) => {
            const img = new Image()
            img.onload = () => {
                setUrlError("")
                resolve(true)
            }
            img.onerror = () => {
                setUrlError("The URL does not point to a valid image")
                resolve(false)
            }
            img.src = value
        })
    }

    const handleNext = async () => {
        const validTitle = validateTitle(title)
        const validSlug = await validateSlug(slugValue)
        const validUrl = validateUrl(previewImgUrl)
        if (validTitle && validSlug && validUrl) setStep(2)
    }

    const handleBack = () => setStep(1)

    const handleSubmit = async () => {
        const validTitle = validateTitle(title)
        const validSlug = await validateSlug(slugValue)
        const validUrl = validateUrl(previewImgUrl)
        if (!validTitle || !validSlug || !validUrl) return
        setIsSubmitting(true)
        const post = {
            title: title.trim(),
            slug: slugValue.trim(),
            previewImgUrl: previewImgUrl.trim() === "" ? undefined : previewImgUrl.trim(),
            description: description.trim(),
            projects: projects.split(",").map((p) => p.trim()).filter((p) => p),
            skills: skills.split(",").map((s) => s.trim()).filter((s) => s),
            category: category.trim() || "General",
            content,
            authorId: user?.id
        }
        try {
            const response = await apiClient.put(`/post/${postId}`, post, {
                withCredentials: true
            })
            if ([200, 201].includes(response.status)) {
                alert("Devlog entry updated successfully!")
                router.push(`/devlog/${post.slug}`)
            } else alert("Failed to update devlog entry. Please try again.")
        } catch {
            alert("An unexpected error occurred.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizingRef.current || !containerRef.current) return
        const rect = (containerRef.current as any).getBoundingClientRect()
        const width = ((e.clientX - rect.left) / rect.width) * 100
        if (width > 20 && width < 80) setLeftWidth(width)
    }

    const stopResizing = () => {
        isResizingRef.current = false
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", stopResizing)
    }

    const startResizing = () => {
        isResizingRef.current = true
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", stopResizing)
    }

    useEffect(() => () => stopResizing(), [])

    return (
        <>
            <Header />
            <div className="sm:p-8 h-screen flex items-center justify-center bg-background">
                {step === 1 && (
                    <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-10">
                        <div className="flex flex-col space-y-2">
                            <h1 className="text-4xl font-bold select-none text-primary mb-6">
                                Edit Devlog Entry
                            </h1>
                            <input
                                title="Title of your devlog entry"
                                type="text"
                                placeholder="Entry title"
                                value={title}
                                onChange={(e) => {
                                    const val = e.target.value
                                    setTitle(val)
                                    if (!slugTouched) setSlugValue(generateSlug(val))
                                    if (titleError) validateTitle(val)
                                }}
                                className={`p-4 border rounded-xl text-lg font-semibold shadow-md focus:outline-none focus:ring-2 transition ${titleError ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"}`}
                            />
                            {titleError && <p className="text-danger text-sm mb-2">{titleError}</p>}
                            <input
                                title="Slug will be part of the URL"
                                type="text"
                                placeholder="Slug (url-friendly)"
                                value={slugValue}
                                onBlur={(e) => validateSlug(e.target.value)}
                                onChange={(e) => {
                                    setSlugValue(e.target.value)
                                    setSlugTouched(true)
                                }}
                                className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${slugError ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"}`}
                            />
                            {slugError && <p className="text-danger text-sm mb-2">{slugError}</p>}
                            <input
                                title="Preview image URL"
                                type="text"
                                placeholder="Preview image URL"
                                value={previewImgUrl}
                                onChange={(e) => {
                                    setPreviewImgUrl(e.target.value)
                                    if (urlError) validateUrl(e.target.value)
                                }}
                                className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${urlError ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"}`}
                            />
                            {urlError && <p className="text-danger text-sm mb-2">{urlError}</p>}
                            <input
                                title="Associated projects"
                                type="text"
                                placeholder="Projects"
                                value={projects}
                                onChange={(e) => setProjects(e.target.value)}
                                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                            <input
                                title="Skills related to this entry"
                                type="text"
                                placeholder="Skills"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                            <input
                                title="Entry category"
                                type="text"
                                placeholder="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                            <textarea
                                title="Short summary for the entry"
                                placeholder="Short description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="p-3 border rounded-lg resize-none h-28 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                            <button
                                onClick={handleNext}
                                disabled={!!titleError || !!slugError || !!urlError}
                                className={`cursor-pointer self-end rounded-2xl font-bold shadow-lg px-8 py-3 text-white transition duration-500 ${!!titleError || !!slugError || !!urlError
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-primary hover:bg-secondary"
                                    }`}
                            >
                                Next: Edit Content
                            </button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="bg-white rounded-xl shadow-2xl w-screen sm:w-[90vw] h-[90vh] p-6 flex flex-col">
                        <div
                            ref={containerRef}
                            className="flex-1 w-full flex flex-col sm:flex-row relative overflow-hidden rounded-xl border border-gray-300"
                        >
                            <div
                                className="sm:h-full h-1/2 flex flex-col"
                                style={{ width: isMobile ? "100%" : `${leftWidth}%` }}
                            >
                                <div className="bg-gray-100 p-2 text-sm font-semibold text-muted border-b">
                                    Markdown
                                </div>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your devlog entry content in Markdown..."
                                    className="w-full h-full p-4 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                    spellCheck={false}
                                />
                            </div>
                            <div
                                onMouseDown={startResizing}
                                className="w-0 sm:w-2 bg-gray-300 cursor-col-resize hover:bg-primary transition duration-300"
                            />
                            <div
                                className="flex-1 flex flex-col sm:h-full h-1/2"
                                style={{ width: isMobile ? "100%" : `${100 - leftWidth}%` }}
                            >
                                <div className="bg-gray-100 p-2 text-sm font-semibold text-muted border-b">
                                    Preview
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 prose max-w-none break-words">
                                    {previewImgUrl && (
                                        <img
                                            src={previewImgUrl}
                                            alt="Preview"
                                            className="mb-8 max-h-96 w-full object-contain rounded-lg shadow-lg"
                                            onError={(e) => (e.currentTarget.style.display = "none")}
                                        />
                                    )}
                                    <ReactMarkdown>{`# ${title}\n\n${content}`}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between flex-col sm:flex-row sm:gap-0 gap-3">
                            <button
                                onClick={handleBack}
                                className="cursor-pointer rounded-xl px-8 py-3 font-semibold shadow-md transition bg-muted text-white hover:bg-gray-600"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`cursor-pointer rounded-xl px-8 py-3 font-bold shadow-lg transition text-white ${isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-primary hover:bg-secondary"
                                    }`}
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default EditPostPage

