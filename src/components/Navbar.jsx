import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser, SignOutButton } from "@clerk/clerk-react";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "About", to: "/about" },
  { name: "Services", to: "/services" },
  { name: "Contact Us", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  return (
    <nav className="sticky w-full bg-gradient-to-r from-green-500 to-green-700 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img
                src="/images/icon.png"
                alt="BeejSeBazaar"
                className="h-8 w-8"
              />
            </Link>
            <Link to="/" className="text-2xl font-extrabold text-white">
              BeejSeBazaar
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="text-white hover:text-yellow-300 font-medium transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                {link.name}
              </Link>
            ))}

            {!isSignedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1 bg-yellow-400 text-green-900 font-semibold rounded hover:bg-yellow-300 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Signup
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-white font-semibold">
                  Hi, {user.firstName}
                </span>
                <SignOutButton>
                  <button className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition duration-300 ease-in-out transform hover:scale-105">
                    Logout
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {menuOpen ? (
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-inner">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-green-700 font-medium transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                {link.name}
              </Link>
            ))}

            {!isSignedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 bg-yellow-400 text-green-900 rounded hover:bg-yellow-300 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Signup
                </Link>
              </>
            ) : (
              <div className="space-y-2">
                <span className="block text-gray-700 font-semibold">
                  Hi, {user.firstName}
                </span>
                <SignOutButton>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="block w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Logout
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
