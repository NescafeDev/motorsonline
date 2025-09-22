import { useState, useRef, useEffect } from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";

export default function ForgotPassword() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(14);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to next input if value entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      // Handle form submission
      navigate('/forgot-password');
    }
  };

  const isComplete = code.every((digit) => digit !== "");

  return (
    <PageContainer>
      <div className="min-h-screen bg-brand-background flex items-center justify-center p-4">
        <div className="w-full max-w-[632px] bg-white rounded-[10px] p-6 md:p-10 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-[45px] h-[45px] flex items-center justify-center">
              <img src="/img/lock.svg" alt="lock" className="w-8 h-8" />
            </div>
            <h1 className="text-[30px] font-semibold text-brand-text leading-[150%] tracking-[-0.9px] font-['Poppins']">
              Lähtesta parool
            </h1>
          </div>

          {/* Security Illustration */}
          <div className="flex justify-center mb-8">
            <img
              src="/img/forgot_password.png"
              alt="Security illustration with lock and password reset elements"
              className="w-full max-w-[297px] h-auto"
            />
          </div>

          {/* Main Text */}
          <p className="text-brand-text font-['Poppins'] text-lg leading-[150%] tracking-[-0.54px] mb-6">
            Oleme saatnud kinnituskoodi aadressile [email]. Palun sisesta see
            kood, et jätkata.
          </p>

          {/* Warning Message */}
          <div className="bg-brand-warning-bg border border-brand-warning rounded-[14px] p-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-brand-warning flex-shrink-0 mt-0.5" />
            <p className="text-brand-warning font-['Poppins'] text-sm leading-5">
              Kui sa ei ole pikka aega aktiivne olnud, võidi sinu konto kustutada
              andmekaitse kaalutlustel.
            </p>
          </div>

          {/* Code Input */}
          <div className="flex gap-4 mb-8 justify-center flex-wrap">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-[75px] h-[75px] border border-gray-400 rounded-[11.53px] text-center text-2xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-button focus:border-transparent transition-all"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className="w-full bg-brand-button text-white font-['Poppins'] text-base leading-[150%] py-[15px] px-[30px] rounded-[10px] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            Kinnita
          </button>

          {/* Footer Text */}
          <p className="text-center text-brand-text font-['Poppins'] text-sm leading-[150%] tracking-[-0.42px] mt-6">
            Ei saanud koodi? Kontrolli oma e-posti aadressi või taotle uut{" "}
            {countdown > 0 ? `${countdown} sekundi` : ""} pärast.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
