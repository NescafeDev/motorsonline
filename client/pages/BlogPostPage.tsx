import PageContainer from "@/components/PageContainer";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
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
                  <span className="text-black text-lg font-semibold">
                    Vaata kõiki
                  </span>
                </div>
                <button className="w-full text-left p-4 text-black text-lg font-normal hover:bg-motor-gray-bg rounded-[10px] transition-colors">
                  Kategooria
                </button>
                <button className="w-full text-left p-4 text-black text-lg font-normal hover:bg-motor-gray-bg rounded-[10px] transition-colors">
                  Kategooria
                </button>
                <button className="w-full text-left p-4 text-black text-lg font-normal hover:bg-motor-gray-bg rounded-[10px] transition-colors">
                  Kategooria
                </button>
                <button className="w-full text-left p-4 text-black text-lg font-normal hover:bg-motor-gray-bg rounded-[10px] transition-colors">
                  Kategooria
                </button>
              </div>
            </div>
          </aside>

          {/* Blog Posts Grid */}
          <main className="flex-1">
            {/* Featured Post */}
            <article className="bg-motor-gray-bg rounded-[10px] overflow-hidden mb-8">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd3caedfc27d707d15d02140d75fd74c1ac2a64a?width=1880"
                alt="Featured post"
                className="w-full h-[450px] object-cover rounded-[10px]"
              />
              <div className="p-5 space-y-4">
                <div className="inline-block bg-motor-gray-bg px-2 py-1 rounded-[10px]">
                  <span className="text-black text-sm font-medium">
                    Kategooria
                  </span>
                </div>
                <div className="space-y-10">
                  <h3 className="text-black text-[30px] font-bold leading-[1.3]">
                    Lorem Ipsum dolor sit amet
                  </h3>
                  <p className="text-black text-lg font-normal leading-[1.5]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros.
                  </p>
                </div>
                <div className="space-y-10">
                  <p className="text-black text-lg font-normal leading-[1.5]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros.
                  </p>
                </div>
                <div className="space-y-10">
                  <p className="text-black text-lg font-normal leading-[1.5]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros.
                  </p>
                </div>
                <div className="space-y-10">
                  <p className="text-black text-lg font-normal leading-[1.5]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros.
                  </p>
                </div>
              </div>
            </article>
            <article className="bg-motor-gray-bg rounded-[10px] overflow-hidden mb-8">
              <img
                src="/img/photo_2025-10-11_00-06-02.jpg"
                alt="Featured post"
                className="w-full h-[450px] object-cover rounded-[10px]"
              />
              <div className="p-5 space-y-4 mt-10">
                <div className="space-y-10">
                  <h3 className="text-black text-[30px] font-bold leading-[1.3]">
                    Lorem Ipsum dolor sit amet
                  </h3>
                  <p className="text-black text-lg font-normal leading-[1.5]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-black text-lg font-normal leading-[1.5]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-black text-lg font-normal leading-[1.5]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-black text-lg font-normal leading-[1.5]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros.
                  </p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-black text-[30px] font-bold leading-[1.3]">
                    Lorem Ipsum dolor sit amet
                  </h3>
                  <p className="text-black text-lg font-normal leading-[1.5]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-black text-lg font-normal leading-[1.5]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-black text-lg font-normal leading-[1.5]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-black text-lg font-normal leading-[1.5]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros.
                  </p>
                </div>
              </div>
            </article>
          </main>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full bg-motor-gray-bg py-16 mb-20 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[100px]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 max-w-[456px]">
              <h2 className="text-black text-[46px] font-semibold leading-tight mb-6">
                Liitu meie blogiga
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
                    Telli
                  </button>
              </div>
              <p className="text-black text-xs font-normal leading-[1.5]">
                Klikkides "Registreeru", kinnitate, et nõustute meie
                tingimustega.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((index) => (
              <article
                key={index}
                className="bg-motor-gray-bg rounded-[10px] overflow-hidden"
              >
                <img
                  src={`https://cdn.builder.io/api/v1/image/assets/TEMP/${
                    index === 1
                      ? "e134938a1609d8279af17796741e1cd0ca85863d"
                      : index === 2
                        ? "9ceed5be43b832dd5a5516f04f664c85ad9211d1"
                        : index === 3
                          ? "0a7aed5977339e33afe1db516cf61caf89d777f5"
                          : "c0a3377cda0da3f58a15eb97e9e17154b1770934"
                  }?width=596`}
                  alt={`Recent post ${index}`}
                  className="w-full h-[189px] object-cover"
                />
                <div className="p-5 space-y-4">
                  <div className="inline-block">
                    <span className="text-black text-xs font-medium">
                      Kategooria
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-black text-lg font-semibold leading-[1.4]">
                      Lorem Ipsum
                    </h3>
                    <p className="text-black text-sm font-normal leading-tight">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Lorem varius enim in eros.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-motor-green" onClick={() => navigate('/blog')}>
                    <span className="text-sm font-medium text-[#06d6a0]">Loe postitust</span>
                    <ArrowRight className="w-6 h-6 text-[#06d6a0]" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
