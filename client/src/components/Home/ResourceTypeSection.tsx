import { useQuery } from "@tanstack/react-query";
import { ResourceType } from "@/lib/types";

export default function ResourceTypeSection() {
  const { data: resourceTypes, isLoading } = useQuery<ResourceType[]>({
    queryKey: ['/api/resource-types'],
  });

  const getIcon = (typeId: string) => {
    switch(typeId) {
      case 'textbooks': return 'ri-book-3-line';
      case 'notes': return 'ri-file-text-line';
      case 'question-banks': return 'ri-question-answer-line';
      case 'revision': return 'ri-file-list-3-line';
      default: return 'ri-file-line';
    }
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Resource Types</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Find exactly what you need with our categorized learning materials.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-4/5 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resourceTypes?.map((type) => (
              <div key={type.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full">
                  <i className={`${getIcon(type.id)} text-2xl`}></i>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{type.name}</h3>
                <p className="text-slate-600 text-sm">{type.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
