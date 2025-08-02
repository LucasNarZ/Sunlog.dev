import { useEffect, useState } from "react";
import { Post } from "@/types/post";
import { fetchAuthorPostCard } from "@/lib/fetchAuthorPostCard";
import { Heart, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CardPostProps {
  post: Post;
  onDeleteClick?: () => void;
}

const lineHeightTitle = 1.25;
const maxLinesTitle = 2;
const lineHeightDesc = 1.25;
const maxLinesDesc = 3;

const CardPost = ({ post, onDeleteClick }: CardPostProps) => {
  const [author, setAuthor] = useState<{
    name: string;
    profileImgUrl: string;
  } | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      const data = await fetchAuthorPostCard(post.userId);
      setAuthor(data);
    };
    fetchAuthor();
  }, [post.userId]);

  const creationDate = new Date(post.createdAt);

  return (
    <div className="relative w-11/12 max-w-[600px] bg-white hover:shadow-xl transition-shadow duration-300 flex items-center gap-4 p-5 rounded-3xl border border-gray-200">
      {onDeleteClick && (
        <button
          onClick={onDeleteClick}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
        >
          <X className="w-5 h-5 cursor-pointer" />
        </button>
      )}
      <Link
        href={"/devlog/" + post.slug}
        className="flex items-center gap-4 w-full"
      >
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
              {post.likes ?? 0}
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
      </Link>
    </div>
  );
};

export default CardPost;
