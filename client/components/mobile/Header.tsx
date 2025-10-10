import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function DesktopNav({ onNavigate, user, logout }: { onNavigate?: () => void; user: { name: string } | null; logout: () => void }) {
  const navigate = useNavigate();
  
  return (
    <>
      <nav className="flex items-center gap-8">
        <a
          onClick={() => {
            navigate("/blog");
            onNavigate && onNavigate();
          }}
          className="text-black font-poppins text-lg font-normal leading-[140%] hover:text-motors-green transition-colors cursor-pointer"
        >
          Lorem ipsum
        </a>
        <a
          onClick={() => {
            navigate("/user");
            onNavigate && onNavigate();
          }}
          className="text-black font-poppins text-lg font-normal leading-[140%] hover:text-motors-green transition-colors cursor-pointer"
        >
          Lorem ipsum
        </a>
        {user && (
          <a
            onClick={() => {
              navigate("/adds");
              onNavigate && onNavigate();
            }}
            className="text-black font-poppins text-lg font-normal leading-[140%] hover:text-motors-green transition-colors cursor-pointer"
          >
            Lorem ipsum
          </a>
        )}
      </nav>
      {/* Language Switch */}
      <div className="flex items-center gap-4">
        <button className="flex h-10 px-4 justify-center items-center rounded-lg border border-motors-green hover:bg-motors-green hover:text-white transition-colors">
          <span className="text-motors-green font-poppins text-lg font-normal uppercase">
            EE
          </span>
        </button>
        <span className="text-black font-poppins text-lg font-normal uppercase">
          EN
        </span>
      </div>
      {/* Auth Buttons */}
      <div className="flex items-center gap-2">
        {user ? (
          <button
            onClick={() => {
              logout();
              onNavigate && onNavigate();
            }}
            className="h-10 px-5 flex items-center rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition-colors"
          >
            Logi välja
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                navigate("/login");
                onNavigate && onNavigate();
              }}
              className="h-10 px-5 flex items-center rounded-lg border border-motors-green text-motors-green hover:bg-motors-green hover:text-white transition-colors"
            >
              Logi sisse
            </button>
            <button
              onClick={() => {
                navigate("/register");
                onNavigate && onNavigate();
              }}
              className="h-10 px-5 flex items-center rounded-lg bg-motors-green text-white hover:bg-opacity-90 transition-all"
            >
              Registreeru
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const { logout } = useAuth();
  
  // Check user state on component mount and when localStorage changes
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;

    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="flex items-center justify-between px-5 py-5 md:py-7 bg-white w-full max-w-7xl mx-auto border-b border-gray-100 relative">
      <div className="flex-shrink-0">
        <img
          src="/img/logo.svg"
          alt="Echo Oasis Logo"
          className="h-4 w-auto cursor-pointer pl-[20px]"
          onClick={() => navigate("/")}
        />
      </div>
      {/* Desktop Nav */}
      <div className="hidden xl:flex items-center gap-8">
        <DesktopNav user={user} logout={logout} />
      </div>
      {/* Hamburger for mobile */}
      <button
        ref={menuBtnRef}
        className="p-2 xl:hidden"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <Menu className="h-6 w-6 text-motors-dark" />
      </button>
      {/* Mobile Dropdown Nav */}
      {menuOpen && (
        <>
          {/* Blurred Overlay */}
          <div
            className="fixed inset-0 z-40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          {/* Dropdown below header, full width */}
          <div
            ref={dropdownRef}
            className="fixed left-0 right-0 top-[72px] z-50 xl:hidden flex flex-col bg-white shadow-2xl border-t border-gray-100 px-4 pt-6 pb-4 w-full min-h-[calc(100vh-72px)]"
          >
            <div className="row flex">
              <div className="col-6 flex w-full">
                {/* Menu Items */}
                <nav className="flex flex-col gap-6 mb-8">
                  <span
                    onClick={() => {
                      navigate("/blog");
                      setMenuOpen(false);
                    }}
                    className="text-lg font-normal cursor-pointer whitespace-nowrap truncate text-left"
                  >
                    Blogi
                  </span>
                  <span
                    onClick={() => {
                      navigate("/user");
                      setMenuOpen(false);
                    }}
                    className="text-lg font-normal cursor-pointer whitespace-nowrap truncate text-left"
                  >
                    Minu kuulutused
                  </span>
                  {user && (
                    <a
                      onClick={() => navigate("/adds")}
                      className="text-lg font-normal cursor-pointer whitespace-nowrap truncate text-left"
                    >
                      Lisa uus kuulutus
                    </a>
                  )}
                  {/* Language Switch */}
                </nav>
              </div>
              <div className="col-6 flex w-full relative">
                <div className="absolute top-0 right-0 flex items-center gap-3 mt-1 mr-1">
                  <button className="border border-brand-primary text-brand-primary rounded-lg px-4 py-1 font-medium bg-white">
                    EE
                  </button>
                  <span className="text-motors-dark font-medium">EN</span>
                </div>
              </div>
            </div>

            {/* Spacer to push buttons to bottom */}
            <div className="flex-1" />
            {/* Auth Buttons */}
            <div className="flex flex-col gap-4 w-full">
              {user ? (
                // Show logout button when user is logged in
                <button
                  onClick={() => {
                    logout();
                    setUser(null);
                    setMenuOpen(false);
                    navigate("/");
                  }}
                  className="w-full border border-brand-primary text-brand-primary rounded-lg py-3 mb-12 font-medium bg-white whitespace-nowrap truncate"
                >
                  Logi välja
                </button>
              ) : (
                // Show login/register buttons when user is not logged in
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="w-full border border-brand-primary text-brand-primary rounded-lg py-3 font-medium bg-white whitespace-nowrap truncate"
                  >
                    Logi sisse
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setMenuOpen(false);
                    }}
                    className="w-full bg-brand-primary text-white rounded-lg py-3 font-medium whitespace-nowrap truncate mb-12"
                  >
                    Registreeru
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
