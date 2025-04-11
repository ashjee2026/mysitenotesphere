import { Link } from "wouter";

const categories = [
  { name: "Class 10th", href: "/category/class-10" },
  { name: "Class 11th", href: "/category/class-11" },
  { name: "Class 12th", href: "/category/class-12" },
  { name: "JEE", href: "/category/jee" },
  { name: "NEET", href: "/category/neet" },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Resources", href: "/#categories" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-white text-2xl"><i className="ri-book-open-line"></i></span>
              <span className="font-bold text-xl">NoteSphere</span>
            </Link>
            <p className="text-slate-400 text-sm mb-4">Your ultimate resource for free educational materials.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="ri-twitter-fill text-lg"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="ri-instagram-fill text-lg"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="ri-youtube-fill text-lg"></i>
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link href={category.href} className="text-slate-400 hover:text-white transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start">
                <i className="ri-mail-line mr-2 mt-1"></i>
                <span>support@notesphere.edu</span>
              </li>
              <li className="flex items-start">
                <i className="ri-phone-line mr-2 mt-1"></i>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start">
                <i className="ri-map-pin-line mr-2 mt-1"></i>
                <span>123 Education Street, Learning Hub, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-slate-700 text-center">
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} NoteSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
