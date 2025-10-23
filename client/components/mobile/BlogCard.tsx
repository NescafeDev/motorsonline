import { ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { slugify } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";
interface BlogCardProps {
  image: string;
  category: string;
  title: string;
  description: string;
  id: number;
}

export function BlogCard({
  image,
  category,
  title,
  description,
  id,
}: BlogCardProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { lang } = useParams<{ lang: string }>();
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
          {category}
        </div>
        <h3 className="text-black font-semibold text-xl leading-7 break-all">
          {title}
        </h3>
        <p className="text-black text-base leading-normal mb-6 break-all">
          {description}
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
