import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { ResourceFile } from "@/lib/types";
import { Link } from "wouter";

export default function FeaturedResources() {
  const { data: featuredResources, isLoading } = useQuery<ResourceFile[]>({
    queryKey: ['/api/resources/featured'],
  });

  const handleDownload = async (id: number) => {
    try {
      const response = await apiRequest('GET', `/api/resources/${id}/download`, undefined);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = id.toString();
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getCategoryBadgeClasses = (categoryId: string) => {
    return ['jee', 'neet'].includes(categoryId) 
      ? 'bg-purple-100 text-secondary-700' 
      : 'bg-blue-100 text-primary-700';
  };

  const getButtonVariant = (categoryId: string) => {
    return ['jee', 'neet'].includes(categoryId) ? 'secondary2' : 'primary';
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Featured Resources</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Popular and recently added learning materials that students find most helpful.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <div className="w-1/3 h-5 bg-gray-200 rounded mb-3"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    <div className="w-24 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources?.map((resource) => (
              <div key={resource.id} className="pdf-card bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryBadgeClasses(resource.categoryId)} mb-2`}>
                        {resource.categoryName}
                      </span>
                      <h3 className="text-lg font-semibold text-slate-800">{resource.title}</h3>
                    </div>
                    <span className="text-xs text-slate-500">PDF • {resource.fileSize}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Updated: {resource.updatedAt}</span>
                    <Button
                      variant={getButtonVariant(resource.categoryId)}
                      className="inline-flex items-center text-sm bg-black text-white hover:bg-black/90 shadow-sm"
                      onClick={() => handleDownload(resource.id)}
                    >
                      <i className="ri-download-line mr-1 download-icon"></i> Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/resources">
            <a className="inline-flex items-center text-primary-600 font-medium text-lg hover:text-primary-700">
              View All Resources <i className="ri-arrow-right-line ml-1"></i>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
