import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ForgotPassword from "./ForgotPassword";

export default function ForgotPasswordPage() {
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
