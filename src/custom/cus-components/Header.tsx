"use client";

import { useEffect, useState } from "react";
import { UseSiteContext } from "@/SiteContext/SiteContext";
import dynamic from "next/dynamic";

export const headerFlags = {
  SHOW_LANGUAGE_SWITCHER: process.env.NEXT_PUBLIC_SHOW_LANGUAGE_SWITCHER === "1",
  SHOW_LOGIN_BUTTON: process.env.NEXT_PUBLIC_SHOW_LOGIN_BUTTON === "1",
};

const FaBars = dynamic(
  () => import("react-icons/fa6").then((mod) => mod.FaBars),
  { ssr: false }
);

import Navbar from "@/components/level-2/Navbar";
import Login from "../../components/buttons/Login";
import { LanguageSwitcher } from "../../languages/LanguageSwitcher";

// import { headerFlags } from "@/config/headerFlags"; // ✅ import flags

const Header = () => {
  const { bargerMenuToggle } = UseSiteContext();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <header className="w-full fixed top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-3 px-6 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => bargerMenuToggle(false)}
            className="lg:hidden p-2 rounded-md header-toggle-hover"
            aria-label="Toggle menu"
          >
            <FaBars size={28} />
          </button>

          {/* Navigation */}
          <Navbar />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {headerFlags.SHOW_LANGUAGE_SWITCHER && <LanguageSwitcher />}
          {headerFlags.SHOW_LOGIN_BUTTON && <Login />}
        </div>
      </div>
    </header>
  );
};

export default Header;
