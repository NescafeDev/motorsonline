import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { useNavigate } from "react-router-dom";


export const BlogSection = (): JSX.Element => {
  const navigate = useNavigate();
  // Blog post data for mapping
  const blogPosts = [
    {
      image: "/img/Rectangle 34624924 (1).png",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image: "/img/Rectangle 34624924 (2).png",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image: "/img/Rectangle 34624924 (3).png",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image: "/img/Rectangle 34624924 (4).png",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
  ];

  return (
    <div className="w-full bg-white pt-[70px]">
      <section className="w-full pl-[5%] pr-[5%] mt-10 max-w-[1440px] mx-auto relative bg-white">
        <div className="mb-12">
          <h2 className="font-['Poppins',Helvetica] font-semibold text-[46px] text-black leading-normal mb-6">
            Blog
          </h2>
          <p className="font-['Poppins',Helvetica] font-normal text-secondary-500 text-lg tracking-[-0.54px] leading-[27px] max-w-[578px]">
            Lorem ipsum dolor sit amet consectetur. Quisque erat imperdiet egestas
            pretium. Nibh convallis id nulla non diam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="bg-[#f6f7f9] rounded-[10px] overflow-hidden border-none"
            >
              <div className="relative h-[189px]">
                <img
                  onClick={() => navigate('/blog/1')}
                  className="w-full h-full object-cover cursor-pointer"
                  alt="Blog post thumbnail"
                  src={post.image}
                />
              </div>
              <CardContent className="p-5">
                <div className="space-y-3">
                  <p className="font-['Poppins',Helvetica] font-medium text-black text-xs leading-[18px]">
                    {post.category}
                  </p>
                  <h3 className="font-['Poppins',Helvetica] font-semibold text-black text-lg leading-[25.2px]">
                    {post.title}
                  </h3>
                  <p className="font-['Poppins',Helvetica] font-normal text-black text-sm leading-normal">
                    {post.description}
                  </p>
                  <div className="pt-6 flex items-center cursor-pointer" onClick={() => navigate('/blog/1')}>
                    <button className="font-['Poppins',Helvetica] font-medium text-[#06d6a0] text-sm leading-[21px]">
                      Loe postitust
                    </button>
                    <ArrowRightIcon className="w-6 h-6 ml-3 text-[#06d6a0]" onClick={() => navigate('/blog/1')}/>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>

  );
};
