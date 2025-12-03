import { Post } from "@/features/devlogs/types/post";
import CardPostClient from '@/features/devlogs/components/CardPostClient'


type DevlogEventsListProps = {
    devlogEvents: Post[];
    onDeleteClick: (post: Post) => void;
};

export const DevlogEventsList = ({ devlogEvents, onDeleteClick }: DevlogEventsListProps) => (
    <>
        {devlogEvents.length > 0 ? (
            <div className="relative pl-6 border-l border-gray-300 space-y-10">
                {devlogEvents.map((post, i) => (
                    <div key={i} className="relative group">
                        <div className="absolute -left-3 top-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow"></div>
                        <div className="mb-1 text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </div>
                        <CardPostClient post={post} onDeleteClick={() => onDeleteClick(post)} />
                    </div>
                ))}
            </div>
        ) : (
            <div className="relative pl-6 border-l border-gray-300 mt-6">
                <div className="relative group mb-8">
                    <div className="absolute -left-3 top-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow"></div>
                    <p className="text-gray-500 italic">You haven’t logged any entries yet.</p>
                </div>
                <div className="flex flex-col items-start gap-4">
                    <p className="text-gray-600">
                        Start your devlog by sharing what you’re learning or building.
                    </p>
                    <button
                        onClick={() => window.location.href = "/create-devlog"}
                        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Create your first entry
                    </button>
                </div>
            </div>
        )}
    </>
);

