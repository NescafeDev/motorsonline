import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface BlogCardProps {
  image: string;
  category: string;
  title: string;
  description: string;
  readMoreText?: string;
}

export function BlogCard({
  image,
  category,
  title,
  description,
  readMoreText = "Loe postitust",
}: BlogCardProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => navigate('/blog/1')}>
      <div className="aspect-[390/247] w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="text-motors-gray-500 font-medium text-base mb-4">
          {category}
        </div>
        <h3 className="text-black font-semibold text-xl leading-7 mb-4">
          {title}
        </h3>
        <p className="text-black text-base leading-normal mb-6">
          {description}
        </p>
        <div className="flex items-center gap-2" onClick={() => navigate('/blog/1')}>
          <button className="text-motors-green font-medium text-base text-[#06d6a0]" >
            {readMoreText}
          </button>
          <ArrowRight className="w-5 h-5 text-motors-green text-[#06d6a0]" onClick={() => navigate('/blog/1')}/>
        </div>
      </div>
    </div>
  );
}
