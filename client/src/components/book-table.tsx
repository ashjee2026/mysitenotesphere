import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Book } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BookTableProps {
  books: Book[];
}

export function BookTable({ books }: BookTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState<number | null>(null);
  const booksPerPage = 5;
  const { toast } = useToast();

  // Calculate pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  const handleDownload = async (bookId: number) => {
    try {
      setIsDownloading(bookId);
      const res = await apiRequest("POST", `/api/books/${bookId}/download`);
      const data = await res.json();
      
      toast({
        title: "Download started",
        description: "Your download should begin shortly."
      });

      // In a real app, this would trigger the actual file download
      console.log("Download URL:", data.fileUrl);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading this book. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Topics Covered</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBooks.length > 0 ? (
              currentBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                        <i className="fas fa-book text-gray-400"></i>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        <div className="text-xs text-gray-500">Ref. {book.refNumber || `B${book.id}`}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-sm text-gray-900">{book.author || "Unknown"}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {book.topics?.join(", ") || "General"}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      book.format === 'PDF' 
                        ? 'bg-green-100 text-green-800'
                        : book.format === 'EPUB'
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                    }`}>
                      {book.format}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary hover:text-blue-700"
                        onClick={() => handleDownload(book.id)}
                        disabled={isDownloading === book.id}
                      >
                        <i className="fas fa-download"></i>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <i className="far fa-bookmark"></i>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No books found for the selected criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {books.length > booksPerPage && (
        <div className="pt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{indexOfFirstBook + 1}</span> to{" "}
            <span className="font-medium">{Math.min(indexOfLastBook, books.length)}</span> of{" "}
            <span className="font-medium">{books.length}</span> results
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(3, totalPages) }).map((_, idx) => {
              // Logic to always show current page and adjust visible pages
              let pageNum = currentPage;
              if (idx === 0 && currentPage > 1) pageNum = currentPage - 1;
              if (idx === 1) pageNum = currentPage;
              if (idx === 2) pageNum = currentPage + 1;
              
              // Don't render buttons for pages out of range
              if (pageNum > totalPages || pageNum < 1) return null;
              
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={pageNum === currentPage ? "bg-blue-50 text-primary border-primary" : ""}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
