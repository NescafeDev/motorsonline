import { ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import slugify from "slugify";
import { useEffect, useState } from "react";
interface BlogCardProps {
  image: string;
  category: string;
  title: string;
  introduction: string;
  id: number;
}

export function BlogCard({
  image,
  category,
  title,
  introduction,
  id,
}: BlogCardProps) {
  const navigate = useNavigate();
  const { t , currentLanguage} = useI18n();
  const [blogs, setBlogs] = useState<BlogCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useParams<{ lang: string }>();
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`/api/blogs?lang=${lang || 'ee'}`);
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [lang]);
  return (
    <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => navigate(`/${lang || 'ee'}/blog/${slugify(title)}`)}>
      <div className="aspect-[390/247] w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="text-motors-gray-500 font-medium text-base">
          {blogs.find(blog => blog.id === id)?.category || category}
        </div>
        <h3 className="text-black font-semibold text-xl leading-7 break-all">
          {blogs.find(blog => blog.id === id)?.title || title}
        </h3>
        <p className="text-black text-base leading-normal mb-6 break-all">
          {blogs.find(blog => blog.id === id)?.introduction || introduction}
        </p>
        <div className="flex items-center gap-2" onClick={() => navigate(`/${lang || 'ee'}/blog/${slugify(title)}`)}>
          <button className="text-motors-green font-medium text-base text-[#06d6a0]" >
            {t('blog.readMore')}
          </button>
          <ArrowRight className="w-5 h-5 text-motors-green text-[#06d6a0]" onClick={() => navigate(`/${lang || 'ee'}/blog/${slugify(title)}`)}/>
        </div>
      </div>
    </div>
  );
}
