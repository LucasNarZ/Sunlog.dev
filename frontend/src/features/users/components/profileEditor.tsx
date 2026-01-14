type ProfileEditorProps = {
  user: any;
  editedName: string;
  editedBio: string;
  editedProfileImgUrl: string;
  previewImgUrl: string;
  isSaving: boolean;
  nameError: string;
  urlError: string;
  saveError: string | null;
  onChangeName: (v: string) => void;
  onChangeBio: (v: string) => void;
  onChangeImgUrl: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export const ProfileEditor = ({
  editedName,
  editedBio,
  editedProfileImgUrl,
  previewImgUrl,
  isSaving,
  nameError,
  urlError,
  saveError,
  onChangeName,
  onChangeBio,
  onChangeImgUrl,
  onSave,
  onCancel,
}: ProfileEditorProps) => (
  <div className="flex flex-col gap-3">
    <input
      className={`border px-3 py-2 rounded w-full md:w-96 focus:outline-none ${nameError ? "border-red-500" : "border-gray-300"}`}
      value={editedName}
      onChange={(e) => onChangeName(e.target.value)}
      disabled={isSaving}
      placeholder="Name"
    />
    {nameError && <p className="text-sm text-red-600 mt-1">{nameError}</p>}

    <input
      type="text"
      className={`border px-3 py-2 rounded w-full md:w-96 focus:outline-none ${urlError ? "border-red-500" : "border-gray-300"}`}
      value={editedProfileImgUrl}
      onChange={(e) => onChangeImgUrl(e.target.value)}
      placeholder="Profile image URL"
      disabled={isSaving}
    />
    {urlError && <p className="text-sm text-red-600 mt-1">{urlError}</p>}

    <textarea
      className="border px-3 py-2 rounded w-full md:w-96 min-h-[100px] focus:outline-none border-gray-300"
      value={editedBio}
      onChange={(e) => onChangeBio(e.target.value)}
      placeholder="Tell us about yourself..."
      disabled={isSaving}
    />

    {saveError && <p className="text-red-600">{saveError}</p>}

    <div className="flex gap-3 mt-3">
      <button
        onClick={onSave}
        className="cursor-pointer px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
      <button
        onClick={onCancel}
        className="cursor-pointer px-5 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
        disabled={isSaving}
      >
        Cancel
      </button>
    </div>
  </div>
);
