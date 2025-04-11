import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { ResourceFile } from "@/lib/types";

export default function RecentlyAdded() {
  const { data: recentResources, isLoading } = useQuery<ResourceFile[]>({
    queryKey: ['/api/resources/recent'],
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

  const getButtonVariant = (categoryId: string) => {
    return ['jee', 'neet'].includes(categoryId) ? 'secondary2' : 'primary';
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Recently Added</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Stay up-to-date with our latest learning resources.
          </p>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 rounded mb-3"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 mb-1 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-slate-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Resource Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-700">Date Added</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentResources?.map((resource) => (
                  <tr key={resource.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-800">{resource.title}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{resource.categoryName}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{resource.typeName}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{resource.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant={getButtonVariant(resource.categoryId)}
                        className="inline-flex items-center text-xs font-medium px-3 py-1 rounded"
                        onClick={() => handleDownload(resource.id)}
                      >
                        <i className="ri-download-line mr-1"></i> Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/resources/recent">
            <a className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
              View All Recent Additions <i className="ri-arrow-right-line ml-1"></i>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
