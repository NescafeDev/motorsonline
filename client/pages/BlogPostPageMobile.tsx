import { BlogCard } from "@/components/mobile/BlogCard";
import { CategoryTabs } from "@/components/mobile/CategoryTabs";
import { NewsletterSignup } from "@/components/mobile/NewsletterSignup";
import Footer from "@/components/mobile/Footer";
import Header from "@/components/mobile/Header";
import { ChevronLeft, Menu } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { slugify } from "@/lib/utils";

interface Blog {
  id: number;
  category: string;
  title: string;
  title_image: string;
  intro_image: string;
  introduction: string;
  intro_detail: string;
  summary: string;
}

export default function BlogPostPageMobile() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top when page loads or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all blogs, then resolve slug to id and fetch that blog
        const blogsResponse = await fetch('/api/blogs');
        const blogsData = await blogsResponse.json();
        setAllBlogs(blogsData);
        if (slug) {
          const match = blogsData.find((b: any) => b && b.title && slugify(b.title) === slug);
          if (match?.id) {
            const blogResponse = await fetch(`/api/blogs/${match.id}`);
            const blogData = await blogResponse.json();
            setBlog(blogData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Get unique categories for tabs
  const categories = [t('uiActions.viewAll'), ...Array.from(new Set(allBlogs.map(blog => blog.category)))];

  // Convert blogs to BlogCard format for recent posts
  const recentPosts = allBlogs
    .filter(b => b.id !== blog?.id) // Exclude current blog
    .slice(0, 4) // Show only 4 recent posts
    .map(blog => ({
      id: blog.id,
      image: blog.title_image || 'https://cdn.builder.io/api/v1/image/assets/TEMP/affbcd99d59bab2d47bfc87453dd4cc6d4f56b3c?width=780',
      category: blog.category,
      title: blog.title,
      description: blog.introduction?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    }));

  return (
    <div className="min-h-screen bg-white font-poppins w-full md:w-1/2">
      {/* Header */}
      <Header />

      {/* Main Article */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-black text-4xl">{t('common.loading')}</p>
        </div>
      ) : (
        <main className="px-5 py-5 mx-auto lg:max-w-4xl">
        {/* Categories Section */}
        <section className="mb-8 px-3">
          <h2 className="text-black font-normal text-lg leading-7 mb-6">
            {t('blog.categories')}
          </h2>
          <div className="bg-white rounded-[10px] p-4">
            <span className="text-black text-lg font-semibold">
              {blog.category}
            </span>
          </div>
        </section>

        {/* Blog Content */}
        <section className="mb-8 px-3">
          {/* Featured Post */}
          <article className="bg-gray-100 rounded-[10px] overflow-hidden mb-6">
            <img
              src={blog.title_image || 'https://cdn.builder.io/api/v1/image/assets/TEMP/affbcd99d59bab2d47bfc87453dd4cc6d4f56b3c?width=780'}
              alt={blog.title}
              className="w-full h-[300px] object-cover"
            />
            <div className="p-5 space-y-4">
              <div className="inline-block bg-gray-100 px-2 py-1 rounded-[10px]">
                <span className="text-black text-sm font-medium">
                  {blog.category}
                </span>
              </div>
              <div className="space-y-4">
                <h3 className="text-black text-2xl font-bold leading-[1.3]">
                  {blog.title}
                </h3>
                <h3 className="text-black text-lg font-bold leading-[1.3]">
                  Sissejuhatus
                </h3>
                <div 
                  className="text-black text-base font-normal leading-[1.5] prose prose-base max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog.introduction }}
                />
              </div>
            </div>
          </article>

          {/* Intro Detail Section */}
          <article className="bg-gray-100 rounded-[10px] overflow-hidden mb-6">
            <div className="p-5 space-y-4">
              <h3 className="text-black text-lg font-bold leading-[1.3]">
                Sissejuhatuse detailid
              </h3>
              <div 
                className="text-black text-base font-semi leading-[1.5] prose prose-base max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.intro_detail }}
              />
            </div>
          </article>

          {/* Summary Section */}
          <article className="bg-gray-100 rounded-[10px] p-5">
            <h3 className="text-black text-lg font-bold leading-[1.3]">
              {t('uiActions.summary')}
            </h3>
            <div 
              className="text-black text-base font-normal leading-[1.5] prose prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.summary }}
            />
          </article>
        </section>
      </main>
      )}

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Latest Posts Section */}
      <section className="px-5 py-12 mx-auto lg:max-w-4xl">
        <h2 className="text-black font-semibold text-2xl leading-normal mb-8 px-3">
          {t('blog.latestPosts')}
        </h2>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-black text-4xl">{t('common.loading')}</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3 px-3">
            {recentPosts.map((post, index) => (
              <BlogCard key={post.id || index} {...post} />
            ))}
            {recentPosts.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">{t('uiActions.noOtherPostsFound')}</p>
              </div>
            )}
          </div>
        )}
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}
