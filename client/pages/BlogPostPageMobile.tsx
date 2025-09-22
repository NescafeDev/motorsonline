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
  const [blog, setBlog] = useState<any>(null);
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
      <div
        className="flex items-center gap-2 px-5 py-2"
        onClick={() => navigate("/blog")}
      >
        <ChevronLeft size={16} className="text-black" />
        <span className="text-black text-base font-normal">
          Kõik postitused
        </span>
      </div>

      {/* Category Tag */}
      <div className="px-5 py-4">
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="flex items-center px-2 py-1 bg-brand-light rounded-lg">
            <span className="text-black text-base font-medium">{blog.category}</span>
          </div>
        </div>
      </div>

      {/* Main Article */}
      <main className="px-5">
        {/* Article Title */}
        <h1 className="text-black text-[28px] font-semibold leading-[130%] mb-6 max-w-[390px]">
          {blog.title}
        </h1>

        {/* Hero Image */}
        <div className="mb-6">
          <img
            src={blog.title_image}
            alt="Blog post hero image"
            className="w-full h-[468px] object-cover rounded-lg"
          />
        </div>

        {/* Article Meta */}
        <div className="flex gap-20 mb-8">
          <div className="flex flex-col gap-2">
            <span className="text-black text-base font-normal">Kirjutanud</span>
            <span className="text-black text-base font-medium">
              {blog.author}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-black text-base font-normal">Avaldatud</span>
            <span className="text-black text-base font-medium">
              {new Date(blog.published).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Article Content */}
        <article className="space-y-8 pb-16">
          {/* Introduction Section */}
          <section>
            <h2 className="text-black text-[26px] font-semibold leading-[150%] mb-4">
              Sissejuhatus
            </h2>
            <div className="text-black text-base font-normal leading-[150%] mb-4" dangerouslySetInnerHTML={{ __html: blog.introduction }} />

          </section>

          {/* Article Image */}
          <figure className="mb-8">
            <img
              src={blog.intro_image}
              alt="Article content image"
              className="w-full h-[372px] object-cover rounded-lg"
            />
            <figcaption className="flex items-start gap-2 mt-3">
              <div className="w-0.5 h-5 bg-black"></div>
              <span className="text-black text-sm font-normal leading-[150%]">
                Pildiallkiri tuleb siia
              </span>
            </figcaption>
          </figure>

          {blog.intro_detail && (
              <div className="text-black text-base font-normal leading-[150%] mb-8" dangerouslySetInnerHTML={{ __html: blog.intro_detail }} />
            )}
          {/* Summary Section */}
          <section>
            <h2 className="text-black text-[26px] font-semibold leading-[150%] mb-4 pt-6">
              Kokkuvõte
            </h2>
            <div className="space-y-4">
              <div className="text-black text-base font-normal leading-[150%]" dangerouslySetInnerHTML={{ __html: blog.summary }} />
            </div>
          </section>
        </article>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
