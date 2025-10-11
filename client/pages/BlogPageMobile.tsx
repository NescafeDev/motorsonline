import { Menu } from "lucide-react";
import { BlogCard } from "@/components/mobile/BlogCard";
import { CategoryTabs } from "@/components/mobile/CategoryTabs";
import { NewsletterSignup } from "@/components/mobile/NewsletterSignup";
import Footer from "@/components/mobile/Footer";
import Header from "@/components/mobile/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useI18n } from "@/contexts/I18nContext";

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

export default function BlogPageMobile() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Convert blogs to BlogCard format
  const blogPosts = blogs.map(blog => ({
    id: blog.id,
    image: blog.title_image || 'https://cdn.builder.io/api/v1/image/assets/TEMP/affbcd99d59bab2d47bfc87453dd4cc6d4f56b3c?width=780',
    category: blog.category,
    title: blog.title,
    description: blog.introduction?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  }));

  // Get unique categories for tabs
  const categories = [t('uiActions.viewAll'), ...Array.from(new Set(blogs.map(blog => blog.category)))];

  // Latest posts (same as blogPosts for now, but you can modify this logic)
  const latestPosts = blogPosts;

  return (
    <div className="min-h-screen bg-white w-full md:w-1/2">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative h-[520px] lg:h-[600px] bg-black overflow-hidden">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7ed2a283d847338520aa2eb13fa0b969d5ccdedf?width=2314"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 px-5 py-20 lg:py-32 mx-aut0 h-full flex flex-col justify-center">
          <h1 className="text-white font-semibold text-2xl lg:text-4xl xl:text-5xl leading-normal text-center mb-8">
            {t('blog.stayUpdated')}
          </h1>
          <p className="text-white text-base lg:text-lg leading-6 tracking-tight text-center max-w-lg mx-auto">
            {t('blog.description')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-5 py-12 mx-auto lg:max-w-4xl">
        {/* Categories Section */}
        <section className="mb-12 px-3">
          <h2 className="text-black font-normal text-lg leading-7 mb-6">
            {t('blog.categories')}
          </h2>
          {/* <CategoryTabs categories={categories} /> */}
        </section>

        {/* Blog Posts Grid */}
        <section className="mb-20 px-3">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-black text-4xl">{t('common.loading')}</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {blogPosts.map((post, index) => (
                <BlogCard key={post.id || index} {...post} />
              ))}
              {blogPosts.length === 0 && !loading && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">{t('uiActions.noBlogPostsFound')}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

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
            {latestPosts.map((post, index) => (
              <BlogCard key={post.id || index} {...post} />
            ))}
            {latestPosts.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Blogisid ei leitud.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
