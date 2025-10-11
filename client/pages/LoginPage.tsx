import LoginForm from "../components/LoginForm";
import PageContainer from "../components/PageContainer";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <PageContainer>
      <main className="flex-1 px-6 lg:px-[100px] pb-[186px]">
        <div className="w-full max-w-[1240px] mx-auto">
          <div className="rounded-[10px] bg-brand-light overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[746px]">
              {/* Login Form Section */}
              <div className="flex-1 lg:max-w-[620px] p-6 lg:p-[40px] flex items-center">
                <LoginForm />
              </div>

              {/* Hero Image Section */}
              <div className="flex-1 lg:max-w-[620px] relative bg-gradient-to-b from-gray-600 to-gray-900 overflow-hidden">
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

                {/* Hero Text */}
                <div className="relative z-10 flex items-center justify-center h-full p-6 lg:p-12">
                  <h2 className="text-white text-center font-poppins text-3xl lg:text-[46px] font-semibold leading-normal max-w-[538px]">
                    {t('auth.chooseIdealCar')}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageContainer>
  );
}
