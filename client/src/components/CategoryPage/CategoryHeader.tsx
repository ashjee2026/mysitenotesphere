import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types";

type CategoryHeaderProps = {
  categoryId: string;
};

export default function CategoryHeader({ categoryId }: CategoryHeaderProps) {
  const { data: category, isLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${categoryId}`],
  });

  const getCategoryIcon = (id: string) => {
    switch(id) {
      case 'class-10': return 'ri-book-open-line';
      case 'class-11': return 'ri-book-read-line';
      case 'class-12': return 'ri-graduation-cap-line';
      case 'jee': return 'ri-calculator-line';
      case 'neet': return 'ri-microscope-line';
      default: return 'ri-book-open-line';
    }
  };

  const getGradientClass = (id: string) => {
    return ['jee', 'neet'].includes(id) 
      ? 'from-secondary-600 to-secondary-700' 
      : 'from-primary-600 to-primary-700';
  };

  return (
    <section className={`bg-gradient-to-r ${getGradientClass(categoryId)} text-white py-12`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-10 w-1/3 bg-white/20 rounded mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-2/3"></div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="mr-6">
              <i className={`${getCategoryIcon(categoryId)} text-4xl`}></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{category?.name}</h1>
              <p className="text-white/90">{category?.description}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
