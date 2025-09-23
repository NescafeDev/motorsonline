import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup logic here

    setEmail("");
  };

  return (
    <div className="bg-motors-gray-50 py-12 px-5">
      <div className="max-w-md mx-auto px-3">
        <h2 className="text-black font-semibold text-2xl leading-normal mb-6">
          Liitu meie blogiga
        </h2>
        <p className="text-motors-dark-secondary text-base leading-6 tracking-tight mb-8">
          Lorem ipsum dolor sit amet consectetur. Sollicitudin interdum
          scelerisque mattis semper diam turpis a.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Sisesta oma e-post"
              className="w-full h-11 px-3 py-2 rounded-lg border border-[#06d6a0] bg-white text-motors-gray-500 text-sm placeholder:text-motors-gray-500 focus:outline-none focus:ring-2 focus:ring-motors-green focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-primary text-white font-normal text-base leading-6 py-3 px-8 rounded-lg hover:bg-motors-green-dark transition-colors duration-200"
          >
            Telli
          </button>
          <p className="text-black text-xs leading-5 text-center">
            Klikkides "Registreeru", kinnitate, et nõustute meie tingimustega.
          </p>
        </form>
      </div>
    </div>
  );
}
