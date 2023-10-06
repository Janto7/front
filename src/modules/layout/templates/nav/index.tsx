"use client"

import { useMobileMenu } from "@lib/context/mobile-menu-context";
import Hamburger from "@modules/common/components/hamburger";
import CartDropdown from "@modules/layout/components/cart-dropdown";
import DropdownMenu from "@modules/layout/components/dropdown-menu";
import MobileMenu from "@modules/mobile-menu/templates";
import DesktopSearchModal from "@modules/search/templates/desktop-search-modal";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";

const Nav = () => {
  // Getting the function to toggle the mobile menu
  const { toggle } = useMobileMenu();

  return (
    <div className={clsx("sticky top-0 inset-x-0 z-50 group")}>
      <header
        className={clsx(
          "relative h-16 px-8 mx-auto transition-colors bg-white border-b border-gray-200 duration-200"
        )}
      >
        <nav
          className={clsx(
            "text-gray-900 flex items-center justify-between w-full h-full text-small-regular transition-colors duration-200"
          )}
        >
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="block small:hidden">
              <Hamburger setOpen={toggle} />
            </div>
            <div className="hidden small:block h-full">
              <DropdownMenu />
            </div>
          </div>

          <div className="flex items-center h-full">
            <Link href="/" className="text-xl-semi uppercase">
              My Umbrella
            </Link>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {process.env.FEATURE_SEARCH_ENABLED && <DesktopSearchModal />}
              <Link href="/account">Account</Link>
            </div>
            <CartDropdown />
          </div>
        </nav>
        <MobileMenu />
      </header>
    </div>
  );
};

export default Nav;