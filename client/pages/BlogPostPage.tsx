import PageContainer from "@/components/PageContainer";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
export default function BlogPostPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  useEffect(() => {
    if (!id) return;
    fetch(`/api/blogs/${id}`)
      .then(res => res.json())
      .then(setBlog);
  }, [id]);
  if (!blog) return <PageContainer>Laadimine...</PageContainer>;
  return (
    <PageContainer className="font-poppins">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-6 xl:px-25 pt-10">
        <div className="flex items-center gap-2 mb-6" onClick={() => navigate("/blog")}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 3L5 8L10 13" stroke="black" strokeWidth="1.5" />
          </svg>
          <span className="text-black text-base font-normal leading-6">
            Kõik postitused
          </span>
        </div>

        {/* Category */}
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="flex px-2 py-1 items-center rounded-lg bg-gray-light">
            <span className="text-black text-lg font-medium leading-7">
              {blog.category}
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-black text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8 max-w-4xl">
          {blog.title}
        </h1>
      </div>

      {/* Hero Image */}
      <div className="max-w-screen-xl mx-auto px-6 xl:px-25 mb-16">
        <img
          src={blog.title_image}
          alt="Blog post hero image"
          className="w-full h-auto rounded-lg object-cover"
          style={{ aspectRatio: "1240/594" }}
        />
      </div>

      {/* Article Meta */}
      <div className="max-w-screen-xl mx-auto px-6 xl:px-25 mb-12">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-black text-base font-normal leading-6">
              Kirjutanud
            </span>
            <span className="text-black text-base font-medium leading-6">
              {blog.author}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-black text-base font-normal leading-6">
              Avaldatud
            </span>
            <span className="text-black text-base font-medium leading-6">
              {new Date(blog.published).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-screen-xl mx-auto px-6 xl:px-25 pb-20">
        {/* Introduction Section */}
        <div className="mb-12">
          <div className="max-w-3xl mb-6">
            <h2 className="text-black text-2xl lg:text-3xl font-bold leading-tight mb-0">
              Sissejuhatus
            </h2>
          </div>
          <div className="space-y-4">
            <div className="text-black text-lg font-normal leading-7" dangerouslySetInnerHTML={{ __html: blog.introduction }} />

          </div>
        </div>

        {/* Content Image */}
        <div className="mb-8">
          <div className="relative">
            <img
              src={blog.intro_image}
              alt="Article content image"
              className="w-full h-auto rounded-lg object-cover"
              style={{ aspectRatio: "1240/526" }}
            />
            {/* Image Caption */}
            <div className="flex items-start gap-2 mt-4 max-w-3xl">
              <div className="w-0.5 h-5 bg-black flex-shrink-0"></div>
              <span className="text-black text-base font-normal leading-6">
                Pildiallkiri tuleb siia
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8">
        {blog.intro_detail && (
              <div className="text-black text-lg font-normal leading-7" dangerouslySetInnerHTML={{ __html: blog.intro_detail }} />
            )}

          {/* Conclusion Section */}
          <div className="pt-8">
            <div className="max-w-3xl mb-5">
              <h2 className="text-black text-2xl lg:text-3xl font-bold leading-tight">
                Kokkuvõte
              </h2>
            </div>
            <div className="space-y-4">
              <div className="text-black text-lg font-normal leading-7" dangerouslySetInnerHTML={{ __html: blog.summary }} />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
