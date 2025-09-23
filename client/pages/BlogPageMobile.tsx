import { Menu } from "lucide-react";
import { BlogCard } from "@/components/mobile/BlogCard";
import { CategoryTabs } from "@/components/mobile/CategoryTabs";
import { NewsletterSignup } from "@/components/mobile/NewsletterSignup";
import Footer from "@/components/mobile/Footer";
import Header from "@/components/mobile/Header";
import { useNavigate } from "react-router-dom";
export default function BlogPageMobile() {
  const navigate = useNavigate();
  const categories = ["Vaata kõiki", "Kategooria", "Kategooria", "Kategooria"];

  const blogPosts = [
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/affbcd99d59bab2d47bfc87453dd4cc6d4f56b3c?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/aab23df3a666925b0b0710841df323425fc18b2b?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/7ffec4824159fb77b8348e5f0f0ebd0b219bfc81?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/5584be967b379005f363421759868b7c013069c1?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/7d18a6d16bc6b87129964ba78305dc5ab4321e1a?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/230b827688f474ff811a44562a2b94452e3bc55b?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/a6dba82ec391a166b3fc87e1e19fe083f163f1cb?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
  ];

  const latestPosts = [
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/13571f7cf56492a68d841712fe14488da6cd8f64?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/0b141dad3a9c503c16e8fc83435b95a888e062f2?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/77e05888f12ec156877dc4372bc19d14b8203763?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/34fb12acf718f6417f23e5cb7f52aacd86e78213?width=780",
      category: "Kategooria",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem varius enim in eros.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
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
        <div className="relative z-10 px-5 py-20 lg:py-32 max-w-md mx-auto lg:max-w-4xl h-full flex flex-col justify-center">
          <h1 className="text-white font-semibold text-2xl lg:text-4xl xl:text-5xl leading-normal text-center mb-8">
            MotorsBlogi – Hoia end kursis viimaste auto- ja mootoriuudistega
          </h1>
          <p className="text-white text-base lg:text-lg leading-6 tracking-tight text-center max-w-lg mx-auto">
            Lorem ipsum dolor sit amet consectetur. Quisque erat imperdiet
            egestas pretium. Nibh convallis id nulla non diam.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-5 py-12 max-w-md mx-auto lg:max-w-4xl">
        {/* Categories Section */}
        <section className="mb-12 px-3">
          <h2 className="text-black font-normal text-lg leading-7 mb-6">
            Blogi kategooriad
          </h2>
          <CategoryTabs categories={categories} />
        </section>

        {/* Blog Posts Grid */}
        <section className="mb-20 px-3">
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post, index) => (
              <BlogCard key={index} {...post} />
            ))}
          </div>
        </section>
      </main>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Latest Posts Section */}
      <section className="px-5 py-12 max-w-md mx-auto lg:max-w-4xl">
        <h2 className="text-black font-semibold text-2xl leading-normal mb-8 px-3">
          Viimased postitused
        </h2>
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3 px-3">
          {latestPosts.map((post, index) => (
            <BlogCard key={index} {...post} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
