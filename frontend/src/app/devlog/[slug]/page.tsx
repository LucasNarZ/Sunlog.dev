import Header from "@components/Header";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import { fetchPublicUser } from "@/features/users/services/fetchPublicUser";
import { fetchDevlog } from "@/features/devlogs/services/fetchDevlog";
import { fetchFollow } from "@/features/users/services/fetchFollow";
import PostInteractions from "@/features/devlogs/components/PostInteractions";
import { Metadata } from "next";
import CommentsSection from "@/features/devlogs/components/commentSection";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await fetchDevlog(slug);

    return {
        title: post.title,
        description: post.description,
    };
}

const Post = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const post = await fetchDevlog(slug);
    if (!post) {
        redirect("/post-not-found");
    }
    const user = await fetchPublicUser(post?.userId);
    const following = await fetchFollow(user.id);

    return (
        <div className="min-h-screen w-full bg-white text-gray-900 flex flex-col items-center">
            <Header />
            <article className="max-w-3xl w-full px-6 sm:px-10 pb-20 mt-20 break-words">
                {post.previewImgUrl && (
                    <Image
                        src={post.previewImgUrl}
                        alt="Post preview"
                        className="w-full h-72 object-cover rounded-xl mb-8 shadow-md"
                        width={0}
                        height={0}
                        unoptimized
                    />
                )}
                <h1 className="text-4xl font-extrabold mb-4 leading-tight font-family-garamond">
                    {post.title}
                </h1>
                <PostInteractions
                    user={user}
                    post={post}
                    initialFollowing={following}
                />
                <div className="prose prose-lg max-w-none leading-relaxed font-serif text-gray-800">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>
            <CommentsSection postId={post.id} />
        </div>
    );
};

export default Post;
