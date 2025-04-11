import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Book } from "@shared/schema";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BookCardProps {
  book: Book;
  variant?: "large" | "small";
  className?: string;
}

export function BookCard({ book, variant = "large", className }: BookCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const isLarge = variant === "large";

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const res = await apiRequest("POST", `/api/books/${book.id}/download`);
      const data = await res.json();

      toast({
        title: "Download started",
        description: "Your download should begin shortly."
      });

      // Trigger file download through browser
      window.location.href = `/api/resources/${book.id}/download`;
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading this book. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Format book tags for display
  const formatTags = () => {
    if (book.featured) {
      return {
        label: "Official",
        bgColor: "bg-blue-100",
        textColor: "text-primary"
      };
    } else if (book.recommended) {
      return {
        label: "Popular",
        bgColor: "bg-purple-100",
        textColor: "text-accent"
      };
    } else {
      return {
        label: "New",
        bgColor: "bg-green-100",
        textColor: "text-green-700"
      };
    }
  };

  const tag = formatTags();

  if (isLarge) {
    return (
      <div className={cn(
        "bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow transition-shadow duration-300",
        className
      )}>
        <div className="aspect-w-3 aspect-h-4 bg-gray-200">
          {book.coverImage ? (
            <img 
              src={book.coverImage}
              alt={book.title}
              className="object-cover w-full h-48"
            />
          ) : (
            <div className="flex items-center justify-center h-48 bg-gray-100">
              <i className="fas fa-book text-4xl text-gray-400"></i>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className={cn("px-2 py-1 text-xs font-medium rounded-full", tag.bgColor, tag.textColor)}>
              {tag.label}
            </span>
            <span className="text-xs text-gray-500">{book.pageCount || 0} pages</span>
          </div>
          <h3 className="font-medium text-gray-900">{book.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{book.description}</p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 flex items-center">
                <i className="fas fa-download mr-1"></i> {book.downloadCount || 0}
              </span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-sm text-gray-500 flex items-center">
                <i className="fas fa-star mr-1 text-yellow-400"></i> {(book.rating / 10).toFixed(1) || "0.0"}
              </span>
            </div>
            <Button 
              variant="default"
              className="text-white bg-black hover:bg-black/90 shadow-sm"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Downloading...
                </>
              ) : (
                <>
                  <i className="fas fa-download mr-2"></i>
                  Download
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Small variant (for recommended books)
  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col shadow-sm hover:shadow transition-shadow duration-300",
      className
    )}>
      <div className="h-36 bg-gray-200">
        {book.coverImage ? (
          <img 
            src={book.coverImage}
            alt={book.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <i className="fas fa-book text-3xl text-gray-400"></i>
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-medium text-sm text-gray-900">{book.title}</h3>
        <p className="text-xs text-gray-500 mt-1 flex-1">{book.description}</p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500 flex items-center">
            <i className="fas fa-star text-yellow-400 mr-1"></i> {(book.rating / 10).toFixed(1) || "0.0"}
          </span>
          <Button 
            variant="default" 
            size="sm"
            className="text-white bg-black hover:bg-black/90 shadow-sm"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <>
                <i className="fas fa-download mr-1"></i>
                Download
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}