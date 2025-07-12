'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@components/Header'
import useAuthor from '@hooks/getAuthor'
import usePostsByAuthor from '@hooks/getUserPosts'
import CardPostClient from '@components/CardPostClient'
import { apiClient } from '@lib/apiClient'
import { Post } from '@/types/post'

const Profile = () => {
	const router = useRouter()
	const [user, errorUser] = useAuthor()
	const [posts] = usePostsByAuthor(user?.id)
	const [isEditing, setIsEditing] = useState(false)
	const [editedName, setEditedName] = useState('')
	const [editedBio, setEditedBio] = useState('')
	const [editedProfileImgUrl, setEditedProfileImgUrl] = useState('')
	const [previewImgUrl, setPreviewImgUrl] = useState('')
	const [isSaving, setIsSaving] = useState(false)
	const [saveError, setSaveError] = useState<string | null>(null)
	const [nameError, setNameError] = useState('')
	const [urlError, setUrlError] = useState('')

	const [showModal, setShowModal] = useState(false)
	const [postToDelete, setPostToDelete] = useState<Post | null>(null)

	useEffect(() => {
		if (errorUser) router.push('/sign-in')
	}, [errorUser, router])

	useEffect(() => {
		setEditedName(user?.name ?? '')
		setEditedBio(user?.bio ?? '')
		setEditedProfileImgUrl(user?.profileImgUrl ?? '')
		setPreviewImgUrl(user?.profileImgUrl ?? '')
	}, [user])

	const handleImgUrlChange = (value: string) => {
		setEditedProfileImgUrl(value)
		setPreviewImgUrl(value)
	}

	const toggleEdit = () => {
		setIsEditing((prev) => !prev)
		setSaveError(null)
		setNameError('')
		setUrlError('')
		if (isEditing && user) {
			setEditedName(user.name)
			setEditedBio(user.bio ?? '')
			setEditedProfileImgUrl(user.profileImgUrl ?? '')
			setPreviewImgUrl(user.profileImgUrl ?? '')
		}
	}

	const validate = () => {
		let valid = true
		if (!editedName.trim() || editedName.trim().length < 3) {
			setNameError('Name must be at least 3 characters.')
			valid = false
		} else setNameError('')
		if (editedProfileImgUrl && !/^https?:\/\//.test(editedProfileImgUrl)) {
			setUrlError('Image URL must start with http or https.')
			valid = false
		} else setUrlError('')
		return valid
	}

	const saveProfile = async () => {
		if (!validate()) return
		setIsSaving(true)
		setSaveError(null)
		try {
			const updatedUser = {
				...user,
				name: editedName,
				bio: editedBio,
				profileImgUrl: editedProfileImgUrl
			}
			const response = await apiClient.put('/user/update', updatedUser, { withCredentials: true })
			if (response.status === 200) {
				setIsEditing(false)
				window.location.reload()
			} else setSaveError('Failed to update profile. Please try again.')
		} catch (err) {
			console.error(err)
			setSaveError('An error occurred while saving.')
		} finally {
			setIsSaving(false)
		}
	}

	const handleClick = () => router.push('/create-post')

	const confirmDeletePost = (post: Post) => {
		setPostToDelete(post)
		setShowModal(true)
	}

	const deletePost = async () => {
		if (!postToDelete) return
		try {
			await apiClient.delete("/post/" + postToDelete.id)
		} catch (err) {
			console.error(err)
		}
		setShowModal(false)
		setPostToDelete(null)
		window.location.reload() 
	}

	return (
		<div className={"min-h-screen bg-gray-50 flex flex-col items-center w-full "}>
			<Header />
			<div className="w-full max-w-5xl mt-12 mb-12 px-6">
				
				<div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-6">
					<div className="w-32 h-32 rounded-full shadow-md overflow-hidden">
						<img className="object-cover w-full h-full" src={previewImgUrl || 'https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png'} alt="Profile" />
					</div>
					<div className="text-center md:text-left w-80">
						{isEditing ? (
							<div className="flex flex-col gap-3">
								<div>
									<input className={`border px-3 py-2 rounded w-full md:w-96 focus:outline-none ${nameError ? 'border-red-500' : 'border-gray-300'}`} value={editedName} onChange={(e) => setEditedName(e.target.value)} disabled={isSaving} placeholder="Name" />
									{nameError && <p className="text-sm text-red-600 mt-1">{nameError}</p>}
								</div>
								<div>
									<input type="text" className={`border px-3 py-2 rounded w-full md:w-96 focus:outline-none ${urlError ? 'border-red-500' : 'border-gray-300'}`} value={editedProfileImgUrl} onChange={(e) => handleImgUrlChange(e.target.value)} placeholder="Profile image URL" disabled={isSaving} />
									{urlError && <p className="text-sm text-red-600 mt-1">{urlError}</p>}
								</div>
								<textarea className="border px-3 py-2 rounded w-full md:w-96 min-h-[100px] focus:outline-none border-gray-300" value={editedBio} onChange={(e) => setEditedBio(e.target.value)} placeholder="Tell us about yourself..." disabled={isSaving} />
								{saveError && <p className="text-red-600">{saveError}</p>}
								<div className="flex gap-3 mt-3">
									<button onClick={saveProfile} className="cursor-pointer px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
									<button onClick={toggleEdit} className="cursor-pointer px-5 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition" disabled={isSaving}>Cancel</button>
								</div>
							</div>
						) : (
							<>
								<h2 className="text-3xl font-semibold">{user?.name}</h2>
								<p className="text-gray-600">{user?.email}</p>
								<p className="text-sm text-gray-500 mt-2">{user?.followers} follower{user?.followers === 1 ? '' : 's'}</p>
								<p className="text-gray-700 mt-3 italic max-w-xl whitespace-pre-line">{user?.bio?.trim() !== '' ? user?.bio : 'No bio provided yet.'}</p>
								<div className="flex gap-7">
									<button onClick={toggleEdit} className="cursor-pointer mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Edit Profile</button>
									{posts && posts.length > 0 && (
										<button onClick={handleClick} className="cursor-pointer mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Create A Post</button>
									)}
								</div>
							</>
						)}
					</div>
				</div>

				
				<div className="w-full">
					{posts && posts.length > 0 ? (
						<>
							<h3 className="text-xl font-medium mb-4">Your Posts</h3>
							<div className="grid gap-6">
								{posts.map((post, index) => (
									<CardPostClient key={index} post={post} onDeleteClick={() => confirmDeletePost(post)} />
								))}
							</div>
						</>
					) : (
						<div className="flex flex-col items-center justify-center text-center mt-10 gap-4">
							<p className="text-lg font-medium">You don’t have any posts yet</p>
							<p className="text-gray-500">Start writing and share your knowledge with others!</p>
							<button onClick={handleClick} className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Create your first post</button>
						</div>
					)}
				</div>
			</div>

			
			{showModal && postToDelete && (
				<>
					<div className="fixed inset-0 bg-black opacity-50 z-40"></div>
					<div className="fixed inset-0 z-50 flex items-center justify-center">
						<div className="bg-white rounded-xl p-6 h-40 max-w-sm w-full shadow-2xl">
							<h2 className="text-lg font-semibold mb-3 text-gray-800">Delete this post?</h2>
							<p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
							<div className="flex justify-end gap-3">
								<button onClick={() => setShowModal(false)} className="cursor-pointer px-4 py-2 text-sm rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</button>
								<button onClick={deletePost} className="cursor-pointer px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600">Delete</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default Profile
