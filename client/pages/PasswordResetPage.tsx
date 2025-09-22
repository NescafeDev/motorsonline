import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PasswordReset from "./PasswordReset";

export default function PasswordResetPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <PasswordReset />
      </main>
      <Footer />
    </div>
  );
}
