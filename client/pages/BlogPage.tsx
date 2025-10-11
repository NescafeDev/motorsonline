import { ArrowRight } from "lucide-react";
import PageContainer from "../components/PageContainer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react'
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { ArrowRightIcon } from "lucide-react";
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

export interface BlogPost {
  title_image?: string;
  category: string;
  title: string;
  introduction: string;
  id?: number;
  intro_image?: string;
  intro_detail?: string;
  summary?: string;
  loading?: boolean;
}

export default function BlogPage() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useI18n();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, [currentLanguage]);

  // Convert blogs to BlogPost format for display
  const blogPosts: BlogPost[] = blogs.map(blog => ({
    category: blog.category,
    title: blog.title,
    introduction: blog.introduction,
    title_image: blog.title_image,
    id: blog.id,
    intro_image: blog.intro_image,
    intro_detail: blog.intro_detail,
    summary: blog.summary,
    loading: loading,
  }));

  return (
    <PageContainer className="font-poppins">
      {/* Hero Section */}
      <section className="relative w-full h-[696px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={'https://cdn.builder.io/api/v1/image/assets/TEMP/2256f5dfb72d1770637f2f4590612ed3d96be898?width=2880'}
            alt="Featured post"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-[100px] h-full flex items-center justify-center">
          <div className="text-center max-w-[877px]">
            <h1 className="text-white text-[46px] font-semibold leading-tight mb-6">
              MotorsBlogi – Hoia end kursis viimaste auto- ja mootoriuudistega
            </h1>
            <p className="text-white text-lg font-normal leading-[1.5] max-w-[624px] mx-auto">
              Lorem ipsum dolor sit amet consectetur. Quisque erat imperdiet
              egestas pretium. Nibh convallis id nulla non diam.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-[100px] py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-[240px] flex-shrink-0">
            <div className="space-y-6">
              <h2 className="text-black text-xl font-medium">
                Blogi kategooriad
              </h2>
              <div className="space-y-0">
                <div className="bg-motor-gray-bg rounded-[10px] p-4">
                    {blogs.map((blog) => (
                      <div className="w-full text-left p-2 text-black text-lg font-normal hover:bg-motor-gray-bg rounded-[10px] transition-colors">
                        {blog.category}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Blog Posts Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <p className="text-black text-4xl">{t('common.loading')}</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* All Blog Posts - Show all blogs */}
                {blogs.map((blog, index) => (
                  <article
                    key={blog.id}
                    className="bg-motor-gray-bg rounded-[10px] overflow-hidden mb-8 cursor-pointer"
                    onClick={() => navigate(`/${currentLanguage}/blog/${blog.id}`)}
                  >
                    <img
                      src={blog.title_image || 'https://cdn.builder.io/api/v1/image/assets/TEMP/2256f5dfb72d1770637f2f4590612ed3d96be898?width=2880'}
                      alt={blog.title}
                      className="w-full h-[450px] object-cover"
                    />
                    <div className="p-5 space-y-4">
                      <div className="inline-block bg-motor-gray-bg px-2 py-1 rounded-[10px]">
                        <span className="text-black text-sm font-medium">
                          {blog.category}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-black text-[30px] font-bold leading-[1.3]">
                          {blog.title}
                        </h3>
                        <div 
                          className="text-black text-lg font-normal leading-[1.5]"
                          dangerouslySetInnerHTML={{ 
                            __html: blog.introduction?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-3 text-[#06d6a0]">
                        <button className="text-base font-medium">{t('blog.readMore')}</button>
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </div>
                  </article>
                ))}
                {/* All Blog Posts Grid */}
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full bg-motor-gray-bg py-[100px] mb-20 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[100px]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 max-w-[456px]">
              <h2 className="text-black text-[46px] font-semibold leading-tight mb-6">
                {t('uiActions.joinOurBlog')}
              </h2>
              <p className="text-motor-dark-text text-lg font-normal leading-[1.5]">
                Lorem ipsum dolor sit amet consectetur. Sollicitudin interdum
                scelerisque mattis semper diam turpis a.
              </p>
            </div>
            <div className="w-full lg:w-[480px] space-y-4">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Sisesta oma e-post"
                  className="flex-1 h-[54px] px-3 border border-brand-primary rounded-[10px] bg-white text-motor-medium-text text-base placeholder:text-motor-medium-text focus:outline-none focus:ring-2 focus:ring-motor-green"
                />
                  <button className="px-8 py-3 bg-brand-primary rounded-[10px] text-white text-base font-normal hover:bg-brand-600 transition-colors">
                    {t('blog.subscribe')}
                  </button>
              </div>
              <p className="text-black text-xs font-normal leading-[1.5]">
                {t('uiActions.clickingRegisterConfirm')} tingimustega.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-[100px] py-16">
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-black text-[46px] font-semibold leading-tight">
              Viimased postitused
            </h2>
            <p className="text-motor-dark-text text-lg font-normal leading-[1.5] max-w-[578px]">
              Lorem ipsum dolor sit amet consectetur. Quisque erat imperdiet
              egestas pretium. Nibh convallis id nulla non diam.
            </p>
          </div>

          {/* Recent Posts Grid */}
          {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">{t('common.loading')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            {blogPosts.map((post, index) => (
              <Card
                key={post.id || index}
                className="bg-[#f6f7f9] rounded-[10px] overflow-hidden border-none"
              >
                <div className="relative h-[189px]">
                  <img
                    onClick={() => navigate(`/${currentLanguage}/blog/${post.id}`)}
                    className="w-full h-full object-cover cursor-pointer"
                    alt="Blog post thumbnail"
                    src={post.title_image || 'https://via.placeholder.com/300x189?text=No+Image'}
                  />
                </div>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <p className="font-['Poppins',Helvetica] font-medium text-black text-xs leading-[18px]">
                      {post.category || 'Kategooria'}
                    </p>
                    <h3 className="font-['Poppins',Helvetica] font-semibold text-black text-lg leading-[25.2px]">
                      {post.title || 'Lorem Ipsum'}
                    </h3>
                    <div 
                      className="font-['Poppins',Helvetica] font-normal text-black text-sm leading-normal"
                      dangerouslySetInnerHTML={{ 
                        __html: post.introduction?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                      }}
                    />
                    <div className="pt-6 flex items-center cursor-pointer" onClick={() => navigate(`/${currentLanguage}/blog/${post.id}`)}>
                      <button className="font-['Poppins',Helvetica] font-medium text-[#06d6a0] text-sm leading-[21px]">
                        {t('blog.readMore')}
                      </button>
                      <ArrowRightIcon className="w-6 h-6 ml-3 text-[#06d6a0]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {blogPosts.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">{t('uiActions.noBlogPostsFound')}</p>
              </div>
            )}
          </div>
        )}
        </div>
      </section>
    </PageContainer>
  );
}
