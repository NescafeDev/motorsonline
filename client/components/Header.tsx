import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const { logout } = useAuth();

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

  const handleLogout = () => {
    // localStorage.removeItem("user");
    // localStorage.removeItem("token");
    logout();
    setUser(null);
    navigate("/");
  };

  return (
    <header className="w-full px-6 lg:px-[100px] py-[2%] max-h-[135px]">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <svg
            onClick={() => navigate("/")}
            className="h-7 w-auto" // 28px height, auto width
            viewBox="0 0 251 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Echo Oasis Logo"
          >
            <g clipPath="url(#clip0_5_325)">
              <path
                d="M92.8652 21C91.6174 21 90.4462 20.9079 89.3438 20.7237C88.2644 20.5625 87.407 20.3476 86.7717 20.0789V15.9342C87.4836 16.2643 88.3333 16.5175 89.3132 16.7018C90.316 16.886 91.1581 16.9781 91.8547 16.9781C92.5896 16.9781 93.1408 16.955 93.5082 16.9167C93.8986 16.8783 94.09 16.7018 94.09 16.3947C94.09 16.0493 93.7532 15.7807 93.0795 15.5965C92.4059 15.4123 91.5562 15.1436 90.538 14.7982C89.2137 14.33 88.2185 13.7774 87.5678 13.1404C86.9171 12.5033 86.5879 11.5822 86.5879 10.3772C86.5879 8.92653 87.1621 7.80592 88.3027 7.0307C89.4433 6.23246 91.2423 5.83333 93.692 5.83333C94.6335 5.83333 95.5981 5.90241 96.6009 6.04824C97.6038 6.19408 98.3846 6.35526 98.9587 6.53947V10.5921C98.3463 10.3235 97.6727 10.1316 96.9378 10.0088C96.2258 9.88596 95.5675 9.82456 94.978 9.82456C94.3273 9.82456 93.7455 9.85526 93.2326 9.91667C92.7197 9.97807 92.4671 10.1546 92.4671 10.4386C92.4671 10.7686 92.7504 10.9989 93.3245 11.1447C93.914 11.2906 94.7024 11.5132 95.6823 11.8202C96.7847 12.1502 97.642 12.5033 98.2545 12.8947C98.8898 13.2862 99.3262 13.7544 99.5712 14.307C99.8391 14.8596 99.9692 15.5428 99.9692 16.364C99.9692 17.8377 99.3644 18.9814 98.1626 19.8026C96.976 20.6009 95.2153 21 92.8652 21ZM74.9673 20.693V6.14035H80.5097L80.6628 7.30702C81.2523 6.96162 82.0101 6.63925 82.9287 6.35526C83.8474 6.07127 84.7737 5.89474 85.7152 5.83333V10.1316C85.187 10.17 84.6052 10.2467 83.9699 10.3465C83.3574 10.4463 82.7527 10.5844 82.1632 10.7456C81.5891 10.8914 81.1145 11.0526 80.724 11.2368V20.693H74.9673ZM64.2654 16.7939C65.207 16.7939 65.8806 16.5252 66.2863 15.9956C66.715 15.466 66.9294 14.6064 66.9294 13.4167C66.9294 12.227 66.715 11.398 66.2863 10.8684C65.8806 10.3158 65.207 10.0395 64.2654 10.0395C63.3238 10.0395 62.6808 10.3158 62.275 10.8684C61.8693 11.398 61.6626 12.25 61.6626 13.4167C61.6626 14.5833 61.8693 15.466 62.275 15.9956C62.6808 16.5252 63.3468 16.7939 64.2654 16.7939ZM64.2654 21C61.3641 21 59.2206 20.3553 57.835 19.0658C56.4647 17.7763 55.7834 15.8958 55.7834 13.4167C55.7834 10.9375 56.48 9.08772 57.8656 7.79824C59.2512 6.48574 61.387 5.83333 64.2654 5.83333C67.1437 5.83333 69.3102 6.48574 70.6957 7.79824C72.1043 9.08772 72.8086 10.9605 72.8086 13.4167C72.8086 15.8728 72.112 17.7763 70.7264 19.0658C69.3408 20.3553 67.182 21 64.2654 21ZM50.9836 21C49.0468 21 47.6383 20.5088 46.7579 19.5263C45.8776 18.5439 45.4412 17.216 45.4412 15.5351V10.4079H43.5428V6.14035H45.4412V3.16228L51.198 1.7807V6.14035H54.5356L54.3213 10.4079H51.198V15.1053C51.198 15.7193 51.3511 16.1568 51.6573 16.4254C51.9635 16.6711 52.4304 16.7939 53.0658 16.7939C53.6553 16.7939 54.26 16.6941 54.8725 16.4868V20.3246C53.7931 20.7774 52.4917 21 50.9836 21ZM34.0656 16.7939C35.0072 16.7939 35.6809 16.5252 36.0866 15.9956C36.5153 15.466 36.7296 14.6064 36.7296 13.4167C36.7296 12.227 36.5153 11.398 36.0866 10.8684C35.6809 10.3158 35.0072 10.0395 34.0656 10.0395C33.124 10.0395 32.481 10.3158 32.0753 10.8684C31.6695 11.398 31.4629 12.25 31.4629 13.4167C31.4629 14.5833 31.6695 15.466 32.0753 15.9956C32.481 16.5252 33.147 16.7939 34.0656 16.7939ZM34.0656 21C31.1643 21 29.0208 20.3553 27.6353 19.0658C26.265 17.7763 25.5837 15.8958 25.5837 13.4167C25.5837 10.9375 26.2803 9.08772 27.6659 7.79824C29.0515 6.48574 31.1873 5.83333 34.0656 5.83333C36.944 5.83333 39.1104 6.48574 40.496 7.79824C41.9045 9.08772 42.6088 10.9605 42.6088 13.4167C42.6088 15.8728 41.9122 17.7763 40.5266 19.0658C39.141 20.3553 36.9823 21 34.0656 21ZM0 20.693V6.14035H5.32802L5.48112 7.30702C6.1165 6.87719 6.82078 6.5318 7.59396 6.26316C8.3901 5.97917 9.25513 5.83333 10.1967 5.83333C11.1383 5.83333 11.8732 5.96381 12.4014 6.23246C12.9296 6.5011 13.3583 6.88487 13.6875 7.39912C14.3382 6.93092 15.0731 6.54715 15.8922 6.26316C16.7266 5.97917 17.7065 5.83333 18.8318 5.83333C20.5236 5.83333 21.7714 6.28618 22.5675 7.18421C23.3637 8.06688 23.7617 9.41776 23.7617 11.2368V20.693H18.0969V11.9123C18.0969 11.2599 17.9667 10.7993 17.6988 10.5307C17.4309 10.2467 16.9945 10.1009 16.3821 10.1009C15.586 10.1009 14.9353 10.3849 14.4224 10.9605C14.4607 11.2292 14.4836 11.4825 14.4836 11.7281V20.693H9.15562V11.8202C9.15562 11.2292 9.0561 10.7993 8.84941 10.5307C8.64272 10.2467 8.25996 10.1009 7.68582 10.1009C7.2954 10.1009 6.9203 10.2007 6.55285 10.4079C6.1854 10.6151 5.85623 10.8607 5.57298 11.1447V20.693H0Z"
                fill="#06D6A0"
              />
              <path
                d="M181.926 12.0044H187.039V11.4825C187.039 10.9068 186.856 10.4386 186.488 10.0702C186.144 9.70175 185.516 9.51754 184.62 9.51754C183.618 9.51754 182.913 9.73246 182.508 10.1623C182.117 10.5691 181.926 11.1831 181.926 12.0044ZM185.233 21C183.541 21 182.041 20.7237 180.732 20.1711C179.445 19.5954 178.435 18.7511 177.7 17.6228C176.988 16.4945 176.628 15.1053 176.628 13.4474C176.628 11.1371 177.279 9.29496 178.588 7.92105C179.897 6.5318 181.842 5.83333 184.437 5.83333C186.802 5.83333 188.655 6.43969 189.979 7.64474C191.326 8.84978 192 10.5 192 12.5877V15.136H181.926C182.194 15.9112 182.714 16.4638 183.487 16.7939C184.261 17.1239 185.317 17.2851 186.641 17.2851C187.476 17.2851 188.318 17.216 189.152 17.0702C190.01 16.909 190.691 16.7248 191.204 16.5175V19.9868C189.772 20.6623 187.782 21 185.233 21ZM158.937 20.693V6.14035H164.326L164.48 7.24561C165.031 6.87719 165.758 6.54715 166.654 6.26316C167.572 5.97917 168.552 5.83333 169.593 5.83333C171.408 5.83333 172.74 6.28618 173.574 7.18421C174.408 8.08224 174.829 9.47917 174.829 11.3596V20.693H169.073V11.943C169.073 11.2906 168.927 10.8147 168.644 10.5307C168.361 10.2467 167.856 10.1009 167.144 10.1009C166.715 10.1009 166.263 10.2007 165.796 10.4079C165.345 10.6151 164.977 10.8607 164.694 11.1447V20.693H158.937ZM150.425 20.693V10.3465H148.312L148.802 6.14035H156.181V20.693H150.425ZM149.965 4.20614V0.0307018H156.181V4.20614H149.965ZM145.181 21C143.405 21 142.142 20.6239 141.384 19.864C140.626 19.1042 140.251 17.9221 140.251 16.3026V0H146.008V15.6579C146.008 16.1107 146.099 16.4178 146.283 16.5789C146.467 16.7248 146.75 16.7939 147.141 16.7939C147.408 16.7939 147.661 16.7708 147.906 16.7325C148.174 16.6941 148.419 16.6327 148.641 16.5482V20.386C148.113 20.5932 147.592 20.7467 147.079 20.8465C146.589 20.9463 145.954 21 145.181 21ZM121.771 20.693V6.14035H127.16L127.314 7.24561C127.865 6.87719 128.592 6.54715 129.488 6.26316C130.406 5.97917 131.386 5.83333 132.427 5.83333C134.242 5.83333 135.574 6.28618 136.408 7.18421C137.242 8.08224 137.663 9.47917 137.663 11.3596V20.693H131.907V11.943C131.907 11.2906 131.761 10.8147 131.478 10.5307C131.195 10.2467 130.69 10.1009 129.978 10.1009C129.549 10.1009 129.097 10.2007 128.63 10.4079C128.179 10.6151 127.811 10.8607 127.528 11.1447V20.693H121.771ZM111.069 16.7939C112.011 16.7939 112.685 16.5252 113.09 15.9956C113.519 15.466 113.733 14.6064 113.733 13.4167C113.733 12.227 113.519 11.398 113.09 10.8684C112.685 10.3158 112.011 10.0395 111.069 10.0395C110.128 10.0395 109.485 10.3158 109.079 10.8684C108.673 11.398 108.466 12.25 108.466 13.4167C108.466 14.5833 108.673 15.466 109.079 15.9956C109.485 16.5252 110.151 16.7939 111.069 16.7939ZM111.069 21C108.168 21 106.024 20.3553 104.639 19.0658C103.269 17.7763 102.587 15.8958 102.587 13.4167C102.587 10.9375 103.284 9.08772 104.67 7.79825C106.055 6.48575 108.191 5.83333 111.069 5.83333C113.948 5.83333 116.114 6.48575 117.5 7.79825C118.908 9.08772 119.612 10.9605 119.612 13.4167C119.612 15.8728 118.916 17.7763 117.53 19.0658C116.145 20.3553 113.986 21 111.069 21Z"
                fill="#045540"
              />
            </g>
            <defs>
              <clipPath id="clip0_5_325">
                <rect width="192" height="21" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Navigation and Actions */}
        <div className="flex items-center gap-6 xl:gap-8 2xl:gap-12">
          {/* Navigation Menu - Hidden on mobile */}
          <nav className="hidden xl:flex items-center gap-8 2xl:gap-12">
            <div className="flex items-center gap-6 2xl:gap-8">
              <a
                onClick={() => navigate("/blog")}
                className="inline-block text-black text-center font-poppins text-base font-normal leading-none whitespace-nowrap hover:text-brand-primary transition-colors cursor-pointer"
              >
                Blogi
              </a>
              <a
                onClick={() => navigate("/user")}
                className="inline-block text-black text-center font-poppins text-base font-normal leading-none whitespace-nowrap hover:text-brand-primary transition-colors cursor-pointer"
              >
                Minu kuulutused
              </a>
              {user && (
                <a
                  onClick={() => navigate("/adds")}
                  className="inline-block text-black text-center font-poppins text-base font-normal leading-none whitespace-nowrap hover:text-brand-primary transition-colors cursor-pointer"
                >
                  Lisa uus kuulutus
                </a>
              )}
            </div>
          </nav>

          {/* Language and Auth Section */}
          <div className="flex items-center gap-4 lg:gap-6 xl:gap-8">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2 lg:gap-3">
                <button className="flex h-[45px] px-3 lg:px-4 justify-center items-center gap-2 rounded-[10px] border border-brand-primary hover:bg-brand-primary hover:text-white transition-colors group">
                  <span className="text-brand-primary text-center font-poppins text-sm lg:text-base font-normal leading-none whitespace-nowrap group-hover:text-white">
                    EE
                  </span>
                </button>
              </div>
              <span className="text-black text-center font-poppins text-sm lg:text-base font-normal leading-none whitespace-nowrap uppercase">
                EN
              </span>
            </div>

            {/* Auth Buttons/User Info */}
            <div className="flex items-center gap-2 lg:gap-4">
              {user ? (
                <>
                  <span className="text-brand-primary font-poppins text-base font-semibold px-3">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex h-[45px] px-3 lg:px-5 justify-center items-center gap-2 rounded-[10px] border border-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
                  >
                    Logi välja
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="hidden sm:flex h-[45px] px-3 lg:px-5 justify-center items-center gap-2 rounded-[10px] border border-brand-primary hover:bg-brand-primary hover:text-white transition-colors group"
                  >
                    <span className="text-brand-primary text-center font-poppins text-xs lg:text-sm font-normal leading-none whitespace-nowrap group-hover:text-white">
                      Logi sisse
                    </span>
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="flex h-[45px] px-3 lg:px-5 justify-center items-center gap-2 rounded-[10px] bg-brand-primary hover:bg-opacity-90 transition-all text-white"
                  >
                    <span className="text-white text-center font-poppins text-xs lg:text-sm font-normal leading-none whitespace-nowrap">
                      Registreeru
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
