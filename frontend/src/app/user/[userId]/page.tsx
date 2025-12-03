"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@components/Header";
import usePublicUser from "@/features/users/hooks/usePublicUser";
import useDevlogEventsByAuthor from "@/features/users/hooks/useDevlogEventsByAuthor";
import CardPostClient from "@/features/devlogs/components/CardPostClient";
import useFollow from "@/features/users/hooks/useFollow";
import { apiClient } from "@lib/apiClient";
import { AxiosError } from "axios";

const PublicUser = () => {
  const { userId } = useParams();
  const id = userId as string;
  const router = useRouter();

  const [devlogEvents] = useDevlogEventsByAuthor(id);
  const [following, setFollowing] = useFollow(id);
  const [refreshUserKey, setRefreshUserKey] = useState(0);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [error, setError] = useState<unknown>(null);
  const [user, errorUser] = usePublicUser(id, refreshUserKey);

  if (errorUser) {
    if (
      (errorUser as AxiosError).status == 404 ||
      (errorUser as AxiosError).status == 400
    ) {
      router.push("/user-not-found");
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await apiClient.get("/user/me/id", {
          withCredentials: true,
        });
        setLoggedUserId(response.data);
      } catch (err) {
        console.log(err);
        setError(err);
      }
    })();
  }, []);

  const handleFollow = async () => {
    try {
      if (following) {
        await apiClient.post(
          "/follow/unfollowUser",
          {
            followedId: id,
          },
          { withCredentials: true },
        );
      } else {
        await apiClient.post(
          "/follow/followUser",
          {
            followedId: id,
          },
          { withCredentials: true },
        );
      }
      setFollowing(!following);
      setRefreshUserKey((prev) => prev + 1);
    } catch (err) {
      if ((err as AxiosError).status == 401) {
        router.push("/sign-in");
      } else {
        alert("Error on follow/unfollow user");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center w-full">
      <Header />
      <div className="w-full max-w-5xl mt-12 px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-6">
          <img
            className="w-32 h-32 rounded-full object-cover shadow-md"
            src={user?.profileImgUrl}
            alt="Profile"
          />
          <div className="text-center md:text-left w-full">
            <h2 className="text-3xl font-semibold">{user?.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Joined on{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unknown date"}
            </p>
            <p className="text-sm text-gray-500">
              {user?.followersNumber} follower
              {user?.followersNumber === 1 ? "" : "s"}
            </p>
            <p className="text-gray-700 mt-3 italic max-w-xl whitespace-pre-line">
              {user?.bio?.trim() !== "" ? user?.bio : "No bio provided yet."}
            </p>
            {error || loggedUserId !== id ? (
              <button
                onClick={handleFollow}
                className={`cursor-pointer mt-4 px-5 py-2 text-white rounded transition ${following ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {following ? "Unfollow" : "Follow"}
              </button>
            ) : null}
          </div>
        </div>
        <div className="w-full">
          {devlogEvents && devlogEvents.length > 0 ? (
            <>
              <h3 className="text-xl font-medium mb-4">
                DevlogEvents by {user?.name}
              </h3>
              <div className="grid gap-6">
                {devlogEvents.map((post, index) => (
                  <CardPostClient key={index} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center mt-10 gap-4">
              <p className="text-lg font-medium">
                This user hasn’t published any devlogEvents yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicUser;
