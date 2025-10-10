import { BlogCard } from "@/components/mobile/BlogCard";
import { CategoryTabs } from "@/components/mobile/CategoryTabs";
import { NewsletterSignup } from "@/components/mobile/NewsletterSignup";
import Footer from "@/components/mobile/Footer";
import Header from "@/components/mobile/Header";
import { ChevronLeft, Menu } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
export default function BlogPostPageMobile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const categories = ["Vaata kõiki", "Kategooria", "Kategooria", "Kategooria"];
  const [blog, setBlog] = useState<any>(null);

  const blogPosts = [
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/affbcd99d59bab2d47bfc87453dd4cc6d4f56b3c?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image:
        "/img/photo_2025-10-11_00-06-02.jpg",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    }
  ];

  const latestPosts = [
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/13571f7cf56492a68d841712fe14488da6cd8f64?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/0b141dad3a9c503c16e8fc83435b95a888e062f2?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/77e05888f12ec156877dc4372bc19d14b8203763?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/34fb12acf718f6417f23e5cb7f52aacd86e78213?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
  ];

  useEffect(() => {
    if (!id) return;
    fetch(`/api/blogs/${id}`)
      .then(res => res.json())
      .then(setBlog);
  }, [id]);
  if (!blog) return <div>Laadimine...</div>;
  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}

      {/* Category Tag */}
      
      {/* Main Article */}
      <main className="px-5 py-5 max-w-md mx-auto lg:max-w-4xl">
        {/* Categories Section */}
        <section className="mb-12 px-3">
          <h2 className="text-black font-normal text-lg leading-7 mb-6">
            Blogi kategooriad
          </h2>
          <CategoryTabs categories={categories} />
        </section>

        {/* Blog Posts Grid */}
        <section className="mb-20 px-3">
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post, index) => (
              <BlogCard key={index} {...post} />
            ))}
          </div>
        </section>
      </main>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Latest Posts Section */}
      <section className="px-5 py-12 max-w-md mx-auto lg:max-w-4xl">
        <h2 className="text-black font-semibold text-2xl leading-normal mb-8 px-3">
          Viimased postitused
        </h2>
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3 px-3">
          {latestPosts.map((post, index) => (
            <BlogCard key={index} {...post} />
          ))}
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}
