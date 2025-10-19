import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { useI18n } from "@/contexts/I18nContext";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { currentLanguage , t } = useI18n();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/${currentLanguage}/forgot-password`);
  };

  return (
    <PageContainer>
      <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-[632px] bg-[#F6F7F9] rounded-[10px] p-10 lg:p-0">
          <div className="lg:p-10">
            {/* Header */}
            <div className="flex items-start gap-4 mb-16">
              <svg
                className="w-[45px] h-[45px] flex-shrink-0 mt-1"
                viewBox="0 0 45 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.7838 20.625H26.2162C27.27 20.625 28.125 21.4556 28.125 22.4813V28.1456C28.125 29.1713 27.27 30.0019 26.2162 30.0019H18.7838C17.73 30 16.875 29.1694 16.875 28.1438V22.4813C16.875 21.4556 17.73 20.625 18.7838 20.625V20.625Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.3425 20.625V18.1575C19.3425 16.4138 20.7562 15 22.5 15C24.2437 15 25.6575 16.4138 25.6575 18.1575V20.625"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.8725 35.9906C14.7975 38.2987 18.4837 39.6862 22.5 39.6862C31.9931 39.6862 39.6881 31.9912 39.6881 22.4981C39.6881 19.9781 39.1331 17.5912 38.1581 15.435L34.5319 19.0612"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M33.1275 9.00937C30.2006 6.70125 26.5163 5.31187 22.5 5.31187C13.0069 5.31187 5.31189 13.0069 5.31189 22.5C5.31189 25.02 5.86689 27.4069 6.84189 29.5631L10.4681 25.9369"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h1 className="text-[#1A202C] text-2xl lg:text-[30px] font-semibold leading-[1.5] tracking-[-0.9px]">
                {t('auth.resetPassword')}
              </h1>
            </div>

            {/* Security Image */}
            <div className="flex justify-center mb-16">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/be4f698d2ced3dfffc8d603ef8a0b5cdcf7b032d?width=594"
                alt="Security illustration"
                className="w-full max-w-[297px] h-auto aspect-[99/71] object-contain"
              />
            </div>

            {/* Description */}
            <p className="text-[#1A202C] text-lg font-normal leading-[1.5] tracking-[-0.54px] mb-6">
              {t('auth.resetPasswordDescription')}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-black text-lg font-medium"
                >
                  {t('auth.emailAddress')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  className="w-full h-[57px] px-5 py-4 border border-[#555555] rounded-[10px] bg-white text-base font-normal text-black placeholder-[#BFBFBF] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-[54px] px-8 py-4 bg-brand-primary hover:bg-brand-600 transition-colors rounded-[10px] text-white text-base font-normal flex items-center justify-center"
              >
                {t('auth.sendVerificationCode')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
