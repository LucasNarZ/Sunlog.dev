import { Post } from "@/features/devlogs/types/post";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchPublicUser } from "@/features/users/services/fetchPublicUser";

interface CardPostProps {
    post: Post;
}

const lineHeightTitle = 1.25;
const maxLinesTitle = 2;
const lineHeightDesc = 1.25;
const maxLinesDesc = 3;

const CardPost = async ({ post }: CardPostProps) => {
    const creationDate = new Date(post.createdAt);
    const author = await fetchPublicUser(post.userId);

    return (
        <Link href={"/devlog/" + post.slug}>
            <div className="w-11/12 max-w-[600px] bg-white hover:shadow-xl transition-shadow duration-300 flex items-center gap-4 p-5 rounded-3xl border border-gray-200 cursor-pointer">
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                        <Image
                            className="rounded-full object-cover"
                            src={
                                author?.profileImgUrl ??
                                "https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png"
                            }
                            alt="profilePic"
                            width={32}
                            height={32}
                            style={{ width: "32px", height: "32px" }}
                            unoptimized
                        />
                        <span className="font-medium break-words">{author?.name}</span>
                        <span className="text-gray-400">•</span>
                        <span>
                            {creationDate.getDate().toString().padStart(2, "0")}/
                            {(creationDate.getMonth() + 1).toString().padStart(2, "0")}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Heart className="w-4 h-4" />
                            {post.likesNumber ?? 0}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                        <p
                            className="text-lg font-semibold text-gray-900 line-clamp-2 break-words"
                            style={{
                                height: `${lineHeightTitle * maxLinesTitle}rem`,
                                lineHeight: `${lineHeightTitle}rem`,
                            }}
                        >
                            {post.title}
                        </p>
                        <p
                            className="text-sm text-gray-600 break-words line-clamp-3"
                            style={{
                                height: `${lineHeightDesc * maxLinesDesc}rem`,
                                lineHeight: `${lineHeightDesc}rem`,
                            }}
                        >
                            {post.description}
                        </p>
                    </div>
                </div>

                {post.previewImgUrl && (
                    <Image
                        className="rounded-xl object-cover"
                        src={post.previewImgUrl}
                        alt="post preview"
                        width={112}
                        height={112}
                        unoptimized
                    />
                )}
            </div>
        </Link>
    );
};

export default CardPost;
