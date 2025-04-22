import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchBlogById, toggleLikeOnBlog } from "@/service/blog/GetBlogBuID";
import { updateBlog } from "@/service/blog/UpdateBlog";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import Navbar1 from "@/components/navbar/Navbar2";
import { Heart, Eye, Pencil, Trash, MessageCircle, X } from "lucide-react";
import Head from "next/head";
import EditBlogModal from "@/components/blog/EditBlogModal";
import DeleteBlogByID from "@/service/blog/DeleteBlogByID";
import InlineLoader from "@/components/ui/inlineLoader";
import BlogsByAuthor from "@/components/blog/BlogsByAuthor";
import Image from "next/image";
import { Article } from "@/lib/types";
import { sendMailToAuthor } from "@/service/mail/sendMailtoAuthor";

const BlogPost = () => {
  const router = useRouter();
  const { postId } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const ReduxuserId = useSelector((state: RootState) => state.auth.userId);
  const [imageLoading, setImageLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [contactSubject, setContactSubject] = useState<string>("");
  const [contactMessage, setContactMessage] = useState<string>("");
  const [contactSending, setContactSending] = useState<boolean>(false);
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);
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
        const response = (await fetchBlogById(
          Number(postId),
          token
        )) as Article;
        setArticle(response);
        console.log("Fetched article>>>>>>>>>>>>>>", response);
      } catch (err) {
        setError("Failed to fetch the article. Please try again later: " + err);
        setShowErrorModal(true);
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
        prevArticle && typeof updatedArticle === "object"
          ? { ...prevArticle, ...updatedArticle }
          : prevArticle
      );
    } catch (err) {
      setError("Failed to toggle like: " + err);
      setShowErrorModal(true);
    }
  };

  const handleEditClick = () => {
    if (article && ReduxuserId && article.userId === parseInt(ReduxuserId, 10)) {
      setEditMode(true);
      setEditedBlogData({
        title: article.title,
        content: article.content,
        summary: article.summary,
      });
    }
  };

  const handleDeleteClick = async () => {
    try {
      await DeleteBlogByID(Number(postId), token);
      router.push("/blog"); // Redirect to blog list page after deletion
    } catch (err) {
      setError("Failed to delete blog: " + err);
      setShowErrorModal(true);
    }
  };

  const handleSaveChanges = async () => {
    if (
      !editedBlogData.title ||
      !editedBlogData.content ||
      !editedBlogData.summary
    ) {
      setError("Please fill in all fields.");
      setShowErrorModal(true);
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

      setArticle(updatedArticle as Article);
      setEditMode(false);
    } catch (err) {
      setError("Failed to save blog updates: " + err);
      setShowErrorModal(true);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setError(null);
  };

  const handleContactAuthor = () => {
    setShowContactModal(true);
  };

  const handleCloseContactModal = () => {
    setShowContactModal(false);
    setContactSubject("");
    setContactMessage("");
    setContactSuccess(false);
  };

  const handleSubmitContact = async () => {
    if (!contactSubject.trim() || !contactMessage.trim()) {
      setError("Please fill in both subject and message fields.");
      setShowErrorModal(true);
      return;
    }

    setContactSending(true);

    try {
      if (!article) {
        setError("Article data is not available.");
        setShowErrorModal(true);
        return;
      }
      await sendMailToAuthor(
        {
          subject: contactSubject,
          body: contactMessage,
        },
        article.userId,
        token
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setContactSuccess(true);
      setContactSubject("");
      setContactMessage("");

      // Auto close after success
      setTimeout(() => {
        setShowContactModal(false);
        setContactSuccess(false);
      }, 3000);
    } catch (err) {
      setError("Failed to send message. Please try again.");
      setShowErrorModal(true);
    } finally {
      setContactSending(false);
    }
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError(null);
  };

  return (
    <div className="relative min-h-screen">
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
                  ${
                    article?.likedByCurrentUser
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

            <div className="flex justify-between items-start">
              <div className="prose max-w-none text-gray-800 space-y-4 flex-1">
                <h2 className="text-2xl font-semibold text-emerald-700 border-l-4 border-emerald-500 pl-4 mb-4">
                  Summary
                </h2>
                <p className="leading-relaxed italic text-emerald-700 bg-green-50/50 p-4 rounded-lg">
                  {article?.summary}
                </p>
              </div>
              {article?.isOpenForCommunication && (
                <button
                  onClick={handleContactAuthor}
                  className="ml-4 flex items-center justify-center space-x-2 rounded-full py-3 px-5 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                  aria-label="Contact author"
                >
                  <MessageCircle className="w-5 h-5 group-hover:animate-pulse" />
                  <span className="font-medium">Reach Out</span>
                </button>
              )}
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

      {/* Edit Blog Modal */}
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

      {/* Contact Author Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 transform transition-all duration-300 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-emerald-700">
                Connect with the Author
              </h3>
              <button
                onClick={handleCloseContactModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {contactSuccess ? (
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-green-500 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-emerald-700 font-medium">
                  Message sent successfully!
                </p>
                <p className="text-emerald-600 text-sm mt-2">
                  The author will get back to you soon.
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  You can connect to the author directly by sending a message.
                  This will be sent to the author's email address. Please be
                  respectful and concise.
                </p>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="Enter a subject for your message"
                      className="w-full border border-green-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700"
                      disabled={contactSending}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="w-full border border-green-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 min-h-[120px] text-gray-700"
                      disabled={contactSending}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4 space-x-3">
                  <button
                    onClick={handleCloseContactModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    disabled={contactSending}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmitContact}
                    disabled={
                      contactSending ||
                      !contactSubject.trim() ||
                      !contactMessage.trim()
                    }
                    className={`px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-400 text-white font-medium transition-all duration-300 flex items-center space-x-2
                      ${
                        contactSending
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:shadow-md transform hover:-translate-y-0.5"
                      }
                      ${
                        !contactSubject.trim() || !contactMessage.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    `}
                  >
                    {contactSending ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Message</span>
                    )}
                  </button>
                </div>
              </>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-sm text-center">
                Your mental health matters. We'll ensure your message is
                delivered respectfully.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && error && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-red-600">Error</h3>
              <button
                onClick={closeErrorModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeErrorModal}
                className="px-5 py-2 rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;