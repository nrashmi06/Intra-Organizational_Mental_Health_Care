import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchBlogById, toggleLikeOnBlog } from '@/service/blog/GetBlogBuID'; // Function to fetch blog and toggle like
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import Navbar from '@/components/navbar/NavBar';
import { Heart, Eye } from 'lucide-react';
import '@/styles/global.css';
import Head from 'next/head';

const BlogPost = () => {
  const router = useRouter();
  const { postId } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken); // Redux token

  interface Article {
    id: number;
    title: string;
    publishDate: string;
    viewCount: number;
    imageUrl: string;
    content: string;
    summary: string;
    likedByCurrentUser: boolean; // Determines if the current user liked the article
    likeCount: number; // Total number of likes
  }

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      const updatedArticle = await toggleLikeOnBlog(Number(postId), token , article.likedByCurrentUser); // Backend updates like status
      setArticle((prevArticle) =>
        prevArticle ? { ...prevArticle, ...updatedArticle } : null
      );
    } catch (error) {
      console.error('Failed to update like status:', error);
    }
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
              {/* Views */}
              <div className="flex items-center">
                <Eye className="w-5 h-5 mr-1 text-gray-600" />
                <span>{article.viewCount}</span>
              </div>
              {/* Likes */}
              <button
                className="flex items-center"
                onClick={handleLikeToggle}
                aria-label="Toggle like"
              >
                <Heart
                  className={`w-5 h-5 mr-1 transition-all duration-200 ${
                    article.likedByCurrentUser
                      ? 'text-red-500'
                      : 'text-gray-600'
                  }`}
                  fill={article.likedByCurrentUser ? 'currentColor' : 'none'}
                />
                <span>{article.likeCount}</span>
              </button>
            </div>
          </div>

          <div
            className="mb-8 relative w-full"
            style={{ height: '25vh', overflow: 'hidden' }}
          >
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
    </div>
  );
};

export default BlogPost;
