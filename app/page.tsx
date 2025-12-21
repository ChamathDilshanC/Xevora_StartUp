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
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/auth';
import { ChevronDown, LogOut, ShoppingCart, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const navItems = [
    { name: 'Home', link: '#home' },
    { name: 'About', link: '#about' },
    { name: 'Products', link: '#products' },
    { name: 'Catogories', link: '#catogories' },
    { name: 'Contact', link: '#contact' },
  ];

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      setShowProfileMenu(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* Navbar */}
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          {/* Logo */}
          <a
            href="/"
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
          <div className="relative z-20 flex items-center gap-6">
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

            {/* Register/Login Link or Profile Menu */}
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            ) : !user ? (
              <div className="relative">
                <a
                  href="/auth"
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors duration-300 hover:bg-gray-100 hover:text-[#3b3be4] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#3b3be4]"
                >
                  <User className="h-4 w-4" />
                  <span>Register</span>
                </a>
                {/* Tooltip Alert */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1,
                    duration: 1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    repeatDelay: 3,
                  }}
                  className="absolute -bottom-12 right-0 whitespace-nowrap rounded-lg bg-gradient-to-r from-[#3b3be4] to-[#5b5bff] px-3 py-1.5 text-xs font-medium text-white shadow-lg"
                >
                  <div className="relative">
                    👋 Please sign up to get started!
                    {/* Arrow pointing up */}
                    <div className="absolute -top-3 right-4 h-0 w-0 border-b-[6px] border-l-[6px] border-r-[6px] border-b-[#3b3be4] border-l-transparent border-r-transparent" />
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="relative profile-menu-container">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors duration-300 hover:bg-gray-100 hover:text-[#3b3be4] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#3b3be4]"
                >
                  {user.photoURL ? (
                    <div className="h-6 w-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={e => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0] || 'Profile'}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-neutral-900">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
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

              {/* Register/Login Link or Profile with Sign Out */}
              {!user ? (
                <a
                  href="/auth"
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-neutral-600 transition-colors duration-300 hover:bg-gray-100 hover:text-[#3b3be4] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#3b3be4]"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Register</span>
                </a>
              ) : (
                <>
                  <div className="flex w-full items-center gap-3 rounded-lg px-4 py-3 bg-gray-50 dark:bg-neutral-800">
                    {user.photoURL ? (
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="h-full w-full object-cover"
                          onError={e => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <User className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 transition-colors duration-300 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </>
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
