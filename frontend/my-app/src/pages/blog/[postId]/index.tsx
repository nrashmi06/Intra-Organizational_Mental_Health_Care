import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchBlogById, toggleLikeOnBlog } from "@/service/blog/GetBlogBuID";
import { updateBlog } from "@/service/blog/UpdateBlog";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import Navbar1 from "@/components/navbar/Navbar2";
import { Heart, Eye, Pencil, Trash } from "lucide-react";
import Head from "next/head";
import EditBlogModal from "@/components/blog/EditBlogModal";
import DeleteBlogByID from "@/service/blog/DeleteBlogByID";
import InlineLoader from "@/components/ui/inlineLoader";
import BlogsByAuthor from "@/components/blog/BlogsByAuthor";
import Image from "next/image";
import { Article } from "@/lib/types";

const BlogPost = () => {
  const router = useRouter();
  const { postId } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const ReduxuserId = useSelector((state: RootState) => state.auth.userId);
  const [imageLoading, setImageLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedBlogData, setEditedBlogData] = useState<{
    title: string;
    content: string;
    summary: string;
  }>({
    title: "",
    content: "",
    summary: "",
  });

  useEffect(() => {
    if (!postId || !token || isNaN(Number(postId))) return;

    const fetchArticle = async () => {
      try {
        setError(null);
        const response = await fetchBlogById(Number(postId), token);
        setArticle(response);
      } catch (error) {
        setError("Failed to fetch the article. Please try again later" + error);
      }
    };

    fetchArticle();
  }, [postId, token]);

  const handleLikeToggle = async () => {
    if (!article || !token) return;
    try {
      const updatedArticle = await toggleLikeOnBlog(
        Number(postId),
        token,
        article.likedByCurrentUser
      );
      setArticle((prevArticle) =>
        prevArticle ? { ...prevArticle, ...updatedArticle } : null
      );
    } catch (error) {
      setError("Failed to toggle like." + error);
    }
  };

  const handleEditClick = () => {
    if (article && article.userId === Number(ReduxuserId)) {
      setEditMode(true);
      setEditedBlogData({
        title: article.title,
        content: article.content,
        summary: article.summary,
      });
    }
  };

  const handleDeleteClick = async () => {
    DeleteBlogByID(Number(postId), token);
  };

  const handleSaveChanges = async () => {
    if (!editedBlogData.title || !editedBlogData.content || !editedBlogData.summary) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const updatedArticle = await updateBlog(
        Number(postId),
        {
          ...editedBlogData,
          userId: Number(ReduxuserId),
        },
        token
      );

      setArticle(updatedArticle);
      setEditMode(false);
    } catch (error) {
      setError("Failed to save blog updates." + error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setError(null);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <p className="text-red-500 bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-lg">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen ">
      <div className="absolute inset-0 h-full opacity-5 pointer-events-none" />
      <Head>
        <title>{article?.title || "Blog Post"}</title>
      </Head>
      <div className="relative top-0 left-0 w-full z-20">
        <Navbar1 />
      </div>
      <main className="absolute top-[80px] left-0 w-full min-h-screen flex flex-col items-center justify-center md:pb-10 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container max-w-3xl w-full bg-white/80 backdrop-blur-md shadow-xl md:rounded-2xl overflow-hidden border border-green-100 transition-all duration-300 md:hover:shadow-2xl">
          <div className="relative w-full h-[50vh] z-50 group overflow-hidden">
            {imageLoading && <InlineLoader height="h-full" />}
            {article?.imageUrl && (
              <Image
                src={article?.imageUrl || "/images/blog/mh1.png"}
                alt={article?.title || "Article image"}
                className="w-full h-full object-cover md:transform md:transition-transform md:duration-500 md:group-hover:scale-105"
                onLoadingComplete={() => setImageLoading(false)}
                width={800}
                height={600}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-transparent to-green-900/20 group-hover:opacity-10 transition-opacity duration-500"></div>
          </div>
          
          <div className="p-8 space-y-6">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent leading-tight mb-4">
              {article?.title}
            </h1>
            
            <div className="flex justify-between items-center text-sm text-gray-600 pb-4 border-b border-green-100">
              <span className="text-emerald-600 font-medium">
                {article?.publishDate
                  ? new Date(article.publishDate).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : null}
              </span>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-emerald-600">
                  <Eye className="w-5 h-5" />
                  <span>{article?.viewCount}</span>
                </div>

                <button
                  className="flex items-center space-x-1 group"
                  onClick={handleLikeToggle}
                  aria-label="Toggle like"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors duration-300 
                      ${article?.likedByCurrentUser
                        ? "text-red-500 fill-red-500"
                        : "text-emerald-600 group-hover:text-red-400"
                      }`}
                    fill={article?.likedByCurrentUser ? "currentColor" : "none"}
                  />
                  <span className="text-emerald-600">{article?.likeCount}</span>
                </button>

                {article?.userId === Number(ReduxuserId) && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleEditClick}
                      className="text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="text-emerald-600 hover:text-red-600 transition-colors"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="prose max-w-none text-gray-800 space-y-4">
              <h2 className="text-2xl font-semibold text-emerald-700 border-l-4 border-emerald-500 pl-4 mb-4">
                Content
              </h2>
              <div
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article?.content || "" }}
              />
            </div>

            <div className="prose max-w-none text-gray-800 space-y-4">
              <h2 className="text-2xl font-semibold text-emerald-700 border-l-4 border-emerald-500 pl-4 mb-4">
                Summary
              </h2>
              <p className="leading-relaxed italic text-emerald-700 bg-green-50/50 p-4 rounded-lg">
                {article?.summary}
              </p>
            </div>
          </div>
        </div>
        
        {article && postId && (
          <div className="w-full max-w-3xl mt-8">
            <BlogsByAuthor
              userId={article.userId.toString()}
              currentBlogId={postId}
              token={token}
            />
          </div>
        )}
      </main>

      {editMode && (
        <EditBlogModal
          title={editedBlogData.title}
          content={editedBlogData.content}
          summary={editedBlogData.summary}
          error={error}
          onClose={handleCancelEdit}
          onSave={handleSaveChanges}
          onChange={(field, value) =>
            setEditedBlogData((prev) => ({ ...prev, [field]: value }))
          }
        />
      )}
    </div>
  );
};

export default BlogPost;