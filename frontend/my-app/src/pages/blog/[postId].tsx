import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchBlogById } from '@/service/blog/GetBlogBuID';  // Function to fetch blog post by ID
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import Navbar from '@/components/navbar/NavBar';
import '@/styles/global.css';
import Head from 'next/head';

const BlogPost = () => {
  const router = useRouter();
  const { postId } = router.query;  // Get the postId from the URL (dynamic route)
  const token = useSelector((state: RootState) => state.auth.accessToken); // Get access token from Redux store
  
  interface Article {
    title: string;
    publishDate: string;
    viewCount: number;
    imageUrl: string;
    content: string;
    summary : string;
  }

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    if (!postId) {
      return;  // Exit early if postId is not yet available
    }

    if (token && !isNaN(Number(postId))) {
      const fetchArticle = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetchBlogById(Number(postId), token);  // Fetch the article by postId
          setArticle(response);
        } catch (error) {
          setError('Failed to fetch the article. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchArticle();
    }
  }, [postId, token]);  // Re-run when postId or token changes
  
  // If loading, show a loader
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>  {/* Custom loader */}
      </div>
    );
  }

  // If there's an error, show the error message
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>{error}</p>
      </div>
    );
  }

  // If no article found
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
        <title>{article.title}</title> {/* Dynamically set the page title */}
      </Head>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="container max-w-4xl w-full">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex justify-between text-sm text-gray-600 mb-6">
            <span>{article.publishDate}</span>
            <span>{article.viewCount} views</span>
          </div>
  
          <div className="mb-8 relative w-full" style={{ height: "25vh", overflow: "hidden" }}>
            <img
              src={article.imageUrl}
              alt={article.title}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
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
