import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Category } from "@/lib/types";

export default function CategorySection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const getCategoryIcon = (categoryId: string) => {
    switch(categoryId) {
      case 'class-10': return 'ri-book-open-line';
      case 'class-11': return 'ri-book-read-line';
      case 'class-12': return 'ri-graduation-cap-line';
      case 'jee': return 'ri-calculator-line';
      case 'neet': return 'ri-microscope-line';
      default: return 'ri-book-open-line';
    }
  };

  const getIconClass = (categoryId: string) => {
    return ['jee', 'neet'].includes(categoryId) 
      ? 'bg-secondary-500/10 text-secondary-500' 
      : 'bg-primary-500/10 text-primary-500';
  };

  const getLinkClass = (categoryId: string) => {
    return ['jee', 'neet'].includes(categoryId) 
      ? 'text-secondary-600 hover:text-secondary-700' 
      : 'text-primary-600 hover:text-primary-700';
  };

  return (
    <section id="categories" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Educational Categories</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Choose your class or exam to find relevant study materials, textbooks, question banks, and more.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories?.map((category) => (
              <div 
                key={category.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 duration-300"
              >
                <div className={`h-32 ${getIconClass(category.id)} flex items-center justify-center`}>
                  <i className={`${getCategoryIcon(category.id)} text-5xl`}></i>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{category.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{category.description}</p>
                  <Link href={`/category/${category.id}`}>
                    <a className={`inline-flex items-center font-medium ${getLinkClass(category.id)}`}>
                      Explore Resources <i className="ri-arrow-right-line ml-1"></i>
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
