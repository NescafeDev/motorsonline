import Header from "@/components/mobile/Header";
import LoginForm from "../components/LoginForm";
import Footer from "@/components/mobile/Footer";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

export default function LoginPageMobile() {
  const navigate = useNavigate();
  const { t } = useI18n();
  
  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      {/* Header */}
      <Header />

      {/* Main Content - Mobile optimized */}
      <main className="flex-1 px-4 pb-8">
        <div className="w-full mx-auto">
          <div className="rounded-[10px] bg-brand-light overflow-hidden">
            <div className="flex flex-col min-h-[600px]">
              {/* Hero Image Section - Smaller on mobile */}
              <div className="h-[200px] relative bg-gradient-to-b from-gray-600 to-gray-900 overflow-hidden">
                {/* Hero Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('/img/login.png')`,
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40"></div>
                </div>

                {/* Hero Text - Mobile optimized */}
                <div className="relative z-10 flex items-center justify-center h-full p-4">
                  <h2 className="text-white text-center font-poppins text-xl font-semibold leading-normal">
                    {t('auth.chooseIdealCar')}
                  </h2>
                </div>
              </div>

              {/* Login Form Section - Full width on mobile */}
              <div className="flex-1 p-4 flex items-center justify-center">
                <div className="w-full">
                  <LoginForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
} 