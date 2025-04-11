import { useState, useContext, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext } from "@/App";
import { UploadBookForm } from "@/components/admin/upload-book-form";
import { apiRequest } from "@/lib/queryClient";
import { Book } from "@shared/schema";

export default function BookManagement() {
  const [location, navigate] = useLocation();
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { data: books, isLoading: isLoadingBooks } = useQuery({
    queryKey: ["/api/books"],
  });
  
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["/api/subjects"],
  });
  
  const deleteBookMutation = useMutation({
    mutationFn: async (bookId: number) => {
      await apiRequest("DELETE", `/api/books/${bookId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      toast({
        title: "Book deleted",
        description: "The book has been successfully deleted",
      });
      setIsDeleteDialogOpen(false);
      setBookToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete book: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (bookToDelete) {
      deleteBookMutation.mutate(bookToDelete.id);
    }
  };
  
  const getSubjectName = (subjectId: number) => {
    if (!subjects) return "Loading...";
    const subject = subjects.find((s: any) => s.id === subjectId);
    return subject ? subject.name : "Unknown Subject";
  };
  
  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You must be an admin to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, navigate, toast]);
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book Management</h1>
          <p className="text-sm text-gray-500">Add, edit and manage educational books and resources</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <i className="fas fa-plus mr-2"></i>
              Add New Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new educational resource
              </DialogDescription>
            </DialogHeader>
            <UploadBookForm />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Books</CardTitle>
          <CardDescription>
            Showing all {books?.length || 0} available books and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingBooks ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books?.length ? (
                    books.map((book: Book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{getSubjectName(book.subjectId)}</TableCell>
                        <TableCell>{book.author || "Unknown"}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {book.format}
                          </span>
                        </TableCell>
                        <TableCell>
                          {book.featured ? (
                            <i className="fas fa-check text-green-500"></i>
                          ) : (
                            <i className="fas fa-times text-red-500"></i>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <i className="fas fa-edit text-gray-500"></i>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteBook(book)}
                            >
                              <i className="fas fa-trash text-red-500"></i>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No books found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{bookToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteBookMutation.isPending}
            >
              {deleteBookMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
