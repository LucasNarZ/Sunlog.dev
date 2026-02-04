'use client';

import Header from '@/components/Header';
import useUserProfile from '@/features/users/hooks/useUserProfile';
import { apiClient } from '@/lib/apiClient';
import { redirect, useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ProfileEditor } from '@/features/users/components/profileEditor';
import { ConfirmModal } from '@/features/users/components/confirmModal';
import Link from 'next/link';
import { DevlogCard } from '@/features/devlogs/components/DevlogCard';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { Project } from '@/features/projects/types/project';
import { Devlog } from '@/features/devlogs/types/devlog';
import useMe from '@/features/users/hooks/useMe';

const User = () => {
    const router = useRouter();
    const params = useParams();
    const slug = params?.username as string;
    const [user, errorUser, loading] = useUserProfile(slug);
    const [me, errorMe, loadingMe] = useMe();

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedBio, setEditedBio] = useState('');
    const [editedProfileImgUrl, setEditedProfileImgUrl] = useState('');
    const [previewImgUrl, setPreviewImgUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [nameError, setNameError] = useState('');
    const [urlError, setUrlError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Devlog | null>(null);

    useEffect(() => {
        if (errorUser) redirect("/not-found")
    }, [errorUser, router]);

    useEffect(() => {
        if (!user) return;
        setEditedName(user.name ?? '');
        setEditedBio(user.bio ?? '');
        setEditedProfileImgUrl(user.profileImgUrl ?? '');
        setPreviewImgUrl(user.profileImgUrl ?? '');
    }, [user]);


    const followerLabel = useMemo(() => {
        const n = user?.followersNumber ?? 0;
        return `${n} follower${n === 1 ? '' : 's'}`;
    }, [user?.followersNumber]);

    const toggleEdit = () => setIsEditing((v) => !v);

    const handleSave = async () => {
        if (!editedName.trim() || editedName.trim().length < 3) {
            setNameError('Name must be at least 3 characters.');
            return;
        }

        if (editedProfileImgUrl && !/^https?:\/\//.test(editedProfileImgUrl)) {
            setUrlError('Image URL must start with http or https.');
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        setNameError('');
        setUrlError('');

        try {
            const res = await apiClient.put(
                '/users/me',
                {
                    name: editedName,
                    bio: editedBio,
                    profileImgUrl: editedProfileImgUrl,
                },
                { withCredentials: true },
            );

            if (res.status === 200) {
                window.location.reload();
                return;
            }

            setSaveError('Failed to update profile. Please try again.');
        } catch {
            setSaveError('An error occurred while saving.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeletePost = async () => {
        if (!postToDelete) return;

        try {
            const res = await apiClient.delete(
                `/devlogEvents/${postToDelete.id}`,
            );
            if (res.status === 200) {
                window.location.reload();
            }
        } catch {
        } finally {
            setShowModal(false);
            setPostToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center w-full">
            <Header />

            <div className="w-full max-w-5xl mt-12 mb-12 px-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-10">
                    <div className="w-32 h-32 rounded-full shadow-md overflow-hidden bg-white">
                        <img
                            className="object-cover w-full h-full"
                            src={
                                previewImgUrl ||
                                'https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png'
                            }
                            alt="Profile"
                        />
                    </div>

                    {me?.id === user?.id ?
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
                                    onChangeImgUrl={(v) => {
                                        setEditedProfileImgUrl(v);
                                        setPreviewImgUrl(v);
                                    }}
                                    onSave={handleSave}
                                    onCancel={toggleEdit}
                                />
                            ) : (
                                <>
                                    <h2 className="text-3xl font-semibold">
                                        {user?.name}
                                    </h2>
                                    <p className="text-gray-600">{user?.email}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {followerLabel}
                                    </p>
                                    <p className="text-gray-700 mt-3 italic max-w-xl whitespace-pre-line">
                                        {user?.bio?.trim() ||
                                            'No bio provided yet.'}
                                    </p>

                                    <div className="flex flex-wrap gap-3 mt-5">
                                        <button
                                            onClick={toggleEdit}
                                            className="cursor-pointer px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        >
                                            Edit Profile
                                        </button>

                                        <Link
                                            href="/new-project"
                                            className="cursor-pointer px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        >
                                            Create New Project
                                        </Link>

                                        <Link
                                            href="/devlogs/create"
                                            className="cursor-pointer px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        >
                                            Create Devlog Entry
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                        :
                        <div className="text-center md:text-left w-80">
                            <h2 className="text-3xl font-semibold">
                                {user?.name}
                            </h2>
                            <p className="text-gray-600">{user?.email}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                {followerLabel}
                            </p>
                            <p className="text-gray-700 mt-3 italic max-w-xl whitespace-pre-line">
                                {user?.bio?.trim() ||
                                    'No bio provided yet.'}
                            </p>
                        </div>
                    }

                </div>

                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Projects
                </h3>

                <div className="grid sm:grid-cols-2 gap-4 mb-12">
                    {loading && (
                        <div className="text-gray-500">Loading projects...</div>
                    )}

                    {user?.projects?.map((project: Project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}

                    {!loading && (user?.projects?.length === 0) && (
                        <div className="text-gray-500 col-span-full">
                            No projects yet.
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                    Devlog Entries
                </h3>

                <div className="space-y-3">
                    {user?.devlogs?.map((devlog: Devlog) => (
                        <DevlogCard devlog={devlog} />
                    ))}

                    {user?.devlogs?.length === 0 && (
                        <div className="text-gray-500">
                            No devlog entries yet.
                        </div>
                    )}
                </div>
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

export default User;
