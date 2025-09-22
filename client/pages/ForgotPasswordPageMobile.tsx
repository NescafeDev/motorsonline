import Header from "@/components/mobile/Header";
import Footer from "@/components/mobile/Footer";
import ForgotPassword from "./ForgotPassword";

export default function ForgotPasswordPageMobile() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <ForgotPassword />
      </main>
      <Footer />
    </div>
  );
}
