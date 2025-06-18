import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import Header from "../components/header";
import useAuthor from "../hooks/getAuthor";
import usePostsByAuthor from "../hooks/getUserPosts";
import CardPost from "../components/cardPost";

const Profile = () => {
  const navigate = useNavigate();
  const [user, errorUser] = useAuthor();
  const [posts] = usePostsByAuthor(user?.id ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name ?? "");
  const [editedBio, setEditedBio] = useState(user?.bio ?? "");

  if (errorUser) {
    navigate("/signIn");
  }

  const handleClick = () => {
    navigate("/editor");
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedName(user?.name ?? "");
      setEditedBio(user?.bio ?? "");
    }
  };

  const saveProfile = () => {
    // TODO
    console.log("Saving profile:", { name: editedName, bio: editedBio });
    if(user){
        user.name = editedName;
        user.bio = editedBio;
    }
    setIsEditing(false);
  };

  const logout = async () => {
    // TODO
    try {
      Cookies.remove("access_token");
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      navigate("/signIn");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center w-full">
      <Header />
      <div className="w-full max-w-5xl mt-12 px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-6">
          <img className="w-32 h-32 rounded-full object-cover shadow-md" src={user?.profileImgUrl} alt="Profile" />
          <div className="text-center md:text-left w-full">
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <input className="border px-3 py-1 rounded w-full md:w-96" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                <textarea className="border px-3 py-1 rounded w-full md:w-96 min-h-[100px]" value={editedBio} onChange={(e) => setEditedBio(e.target.value)} placeholder="Tell us about yourself..." />
                <div className="flex gap-2 mt-2">
                  <button onClick={saveProfile} className="cursor-pointer px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                  <button onClick={toggleEdit} className="cursor-pointer px-4 py-1 bg-gray-300 text-black rounded hover:bg-gray-400">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-semibold">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500 mt-2">{user?.followers} follower{user?.followers === 1 ? "" : "s"}</p>
                <p className="text-gray-700 mt-3 italic max-w-xl whitespace-pre-line">{user?.bio?.trim() !== "" ? user?.bio : "No bio provided yet."}</p>
                <button onClick={toggleEdit} className="cursor-pointer mt-4 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Edit Profile</button>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <button onClick={logout} className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
        </div>

        <div className="w-full">
          {posts && posts.length > 0 ? (
            <>
              <h3 className="text-xl font-medium mb-4">Your Posts</h3>
              <div className="grid gap-6">
                {posts.map((post, index) => <CardPost key={index} post={post} />)}
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
    </div>
  );
};

export default Profile;
