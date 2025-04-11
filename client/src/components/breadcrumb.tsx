import { Link } from "wouter";

export interface BreadcrumbItem {
  id: string | number;
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <div>
              <Link href="/">
                <a className="text-gray-400 hover:text-gray-500">
                  <i className="ri-home-line"></i>
                  <span className="sr-only">Home</span>
                </a>
              </Link>
            </div>
          </li>
          
          {items.map((item, index) => (
            <li key={item.id}>
              <div className="flex items-center">
                <i className="ri-arrow-right-s-line text-gray-400 text-sm"></i>
                <Link href={item.href}>
                  <a className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                    {item.name}
                  </a>
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
