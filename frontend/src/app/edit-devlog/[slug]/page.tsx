"use client";

import { useState, useEffect, memo } from "react";
import ReactMarkdown from "react-markdown";
import Header from "@components/Header";
import { apiClient } from "@lib/apiClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useIsMobile } from "@/features/devlogs/hooks/useIsMobile";
import { useResizableWidth } from "@/features/devlogs/hooks/useResizableWidth";
import useUserProfile from "@/features/users/hooks/useUserProfile";
import { fetchDevlog } from "@/features/devlogs/services/fetchDevlog";
import { CreateDevlogDTO, createDevlogSchema } from "@/features/devlogs/schemas/createDevlog.schema";

function parseList(value?: string) {
  return value?.split(",").map(v => v.trim()).filter(Boolean) ?? []
}

function EditPostPage() {
  const router = useRouter()
  const { slug } = useParams()
  const [user] = useUserProfile()
  const [step, setStep] = useState(1)
  const isMobile = useIsMobile()
  const { width: leftWidth, containerRef, startResizing } = useResizableWidth(50)
  const [postId, setPostId] = useState<string | null>(null)
  const [originalSlug, setOriginalSlug] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateDevlogDTO>({
    resolver: zodResolver(createDevlogSchema(originalSlug)),
    mode: "onTouched",
    defaultValues: {
      title: "",
      slug: "",
      content: "Start editing your devlog here...",
    }
  })

  const watchedTitle = watch("title")
  const watchedContent = watch("content")
  const watchedPreviewImgUrl = watch("previewImgUrl")

  const Preview = memo(({ title, content }: { title: string; content: string }) => (
    <ReactMarkdown>{`# ${title}\n\n${content}`}</ReactMarkdown>
  ))

  useEffect(() => {
    if (!user) return
    const fetchPost = async () => {
      try {
        const post = await fetchDevlog(typeof slug === "string" ? slug : "")
        if (post.userId !== user.id) router.push("/")
        setPostId(post.id)
        setOriginalSlug(post.slug)
        reset({
          title: post.title,
          slug: post.slug,
          previewImgUrl: post.previewImgUrl ?? "",
          description: post.description ?? "",
          projects: post.projects?.join(", ") ?? "",
          skills: post.skills?.join(", ") ?? "",
          category: post.category ?? "",
          content: post.content ?? "",
        })
      } catch {
        router.push("/")
      }
    }
    fetchPost()
  }, [slug, user, reset, router])

  useEffect(() => {
    const generatedSlug = watchedTitle
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    setValue("slug", generatedSlug)
  }, [watchedTitle, setValue])

  const handleNext = async () => {
    const valid = await trigger(["title", "slug", "previewImgUrl"])
    if (valid) setStep(2)
  }

  const handleBack = () => setStep(1)

  const onSubmit = async (data: CreateDevlogDTO) => {
    if (!postId) return
    const post = {
      title: data.title.trim(),
      slug: data.slug.trim(),
      previewImgUrl: data.previewImgUrl?.trim() || undefined,
      description: data.description?.trim(),
      projects: parseList(data.projects),
      skills: parseList(data.skills),
      category: data.category?.trim() || "General",
      content: data.content,
      authorId: user?.id
    }
    try {
      const response = await apiClient.put(`/devlogEvents/${postId}`, post, { withCredentials: true })
      if ([200, 201].includes(response.status)) router.push(`/devlog/${data.slug}`)
      else alert("Failed to update devlog. Please try again.")
    } catch {
      alert("Unexpected error occurred.")
    }
  }

  return (
    <>
      <Header />
      <div className="sm:p-8 h-screen flex items-center justify-center bg-background">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex justify-center">
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-10 space-y-4 flex flex-col">
              <h1 className="text-4xl font-bold select-none text-primary mb-6">Edit Devlog Entry</h1>
              <input type="text" placeholder="Entry title" {...register("title")} className={`p-4 border rounded-xl text-lg font-semibold shadow-md focus:outline-none focus:ring-2 transition ${errors.title ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"}`} />
              {errors.title && <p className="text-danger text-sm">{errors.title.message}</p>}
              <input type="text" placeholder="Slug" {...register("slug")} className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${errors.slug ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"}`} />
              {errors.slug && <p className="text-danger text-sm">{errors.slug.message}</p>}
              <input type="text" placeholder="Preview image URL" {...register("previewImgUrl")} className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${errors.previewImgUrl ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"}`} />
              {errors.previewImgUrl && <p className="text-danger text-sm">{errors.previewImgUrl.message}</p>}
              <input type="text" placeholder="Projects" {...register("projects")} className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition" />
              <input type="text" placeholder="Skills" {...register("skills")} className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition" />
              <input type="text" placeholder="Category" {...register("category")} className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition" />
              <textarea placeholder="Short description..." {...register("description")} className="p-3 border rounded-lg resize-none h-28 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition" />
              <button type="button" onClick={handleNext} className="cursor-pointer self-end rounded-2xl font-bold shadow-lg px-8 py-3 text-white transition bg-primary hover:bg-secondary">Next: Edit Content</button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-2xl w-screen sm:w-[90vw] h-[90vh] p-6 flex flex-col">
              <div ref={containerRef} className="flex-1 w-full flex flex-col sm:flex-row relative overflow-hidden rounded-xl border border-gray-300">
                <div className="sm:h-full h-1/2 flex flex-col" style={{ width: isMobile ? "100%" : `${leftWidth}%` }}>
                  <div className="bg-gray-100 p-2 text-sm font-semibold text-muted border-b">Markdown</div>
                  <textarea placeholder="Edit your devlog content..." {...register("content")} className="w-full h-full p-4 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary" spellCheck={false} />
                  {errors.content && <p className="text-danger text-sm p-2">{errors.content.message}</p>}
                </div>

                <div onMouseDown={startResizing} className="w-0 sm:w-2 bg-gray-300 cursor-col-resize hover:bg-primary transition duration-300" />

                <div className="flex-1 flex flex-col sm:h-full h-1/2" style={{ width: isMobile ? "100%" : `${100 - leftWidth}%` }}>
                  <div className="bg-gray-100 p-2 text-sm font-semibold text-muted border-b">Preview</div>
                  <div className="flex-1 overflow-y-auto p-6 prose max-w-none break-words">
                    {watchedPreviewImgUrl && <img src={watchedPreviewImgUrl} alt="" className="mb-8 max-h-96 w-full object-contain rounded-lg shadow-lg" onError={e => (e.currentTarget.style.display = "none")} />}
                    <Preview title={watchedTitle} content={watchedContent} />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between flex-col sm:flex-row gap-3">
                <button type="button" onClick={handleBack} className="cursor-pointer rounded-xl px-8 py-3 font-semibold shadow-md transition bg-muted text-white hover:bg-gray-600">Back</button>
                <button type="submit" disabled={isSubmitting} className={`cursor-pointer rounded-xl px-8 py-3 font-bold shadow-lg transition text-white ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-secondary"}`}>{isSubmitting ? "Saving..." : "Save Changes"}</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  )
}

export default EditPostPage
