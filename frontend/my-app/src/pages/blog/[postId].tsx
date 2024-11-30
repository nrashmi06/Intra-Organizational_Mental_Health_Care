import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchBlogById, toggleLikeOnBlog } from '@/service/blog/GetBlogBuID'; 
import { updateBlog } from '@/service/blog/UpdateBlog';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import Navbar from '@/components/navbar/NavBar';
import { Heart, Eye, Pencil } from 'lucide-react';
import '@/styles/global.css';
import Head from 'next/head';
import EditBlogModal from '@/components/blog/EditBlogModal';

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
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{article.title}</title>
      </Head>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="container max-w-4xl w-full">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
            <span>{article.publishDate}</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Eye className="w-5 h-5 mr-1 text-gray-600" />
                <span>{article.viewCount}</span>
              </div>
              <button
                className="flex items-center"
                onClick={handleLikeToggle}
                aria-label="Toggle like"
              >
                <Heart
                  className={`w-5 h-5 mr-1 transition-all duration-200 ${
                    article.likedByCurrentUser ? 'text-red-500' : 'text-gray-600'
                  }`}
                  fill={article.likedByCurrentUser ? 'currentColor' : 'none'}
                />
                <span>{article.likeCount}</span>
              </button>
              {article.userId === Number(ReduxuserId) && (
                <div className="flex items-center cursor-pointer" onClick={handleEditClick}>
                  <Pencil className="w-5 h-5 mr-1 text-gray-600" />
                </div>
              )}
            </div>
          </div>
          <div className="mb-8 relative w-full" style={{ height: '25vh', overflow: 'hidden' }}>
            <img
              src={article.imageUrl}
              alt={article.title}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              className="rounded-lg w-full h-full transition-all duration-300"
            />
          </div>
          <div className="prose max-w-none text-justify">
            <h2 className="text-xl font-semibold mb-2">Content</h2>
            <p>{article.content}</p>
          </div>
          <div className="prose max-w-none text-justify">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <p>{article.summary}</p>
          </div>
        </div>
      </main>
      {editMode && (
        <EditBlogModal
          title={editedBlogData.title}
          content={editedBlogData.content}
          summary={editedBlogData.summary}
          error={error}
          image={null} // Add the image property
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