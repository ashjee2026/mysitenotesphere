import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { ResourceFile, ResourceType } from "@/lib/types";

type ResourceListProps = {
  categoryId: string;
};

export default function ResourceList({ categoryId }: ResourceListProps) {
  const [activeType, setActiveType] = useState<string>("all");
  
  const { data: resourceTypes } = useQuery<ResourceType[]>({
    queryKey: ['/api/resource-types'],
  });

  const { data: resources, isLoading } = useQuery<ResourceFile[]>({
    queryKey: [`/api/categories/${categoryId}/resources`],
  });

  const filteredResources = activeType === "all" 
    ? resources 
    : resources?.filter(resource => resource.typeId === activeType);

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
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={activeType === "all" ? "default" : "outline"}
            onClick={() => setActiveType("all")}
          >
            All Resources
          </Button>
          {resourceTypes?.map(type => (
            <Button
              key={type.id}
              variant={activeType === type.id ? "default" : "outline"}
              onClick={() => setActiveType(type.id)}
            >
              {type.name}
            </Button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredResources?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">No resources found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources?.map(resource => (
              <div key={resource.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">{resource.title}</h3>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                      {resource.fileSize}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-6">{resource.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Added: {resource.createdAt}</span>
                    <div className="flex gap-2">
                      <Button
                        variant={getButtonVariant(categoryId)}
                        onClick={() => handleDownload(resource.id)}
                        className="inline-flex items-center bg-black text-white hover:bg-black/90 shadow-sm"
                      >
                        <i className="ri-download-line mr-1"></i> Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
