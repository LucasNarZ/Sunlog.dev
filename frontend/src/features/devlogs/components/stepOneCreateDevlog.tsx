const StepOneCreateDevlog = ({errors}:) => {
    return (
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-10">
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl font-bold select-none text-primary mb-6">
                Devlog Entry Metadata
              </h1>
              <input
                title="Title of your devlog entry (minimum 3 characters)"
                type="text"
                placeholder="Entry title"
                value={title}
                onChange={(e) => {
                  const val = e.target.value;
                  setTitle(val);
                  if (!slugTouched) setSlug(generateSlug(val));
                }}
                className={`p-4 border rounded-xl text-lg font-semibold shadow-md focus:outline-none focus:ring-2 transition ${errors.title ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"}`}
              />
              {errors.title && (
                <p className="text-danger text-sm mb-2">{errors.title}</p>
              )}
              <input
                title="Slug will be part of the URL (e.g. my-entry-title)"
                type="text"
                placeholder="Slug (url-friendly)"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${errors.slug ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"}`}
              />
              {errors.slug && (
                <p className="text-danger text-sm mb-2">{errors.slug}</p>
              )}
              <input
                title="Preview image URL (optional, for homepage preview)"
                type="text"
                placeholder="Preview image URL"
                value={previewImgUrl}
                onChange={(e) => {
                  setPreviewImgUrl(e.target.value);
                }}
                className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${errors.previewImgUrl ? "border-danger focus:ring-danger" : "border-secondary focus:ring-primary"}`}
              />
              {errors.previewImgUrl && (
                <p className="text-danger text-sm mb-2">{errors.previewImgUrl}</p>
              )}
              <input
                title="Associated projects (comma-separated)"
                type="text"
                placeholder="Projects (e.g. Sunlog, Portfolio)"
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <input
                title="Skills related to this entry (comma-separated)"
                type="text"
                placeholder="Skills (e.g. React, TypeScript)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <input
                title="Entry category (e.g. Programming, Design)"
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
                className={`cursor-pointer self-end rounded-2xl font-bold shadow-lg px-8 py-3 text-white transition duration-500 bg-primary hover:bg-secondary"
                }`}
              >
                Next: Write Devlog Entry
              </button>
            </div>
          </div>
    )
}