"use client";

import Header from "@/components/Header";
import { Post } from "@/features/devlogs/types/post";
import useDevlogEventsByAuthor from "@/features/users/hooks/useDevlogEventsByAuthor";
import useUserProfile from "@/features/users/hooks/useUserProfile";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { DevlogEventsList } from '@/features/users/components/devlogEventsList'
import { useEffect, useState } from 'react'
import { ProfileEditor } from "@/features/users/components/profileEditor";
import { ConfirmModal } from "@/features/users/components/confirmModal";

const Profile = () => {
    const router = useRouter();
    const [user, errorUser] = useUserProfile();
    const [devlogEvents] = useDevlogEventsByAuthor(user?.id);

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedBio, setEditedBio] = useState("");
    const [editedProfileImgUrl, setEditedProfileImgUrl] = useState("");
    const [previewImgUrl, setPreviewImgUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [nameError, setNameError] = useState("");
    const [urlError, setUrlError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);

    useEffect(() => {
        if (errorUser) router.push("/sign-in");
    }, [errorUser, router]);

    useEffect(() => {
        setEditedName(user?.name ?? "");
        setEditedBio(user?.bio ?? "");
        setEditedProfileImgUrl(user?.profileImgUrl ?? "");
        setPreviewImgUrl(user?.profileImgUrl ?? "");
    }, [user]);

    const toggleEdit = () => setIsEditing((v) => !v);

    const handleSave = async () => {
        if (!editedName.trim() || editedName.trim().length < 3) return setNameError("Name must be at least 3 characters.");
        if (editedProfileImgUrl && !/^https?:\/\//.test(editedProfileImgUrl)) return setUrlError("Image URL must start with http or https.");
        setIsSaving(true);
        setSaveError(null);
        try {
            const updatedUser = { name: editedName, bio: editedBio, profileImgUrl: editedProfileImgUrl };
            console.log(updatedUser)
            const res = await apiClient.put("/user/update", updatedUser, { withCredentials: true });
            if (res.status === 200) window.location.reload();
            else setSaveError("Failed to update profile. Please try again.");
        } catch (err) {
            console.error(err);
            setSaveError("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeletePost = async () => {
        if (!postToDelete) return;
        try {
            const res = await apiClient.delete(`/devlogEvents/${postToDelete.id}`);
            if (res.status === 200) {
                window.location.reload();
            }
        } catch (err) { console.error(err); }
        setShowModal(false);
        setPostToDelete(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center w-full">
            <Header />
            <div className="w-full max-w-5xl mt-12 mb-12 px-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-6">
                    <div className="w-32 h-32 rounded-full shadow-md overflow-hidden">
                        <img className="object-cover w-full h-full" src={previewImgUrl || "https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png"} alt="Profile" />
                    </div>

                    <div className="text-center md:text-left w-80">
                        {isEditing ? (
                            <ProfileEditor
                                user={user}
                                editedName={editedName}
                                editedBio={editedBio}
                                editedProfileImgUrl={editedProfileImgUrl}
                                previewImgUrl={previewImgUrl}
                                isSaving={isSaving}
                                nameError={nameError}
                                urlError={urlError}
                                saveError={saveError}
                                onChangeName={setEditedName}
                                onChangeBio={setEditedBio}
                                onChangeImgUrl={(v) => { setEditedProfileImgUrl(v); setPreviewImgUrl(v); }}
                                onSave={handleSave}
                                onCancel={toggleEdit}
                            />
                        ) : (
                            <>
                                <h2 className="text-3xl font-semibold">{user?.name}</h2>
                                <p className="text-gray-600">{user?.email}</p>
                                <p className="text-sm text-gray-500 mt-2">{user?.followersNumber} follower{user?.followersNumber === 1 ? "" : "s"}</p>
                                <p className="text-gray-700 mt-3 italic max-w-xl whitespace-pre-line">{user?.bio?.trim() || "No bio provided yet."}</p>
                                <div className="flex gap-7 mt-4">
                                    <button onClick={toggleEdit} className="cursor-pointer px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Edit Profile</button>
                                    <button onClick={() => router.push("/create-devlog")} className="cursor-pointer px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Create Devlog Entry</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-6 text-gray-800">Your Devlog Entries</h3>
                <DevlogEventsList devlogEvents={devlogEvents || []} onDeleteClick={(p) => { setPostToDelete(p); setShowModal(true); }} />
            </div>

            {showModal && postToDelete && (
                <ConfirmModal
                    title="Delete this entry?"
                    description="This action cannot be undone."
                    onConfirm={handleDeletePost}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default Profile
