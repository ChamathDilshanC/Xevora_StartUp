'use client';

import { EncryptedText } from '@/components/ui/encrypted-text';
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavBody,
  NavItems,
} from '@/components/ui/resizable-navbar';
import { ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Change to true to simulate logged-in state

  const navItems = [
    { name: 'Home', link: '#home' },
    { name: 'About', link: '#about' },
    { name: 'Products', link: '#products' },
    { name: 'Catogories', link: '#catogories' },
    { name: 'Contact', link: '#contact' },
  ];

  return (
    <div className="relative min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* Navbar */}
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          {/* Logo */}
          <a
            href="#"
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
          >
            <img
              src="/Logos/AppLogo.png"
              alt="Xevora Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="font-medium text-black dark:text-white">
              Xevora
            </span>
          </a>

          {/* Navigation Items */}
          <NavItems items={navItems} />

          {/* Cart and Auth Section */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              className="relative rounded-full p-2 text-neutral-600 transition-colors duration-300 hover:bg-gray-100 hover:text-[#3b3be4] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#3b3be4]"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {/* Cart Badge - Optional */}
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#3b3be4] text-[10px] font-bold text-white">
                0
              </span>
            </button>

            {/* Register/Login Link */}
            {!isLoggedIn ? (
              <a
                href="#register"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors duration-300 hover:bg-gray-100 hover:text-[#3b3be4] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#3b3be4]"
              >
                <User className="h-4 w-4" />
                <span>Register</span>
              </a>
            ) : (
              <button className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors duration-300 hover:bg-gray-100 hover:text-[#3b3be4] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#3b3be4]">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            {/* Mobile Logo */}
            <a
              href="#"
              className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
            >
              <img
                src="/Logos/AppLogo.png"
                alt="Xevora Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="font-medium text-black dark:text-white">
                Xevora
              </span>
            </a>

            {/* Mobile Menu Toggle */}
            <MobileNavToggle
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </MobileNavHeader>

          {/* Mobile Menu */}
          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsOpen(false)}
                className="w-full text-left text-neutral-600 transition-colors duration-300 hover:text-[#3b3be4] dark:text-neutral-300 dark:hover:text-[#3b3be4]"
              >
                {item.name}
              </a>
            ))}

            {/* Mobile Cart and Auth Section */}
            <div className="flex w-full flex-col gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-700">
              {/* Cart Button */}
              <button
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-neutral-600 transition-colors duration-300 hover:bg-gray-100 hover:text-[#3b3be4] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#3b3be4]"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-medium">Cart</span>
                </div>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3b3be4] text-xs font-bold text-white">
                  0
                </span>
              </button>

              {/* Register/Login Link */}
              {!isLoggedIn ? (
                <a
                  href="#register"
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-neutral-600 transition-colors duration-300 hover:bg-gray-100 hover:text-[#3b3be4] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#3b3be4]"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Register</span>
                </a>
              ) : (
                <button
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-neutral-600 transition-colors duration-300 hover:bg-gray-100 hover:text-[#3b3be4] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#3b3be4]"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Profile</span>
                </button>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="mx-auto max-w-lg py-10 text-left">
          <EncryptedText
            text="Welcome to Xevora."
            encryptedClassName="text-neutral-500"
            revealedClassName="dark:text-white text-black"
            revealDelayMs={50}
          />
        </p>
      </div>

      {/* Dummy sections for scroll effect demonstration */}
      <div
        id="home"
        className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center"
      >
        <h2 className="text-4xl font-bold text-black dark:text-white">
          Home Section
        </h2>
      </div>

      <div
        id="about"
        className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center"
      >
        <h2 className="text-4xl font-bold text-black dark:text-white">
          About Section
        </h2>
      </div>

      <div
        id="services"
        className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center"
      >
        <h2 className="text-4xl font-bold text-black dark:text-white">
          Services Section
        </h2>
      </div>

      <div
        id="contact"
        className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center"
      >
        <h2 className="text-4xl font-bold text-black dark:text-white">
          Contact Section
        </h2>
      </div>
    </div>
  );
}
