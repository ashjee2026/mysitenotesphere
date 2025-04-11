import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-1 rounded-md">
                <i className="fas fa-book-open"></i>
              </div>
              <span className="font-bold text-lg text-primary">NoteSphere</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Empowering education through accessible resources</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Resources</h3>
              <ul className="text-sm text-gray-500 space-y-1">
                <li><Link href="/"><a className="hover:text-primary">All Classes</a></Link></li>
                <li><a href="#" className="hover:text-primary">JEE Resources</a></li>
                <li><a href="#" className="hover:text-primary">NEET Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Support</h3>
              <ul className="text-sm text-gray-500 space-y-1">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">Feedback</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Legal</h3>
              <ul className="text-sm text-gray-500 space-y-1">
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Copyright Notice</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} NoteSphere. All rights reserved.</p>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
