import PageContainer from "@/components/PageContainer";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { BlogSection } from "./sections/BlogSection/BlogSection";
import { BlogPost } from "./BlogPage";
import { useI18n } from "@/contexts/I18nContext";
import { slugify } from "@/lib/utils";
export default function BlogPostPage() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useI18n();
  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogPost>(null);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  
  // Scroll to top when page loads or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  useEffect(() => {
    const run = async () => {
      try {
        // fetch all blogs to resolve slug -> id
        const res = await fetch(`/api/blogs?lang=${currentLanguage}`);
        const list = await res.json();
        setAllBlogs(list);
        if (!slug) return;
        const match = list.find((b: any) => b && b.title && slugify(b.title) === slug);
        const idToFetch = match?.id;
        if (idToFetch) {
          const resBlog = await fetch(`/api/blogs/${idToFetch}?lang=${currentLanguage}`);
          const blogData = await resBlog.json();
          setBlog(blogData);
        }
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [slug, currentLanguage]);
  if (!blog) return <PageContainer className="font-poppins text-4xl text-center">{t('common.loading')}</PageContainer>;
  return (
    <PageContainer className="font-poppins">

      {/* Main Content */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-[100px] py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-[240px] flex-shrink-0">
            <div className="space-y-6">
              <h2 className="text-black text-xl font-medium">
                {t('blog.categories')}
              </h2>
              <div className="space-y-0">
                <div className="bg-motor-gray-bg rounded-[10px] p-4 pr-6 hover:bg-gray-50 transition-colors">
                  <button className="text-black text-lg font-semibold text-start">
                    {blog.category}
                  </button>
                <div>
                </div>
                </div>
                {/* 
                <div className="bg-motor-gray-bg rounded-[10px] p-4 pr-6 hover:bg-gray-50 transition-colors">
                  <button className="text-black text-start text-lg font-medium">{t('blog.testsAndDrivingExperience')}</button>
                </div>
                <div className="bg-motor-gray-bg rounded-[10px] p-4 pr-6 hover:bg-gray-50 transition-colors">
                  <button className="text-black text-start text-lg font-medium">{t('blog.technicalAndMaintenance')}</button>
                </div>
                <div className="bg-motor-gray-bg rounded-[10px] p-4 pr-6 hover:bg-gray-50 transition-colors">
                  <button className="text-black text-start text-lg font-medium">{t('blog.newsAndTrends')}</button>
                </div>
                <div className="bg-motor-gray-bg rounded-[10px] p-4 pr-6 hover:bg-gray-50 transition-colors">
                  <button className="text-black text-start text-lg font-medium">{t('blog.autoCulture')}</button>
                </div>
                <div className="bg-motor-gray-bg rounded-[10px] p-4 pr-6 hover:bg-gray-50 transition-colors">
                  <button className="text-black text-start text-lg font-medium">{t('blog.myGarage')}</button>
                </div> */}
              </div>
            </div>
          </aside>

          {/* Blog Posts Grid */}
          <main className="flex-1">
            {/* Featured Post */}
            <article className="bg-motor-gray-bg rounded-[10px] overflow-hidden mb-8">
              <img
                src={blog.title_image}
                alt="Featured post"
                className="w-full h-auto object-cover rounded-[10px]"
              />
              <div className="p-0 space-y-4 mt-5">
                <div className="inline-block bg-motor-gray-bg px-2 py-0 rounded-[10px] hover:bg-gray-50 transition-colors mt-5">
                  <div className="text-black text-[16px] font-medium p-1">
                    {blog.category}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-black text-[30px] font-bold leading-[1.3]">
                    {blog.title}
                  </h3>
                  <h3 className="text-black text-[26px] font-bold leading-[1.3]">
                    {t('blog.introduction')}
                  </h3>
                  <div 
                    className="text-black text-[18px] font-normal leading-[1.5] prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.introduction }}
                  />
                </div>
              </div>
            </article>
            <article className="bg-motor-gray-bg rounded-[10px] overflow-hidden mb-8">
              <div className="p-0 space-y-4 mt-[60px]">
                <div className="space-y-4">
                <h3 className="text-black text-[26px] font-bold leading-[1.3]">
                    {t('blog.introDetail')}
                  </h3>
                  <div 
                    className="text-black text-[18px] font-semi leading-[1.5] prose prose-lg max-w-none "
                    dangerouslySetInnerHTML={{ __html: blog.intro_detail }}
                  />
                </div>
              </div>
              <div className="p-0 space-y-4 mt-[70px]">
                <div className="space-y-2">
                  <h3 className="text-black text-[26px] font-bold leading-[1.3]">
                    {t('blog.summary')}
                  </h3>
                  <div 
                    className="text-black text-[18px] font-normal leading-[1.5] prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.summary }}
                  />
                </div>
              </div>
            </article>
          </main>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full bg-motor-gray-bg py-[100px] mb-15 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[100px]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 max-w-[456px]">
              <h2 className="text-black text-[46px] font-semibold leading-tight mb-6">
                {t('uiActions.joinOurBlog')}
              </h2>
              <p className="text-motor-dark-text text-lg font-normal leading-[1.5] tracking-tight">
                {t('blog.newsletterDescription')}
              </p>
            </div>
            <div className="w-full lg:w-[480px] space-y-4">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder={t('blog.enterEmail')}
                  className="flex-1 h-14 px-3 border border-brand-primary rounded-[10px] bg-white text-motor-medium-text text-base placeholder:text-motor-medium-text focus:outline-none focus:ring-2 focus:ring-motor-green"
                />
                <button className="px-8 py-3 bg-brand-primary rounded-[10px] h-12 text-white text-base font-normal hover:bg-brand-600 transition-colors">
                  {t('blog.subscribe')}
                </button>
              </div>
              <p className="text-black text-xs font-normal leading-[1.5]">
                {t('blog.newsletterTerms')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-[100px] py-8 mb-8">
            <BlogSection />
      </section>
    </PageContainer>
  );
}
