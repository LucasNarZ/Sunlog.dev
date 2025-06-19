import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { apiClient } from "../apiClient";
import useAuthor from "../hooks/getAuthor";

function CreatePostPage() {
  const navigate = useNavigate();

  const [ user, error ] = useAuthor();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [previewImgUrl, setPreviewImgUrl] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState(
    `Welcome to your new post! This is **Markdown**.
    - You can write text
    - Add _formatting_
    - And preview it live!
    - ![Example Image](https://placehold.co/600x400)`
  );

  const [titleError, setTitleError] = useState("");
  const [slugError, setSlugError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [leftWidth, setLeftWidth] = useState(50); 
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);

  useEffect(() => {
    if (error) navigate("/signIn");
  }, [error, navigate]);

  // Validação título
  const validateTitle = (value: string) => {
    if (!value.trim()) {
      setTitleError("Title is required");
      return false;
    }
    if (value.trim().length < 3) {
      setTitleError("Title must be at least 3 characters");
      return false;
    }
    setTitleError("");
    return true;
  };


  const validateSlug = (value: string) => {
    if (!value.trim()) {
      setSlugError("Slug is required");
      return false;
    }
    const slugRegex = /^[a-z0-9-_]+$/i;
    if (!slugRegex.test(value.trim())) {
      setSlugError("Slug can only contain letters, numbers, hyphens and underscores");
      return false;
    }
    setSlugError("");
    return true;
  };


  const validateUrl = (value: string) => {
    if (value && !/^https?:\/\//.test(value)) {
      setUrlError("Image URL must start with http or https");
      return false;
    }
    setUrlError("");
    return true;
  };

  const handleNext = () => {
    const validTitle = validateTitle(title);
    const validSlug = validateSlug(slug);
    const validUrl = validateUrl(previewImgUrl);
    if (validTitle && validSlug && validUrl) setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async () => {

    const validTitle = validateTitle(title);
    const validSlug = validateSlug(slug);
    const validUrl = validateUrl(previewImgUrl);

    if (!validTitle || !validSlug || !validUrl) return;

    setIsSubmitting(true);

    const post = {
      title: title.trim(),
      slug: slug.trim(),
      previewImgUrl: previewImgUrl.trim(),
      description: description.trim(),
      content: `${content}`,
      authorId: user?.id
    };
    console.log(post)
    try {
      const response = await apiClient.post("/post", post, {
        withCredentials: true,
      });

      if (response.status === 201 || response.status === 200) {
        alert("Post created successfully!");
        navigate(`/post/${post.slug}`); 
      } else {
        alert("Failed to create post. Please try again.");
      }
    } catch (error: any) {
      console.error("Error submitting post:", error);
      alert(error?.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    if (newLeftWidth > 20 && newLeftWidth < 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const stopResizing = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
  };

  const startResizing = () => {
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  return (
    <>
      <Header />
      <div className="p-8 h-screen flex items-center justify-center bg-background">
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-10">
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl font-bold select-none text-primary mb-6">Post Metadata</h1>
              <input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) validateTitle(e.target.value);
                }}
                className={`p-4 border rounded-xl text-lg font-semibold shadow-md focus:outline-none focus:ring-2 transition ${
                  titleError ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"
                }`}
              />
              {titleError && <p className="text-danger text-sm mb-2">{titleError}</p>}
              <input
                type="text"
                placeholder="Slug (url-friendly)"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  if (slugError) validateSlug(e.target.value);
                }}
                className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                  slugError ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"
                }`}
              />
              {slugError && <p className="text-danger text-sm mb-2">{slugError}</p>}
              <input
                type="text"
                placeholder="Preview image URL"
                value={previewImgUrl}
                onChange={(e) => {
                  setPreviewImgUrl(e.target.value);
                  if (urlError) validateUrl(e.target.value);
                }}
                className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                  urlError ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"
                }`}
              />
              {urlError && <p className="text-danger text-sm mb-2">{urlError}</p>}
              <textarea
                placeholder="Short description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-3 border rounded-lg resize-none h-28 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <button
                onClick={handleNext}
                disabled={!!titleError || !!slugError || !!urlError}
                className={`cursor-pointer self-end rounded-2xl font-bold shadow-lg px-8 py-3 text-white transition duration-500 ${
                  !!titleError || !!slugError || !!urlError
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-secondary"
                }`}
              >
                Next: Write Content
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl shadow-2xl w-full h-[90vh] p-6 flex flex-col">
            <div
              ref={containerRef}
              className="flex-1 w-full flex relative overflow-hidden rounded-xl border border-gray-300"
            >
              <div className="h-full flex flex-col" style={{ width: `${leftWidth}%` }}>
                <div className="bg-gray-100 p-2 text-sm font-semibold text-muted border-b">Markdown</div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content in Markdown..."
                  className="w-full h-full p-4 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  spellCheck={false}
                />
              </div>
              <div
                onMouseDown={startResizing}
                className="w-2 bg-gray-300 cursor-col-resize hover:bg-primary transition duration-300"
              />
              <div className="flex-1 flex flex-col h-full">
                <div className="bg-gray-100 p-2 text-sm font-semibold text-muted border-b">Preview</div>
                <div className="flex-1 overflow-y-auto p-6 prose max-w-none">
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
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleBack}
                className="cursor-pointer rounded-xl px-8 py-3 font-semibold shadow-md transition bg-muted text-white hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`cursor-pointer rounded-xl px-8 py-3 font-bold shadow-lg transition text-white ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-secondary"
                }`}
              >
                {isSubmitting ? "Saving..." : "Save Post"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CreatePostPage;
