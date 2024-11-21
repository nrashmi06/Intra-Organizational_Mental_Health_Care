import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";  // Import BlogCard component
import "@/styles/blog.css";
import "@/styles/global.css";

const BlogPost: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [article, setArticle] = useState<{
    title: string;
    date: string;
    author: string;
    views: number;
    intro: string;
    body: string;
    summary: string;
    image: string;
  } | null>(null);

  const [blogCards, setBlogCards] = useState<{
    id: number;
    title: string;
    slug: string;
    image: string;
    date: string;
    excerpt: string;
  }[]>([]);

  useEffect(() => {
    if (slug) {
      // Fetch the article data based on the slug (mock data for now)
      setArticle({
        title: "Mental Health and Well-Being",
        date: "07 Feb 2024",
        author: "John Doe",
        views: 1250,
        intro: "Mental health is as important as physical health, yet it is often overlooked or misunderstood. Mental well-being plays a critical role in how we think, feel, and act. It influences how we handle stress, relate to others, and make choices in our daily lives. Unfortunately, societal stigma around mental health can prevent people from seeking the help they need, leading to long-term consequences. It is essential to recognize that mental health affects every aspect of life, from personal relationships to professional achievements, and deserves the same attention and care as physical health.",
        body: "Mental health is a crucial component of overall well-being, encompassing emotional, psychological, and social dimensions. It affects how we respond to stress, interact with others, and make decisions. When mental health struggles occur, they can manifest in various forms, such as anxiety, depression, or trauma, impacting a person's ability to function. However, these conditions can be managed with the right support systems, including therapy, medication, and lifestyle changes. \n\nEveryone's mental health journey is unique, and challenges can arise for various reasons, including genetic predispositions, environmental factors, and life experiences. It is important to acknowledge the complexity of mental health issues and approach them with empathy and understanding. Regular practices such as exercise, mindfulness, and healthy sleep can improve mental well-being. Additionally, seeking professional help at the earliest sign of mental health struggles can prevent issues from escalating. \n\nMoreover, mental health is strongly connected to physical health. Chronic stress and untreated mental health conditions can lead to various physical problems, such as heart disease and weakened immunity. Conversely, physical health problems can exacerbate mental health challenges, creating a vicious cycle. By adopting a holistic approach that addresses both mental and physical health, individuals can improve their quality of life and reduce the risk of long-term health complications. \n\nCommunity support and reducing stigma around mental health are essential in fostering an environment where individuals feel safe seeking help. Open conversations, education, and social support networks can significantly contribute to mental well-being, helping individuals feel understood and supported in their journey towards healing and self-care.",
        summary: "In summary, mental health is a cornerstone of overall well-being and plays a vital role in shaping how we think, feel, and act. It affects every aspect of life, from our personal relationships to our professional performance. Mental health struggles are common but manageable with the right support and interventions. It is essential to prioritize mental health and seek help when needed. Breaking the stigma around mental health, fostering open conversations, and improving access to mental health resources can significantly improve individual and community well-being. Just as we care for our physical health, we must give equal attention to our mental health to lead fulfilling lives.",
        image: "/images/blog/mh3.avif"
      });
      

      // Fetch other blog posts for the "Read More" section (mock data)
      setBlogCards([ 
        { id: 1, title: "Nutrition and Health", slug: "nutrition-health", image: "/images/blog/mh3.avif", date: "05 Feb 2024", excerpt: "Nutrition plays a vital role in mental well-being..." },
        { id: 2, title: "Exercise for Mental Health", slug: "exercise-mental-health", image: "/images/blog/mh4.avif", date: "01 Feb 2024", excerpt: "Exercise helps in managing stress and improving mood..." },
        { id: 3, title: "Healthy Lifestyle Tips", slug: "healthy-lifestyle", image: "/images/blog/mh5.avif", date: "15 Jan 2024", excerpt: "A balanced lifestyle can help you maintain both physical and mental health..." }
      ]);
    }
  }, [slug]);

  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div> {/* Custom loader */}
      </div>
    );
  }
  

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="container max-w-4xl w-full">
          {/* Article Section */}
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex justify-between text-sm text-gray-600 mb-6">
            <span>By {article.author}</span>
            <span>{article.date}</span>
            <span>{article.views} views</span>
          </div>

          {/* Image with border and shadow effect */}
          <div className="mb-8 relative w-full" style={{ height: "25vh", overflow: "hidden" }}>
            <Image
              src={article.image}
              alt={article.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg w-full h-full transition-all duration-300"
            />
          </div>

          <div className="prose max-w-none text-justify">
  <h2 className="text-xl font-semibold mb-2">Introduction</h2>
  <p>{article.intro}</p>
  
  <h2 className="text-xl font-semibold mt-6 mb-2">Body</h2>
  <p>{article.body}</p>
  
  <h2 className="text-xl font-semibold mt-6 mb-2">Summary</h2>
  <p>{article.summary}</p>
</div>


          {/* Read More Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Read More</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogCards.map((blog) => (
                <div key={blog.id} className="flex flex-col h-full">
                  <BlogCard post={blog} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
