import { getTrendingDevlogs } from "@/lib/getTrendingDevlogs";
import CardPost from "./CardPost";

const TrendingDevlogs = async () => {
  const devlogs = await getTrendingDevlogs();

  return (
    <div className="p-4 border rounded-xl shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">Trending Devlogs</h2>
      <div className="flex flex-col gap-4">
        {devlogs.length > 0 ? (
          devlogs.map((post) => <CardPost key={post.id} post={post} />)
        ) : (
          <p className="text-gray-500 text-center">
            No trending devlogs available right now.
          </p>
        )}
      </div>
    </div>
  );
};

export default TrendingDevlogs;
