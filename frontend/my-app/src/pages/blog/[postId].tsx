import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchBlogById, toggleLikeOnBlog } from '@/service/blog/GetBlogBuID';
import { updateBlog } from '@/service/blog/UpdateBlog';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import Navbar1 from '@/components/navbar/NavBar';
import Navbar2 from '@/components/navbar/navbar4';
import { Heart, Eye, Pencil, Trash } from 'lucide-react';
import '@/styles/global.css';
import Head from 'next/head';
import EditBlogModal from '@/components/blog/EditBlogModal';
import DeleteBlogByID from '@/service/blog/DeleteBlogByID';

const BlogPost = () => {
  const router = useRouter();
  const { postId } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken); // Redux token
  const ReduxuserId = useSelector((state: RootState) => state.auth.userId); // Redux userId

  interface Article {
    id: number;
    title: string;
    publishDate: string;
    viewCount: number;
    userId: number;
    imageUrl: string;
    content: string;
    summary: string;
    likedByCurrentUser: boolean; // Determines if the current user liked the article
    likeCount: number; // Total number of likes
  }

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedBlogData, setEditedBlogData] = useState<{
    title: string;
    content: string;
    summary: string;
  }>({
    title: '',
    content: '',
    summary: '',
  });
  const role = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    if (!postId || !token || isNaN(Number(postId))) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchBlogById(Number(postId), token);
        setArticle(response);
      } catch (error) {
        setError('Failed to fetch the article. Please try again later.');
      } finally {
        setLoading(false);
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
      ); // Backend updates like status
      setArticle((prevArticle) =>
        prevArticle ? { ...prevArticle, ...updatedArticle } : null
      );
    } catch (error) {
      console.error('Failed to update like status:', error);
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
    console.log('Deleted');
  };

  const handleSaveChanges = async () => {
    if (!editedBlogData.title || !editedBlogData.content || !editedBlogData.summary) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const updatedArticle = await updateBlog(Number(postId), {
        ...editedBlogData,
        userId: Number(ReduxuserId),
      }, token);

      setArticle(updatedArticle);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to save blog updates:', error);
      setError('Failed to save blog updates.');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>{error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No article found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Head>
        <title>{article?.title}</title>
      </Head>
      
      {/* Navbar with absolute positioning */}
      <div className="relative top-0 left-0 w-full z-40">
      {role === 'ADMIN' ? <Navbar2 /> : <Navbar1 />}
      </div>

      {/* Blog content with overlay positioning */}
      <main className="absolute top-[80px] left-0 w-full min-h-screen flex justify-center  pb-10">
        <div className="container max-w-3xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          {/* Blog Image with Modern Styling */}
          <div className="relative w-full h-[50vh] z-50 group overflow-hidden">
            <img
              src={article?.imageUrl}
              alt={article?.title}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-10 transition-opacity duration-500"></div>
          </div>

          {/* Blog Content Container */}
          <div className="p-8 space-y-6">
            {/* Title */}
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {article?.title}
            </h1>

            {/* Metadata and Actions */}
            <div className="flex justify-between items-center text-sm text-gray-600 pb-4 border-b border-gray-200">
            <span className="text-gray-500">
                  {article?.publishDate
                  ? new Date(article.publishDate).toLocaleString('en-US', {
                  weekday: 'short', 
                  year: 'numeric',
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: true, 
                })
                : null}
            </span>
              <div className="flex items-center space-x-4">
                {/* View Count */}
                <div className="flex items-center space-x-1 text-gray-600">
                  <Eye className="w-5 h-5 text-gray-500" />
                  <span>{article?.viewCount}</span>
                </div>

                {/* Like Button */}
                <button
                  className="flex items-center space-x-1 group"
                  onClick={handleLikeToggle}
                  aria-label="Toggle like"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors duration-300 
                      ${article?.likedByCurrentUser 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-500 group-hover:text-red-400'}`}
                    fill={article?.likedByCurrentUser ? 'currentColor' : 'none'}
                  />
                  <span>{article?.likeCount}</span>
                </button>

                {/* Edit and Delete Actions */}
                {article?.userId === Number(ReduxuserId) && (
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={handleEditClick} 
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleDeleteClick} 
                      className="text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="prose max-w-none text-gray-800 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-500 pl-4 mb-4">
                Content
              </h2>
              <p className="leading-relaxed">{article?.content}</p>
            </div>

            {/* Summary Section */}
            <div className="prose max-w-none text-gray-800 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-green-500 pl-4 mb-4">
                Summary
              </h2>
              <p className="leading-relaxed italic text-gray-700">{article?.summary}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal (remains the same) */}
      {editMode && (
        <EditBlogModal
          title={editedBlogData.title}
          content={editedBlogData.content}
          summary={editedBlogData.summary}
          error={error}
          image={null}
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
