import { Button } from "@/components/ui/button";
import { Book } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { toast } = useToast();

  const handleView = () => {
    toast({
      title: "View Book",
      description: `Viewing ${book.title}`,
    });
    // In a real app, this would navigate to a book viewer
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading ${book.title}`,
    });
    // In a real app, this would trigger a download
  };

  // Default image for books without a cover
  const defaultImage = "https://images.unsplash.com/photo-1608228088998-57828365d486?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80";

  return (
    <div className="group relative bg-white shadow rounded-lg overflow-hidden">
      <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 h-56">
        <img 
          src={book.coverImage || defaultImage} 
          alt={book.title} 
          className="w-full h-full object-center object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <a href="#" onClick={(e) => { e.preventDefault(); handleView(); }}>
            <span aria-hidden="true" className="absolute inset-0"></span>
            {book.title}
          </a>
        </h3>
        <p className="mt-1 text-sm text-gray-500">{book.author}</p>
        <div className="mt-2 flex items-center space-x-1">
          {book.featured && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Official
            </span>
          )}
          {book.rating && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
              <i className="ri-star-fill mr-1"></i>
              {book.rating}
            </span>
          )}
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            <i className="ri-download-line mr-1"></i>
            {book.downloads > 1000 
              ? `${(book.downloads / 1000).toFixed(1)}K`
              : book.downloads
            }
          </span>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-primary-700 bg-primary-50 hover:bg-primary-100"
            onClick={handleView}
          >
            <i className="ri-eye-line mr-1"></i>
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-primary-700 bg-primary-50 hover:bg-primary-100"
            onClick={handleDownload}
          >
            <i className="ri-download-line mr-1"></i>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
