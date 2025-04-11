import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

type NavItem = {
  name: string;
  href: string;
};

const categories: NavItem[] = [
  { name: "Class 10th", href: "/category/class-10" },
  { name: "Class 11th", href: "/category/class-11" },
  { name: "Class 12th", href: "/category/class-12" },
  { name: "JEE", href: "/category/jee" },
  { name: "NEET", href: "/category/neet" },
];

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-primary-600 text-2xl">
              <i className="ri-book-open-line"></i>
            </span>
            <span className="font-bold text-xl text-slate-800">NoteSphere</span>
          </Link>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900"
            >
              <i className="ri-menu-line text-2xl"></i>
            </Button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`font-medium hover:text-primary-800 transition-colors ${
                  location === item.href ? "text-primary-600" : "text-slate-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center text-slate-600 font-medium hover:text-slate-900 transition-colors"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              >
                Categories <i className="ri-arrow-down-s-line ml-1"></i>
              </Button>
              {isCategoriesOpen && (
                <div 
                  className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10"
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 font-medium ${
                  location === item.href ? "text-primary-600" : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="py-2">
              <button 
                className="flex items-center justify-between w-full text-slate-600 font-medium focus:outline-none"
                onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
              >
                Categories 
                <i className={`ri-arrow-${isMobileCategoriesOpen ? 'up' : 'down'}-s-line`}></i>
              </button>
              {isMobileCategoriesOpen && (
                <div className="mt-2 pl-4 border-l-2 border-slate-100">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="block py-2 text-sm text-slate-700 hover:text-primary-600"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMobileCategoriesOpen(false);
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
