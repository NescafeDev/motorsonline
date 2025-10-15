import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { useNavigate , useParams } from "react-router-dom";
import { useEffect, useState } from 'react'
import axios from "axios";
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
  image?: string;
  category: string;
  title: string;
  introduction: string;
  id?: number;
}

export const BlogSection = (): JSX.Element => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, currentLanguage } = useI18n();
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
    image: blog.title_image,
    id: blog.id
  }));

  return (
    <div className="w-full bg-white pt-8">
      <section className="w-full pl-[2%] pr-[2%] mt-3 max-w-[1440px] mx-auto relative bg-white">
        <div className="mb-4">
          <h2 className="font-['Poppins',Helvetica] font-semibold text-[46px] text-black leading-normal mb-6">
            {t('blog.latestPosts')}
          </h2>
          <p className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] max-w-[578px]">
            {t('blog.description')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">{t('common.loading')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            {blogPosts.map((post, index) => (
              <Card
                key={post.id || index}
                className="bg-[#f6f7f9] rounded-[10px] overflow-hidden border-none h-full flex flex-col"
              >
                <div className="relative h-[189px]">
                  <img
                    onClick={() => {navigate(`/${currentLanguage}/blog/${post.id}`); window.scrollTo(0, 0);}}
                    className="w-full h-full object-fit cursor-pointer"
                    alt={t('blog.thumbnailAlt')}
                    src={post.image || 'https://via.placeholder.com/300x189?text=No+Image'}
                  />
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="space-y-3 flex-1 flex flex-col">
                    <p className="font-['Poppins',Helvetica] font-medium text-black text-xs leading-[18px]">
                      {post.category || t('blog.category')}
                    </p>
                    <h3 className="font-['Poppins',Helvetica] font-semibold text-black text-lg leading-[25.2px]">
                      {post.title || t('blog.fallbackTitle')}
                    </h3>
                    <div 
                      className="font-['Poppins',Helvetica] font-normal text-black text-sm leading-normal flex-1"
                      dangerouslySetInnerHTML={{ 
                        __html: post.introduction?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || t('blog.fallbackDescription')
                      }}
                    />
                    <div className="pt-6 flex items-center cursor-pointer mt-auto pb-2" onClick={() => navigate(`/${currentLanguage}/blog/${post.id}`)}>
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
                <p className="text-gray-500">{t('blog.noPosts')}</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>

  );
};
