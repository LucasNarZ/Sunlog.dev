import Image from "next/image";
import { getTrendingUsers } from "@/features/users/services/getTrendingUsers";

const TrendingUsers = async () => {
  const users = await getTrendingUsers();

  return (
    <div className="p-4 border rounded-xl shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">Trending Users</h2>
      <div className="flex flex-col gap-4">
        {users?.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <Image
                src={user.profileImgUrl}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">
                  +{user.followersNumber} followers
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No trending users available right now.
          </p>
        )}
      </div>
    </div>
  );
};

export default TrendingUsers;
