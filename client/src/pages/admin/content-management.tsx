import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Class, Subject, Chapter, Resource, User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Admin sidebar component
function AdminSidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "dashboard-line" },
    { href: "/admin/content", label: "Content Management", icon: "book-open-line" },
    { href: "/admin/upload", label: "Upload", icon: "upload-2-line" },
    { href: "/admin/users", label: "Users", icon: "user-line" },
    { href: "/admin/settings", label: "Settings", icon: "settings-3-line" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <i className="ri-book-open-line"></i>
          </div>
          <span className="text-xl font-semibold">NoteSphere</span>
          <span className="text-xs bg-primary-700 px-2 py-0.5 rounded">Admin</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`flex items-center px-3 py-2 rounded-md ${
              location === item.href
                ? "bg-gray-800 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <i className={`ri-${item.icon} mr-3`}></i>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <a
          href="/"
          className="flex items-center px-3 py-2 text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
        >
          <i className="ri-logout-box-r-line mr-3"></i>
          Exit to Website
        </a>
      </div>
    </div>
  );
}

export default function ContentManagement() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("books");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState<"book" | "chapter" | "resource">("book");

  // Check if user is authenticated
  const { data: user, isLoading: userLoading, error: userError } = useQuery<User>({
    queryKey: ['/api/admin/me'],
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user && userError) {
      setLocation("/admin/login");
    }
  }, [user, userLoading, userError, setLocation]);

  // Fetch classes
  const { data: classes, isLoading: classesLoading } = useQuery<Class[]>({
    queryKey: ['/api/classes'],
  });

  // Fetch subjects based on selected class
  const { data: subjects, isLoading: subjectsLoading } = useQuery<Subject[]>({
    queryKey: ['/api/subjects', selectedClass !== 'all' ? selectedClass : 'all'],
    enabled: selectedClass !== 'all',
  });

  // Fetch content based on active tab and filters
  const { data: contentData, isLoading: contentLoading, refetch } = useQuery<Book[] | Chapter[] | Resource[]>({
    queryKey: [
      `/api/${activeTab}`,
      selectedClass !== 'all' ? selectedClass : 'all',
      selectedSubject !== 'all' ? selectedSubject : 'all',
      searchTerm,
    ],
  });

  // Add select state for batch operations
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // Delete mutation
  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/${deleteType}s/${id}`, undefined);
    },
    onSuccess: () => {
      toast({
        title: "Deleted successfully",
        description: `The ${deleteType} has been deleted`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/${activeTab}`] });
      setShowDeleteDialog(false);
      setItemToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error deleting",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  });

  // Handle delete confirmation
  const handleDeleteClick = (id: number, type: "book" | "chapter" | "resource") => {
    setItemToDelete(id);
    setDeleteType(type);
    setShowDeleteDialog(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (itemToDelete !== null) {
      deleteItem(itemToDelete);
    }
  };

  // If still checking authentication, show loading
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <i className="ri-loader-4-line text-primary text-3xl animate-spin"></i>
          <p className="mt-2">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Render books table
  const renderBooksTable = () => {
    const books = contentData as Book[] || [];
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Downloads</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No books found. Try adjusting your filters or <a href="/admin/upload" className="text-primary hover:underline">upload new content</a>.
              </TableCell>
            </TableRow>
          ) : (
            books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.id}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author || 'N/A'}</TableCell>
                <TableCell>{book.classId}</TableCell>
                <TableCell>{book.subjectId}</TableCell>
                <TableCell>{book.downloads}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setLocation(`/admin/edit/book/${book.id}`)}>
                        <i className="ri-edit-line mr-1"></i> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteClick(book.id, "book")}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <i className="ri-delete-bin-line mr-1"></i> Remove
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  };

  // Render chapters table
  const renderChaptersTable = () => {
    const chapters = contentData as Chapter[] || [];
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Lessons</TableHead>
            <TableHead>Practices</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chapters.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No chapters found. Try adjusting your filters or <a href="/admin/upload" className="text-primary hover:underline">upload new content</a>.
              </TableCell>
            </TableRow>
          ) : (
            chapters.map((chapter) => (
              <TableRow key={chapter.id}>
                <TableCell>{chapter.id}</TableCell>
                <TableCell>{chapter.name}</TableCell>
                <TableCell>{chapter.subjectId}</TableCell>
                <TableCell>{chapter.lessons}</TableCell>
                <TableCell>{chapter.practices}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    chapter.status === 'completed' ? 'bg-green-100 text-green-800' :
                    chapter.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {chapter.status || 'new'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setLocation(`/admin/edit/chapter/${chapter.id}`)}>
                      <i className="ri-edit-line mr-1"></i> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(chapter.id, "chapter")}>
                      <i className="ri-delete-bin-line mr-1"></i> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  };

  // Render resources table
  const renderResourcesTable = () => {
    const resources = contentData as Resource[] || [];
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No resources found. Try adjusting your filters or <a href="/admin/upload" className="text-primary hover:underline">upload new content</a>.
              </TableCell>
            </TableRow>
          ) : (
            resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell>{resource.id}</TableCell>
                <TableCell>{resource.title}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    resource.type === 'video' ? 'bg-blue-100 text-blue-800' :
                    resource.type === 'paper' ? 'bg-orange-100 text-orange-800' :
                    resource.type === 'experiment' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {resource.type}
                  </span>
                </TableCell>
                <TableCell>{resource.classId}</TableCell>
                <TableCell>{resource.subjectId}</TableCell>
                <TableCell>{resource.count}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setLocation(`/admin/edit/resource/${resource.id}`)}>
                      <i className="ri-edit-line mr-1"></i> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(resource.id, "resource")}>
                      <i className="ri-delete-bin-line mr-1"></i> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-3">
            <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            {selectedItems.length > 0 && (
              <Button 
                variant="destructive"
                size="sm"
                onClick={() => {
                  selectedItems.forEach(id => deleteItem(id));
                  setSelectedItems([]);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <i className="ri-delete-bin-2-line mr-1"></i>
                Delete Selected ({selectedItems.length})
              </Button>
            )}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                {user ? `Welcome, ${user.username}` : 'Loading...'}
              </span>
              <Button variant="outline" size="sm">
                <i className="ri-notification-3-line mr-1"></i>
                <span className="text-xs bg-red-500 text-white rounded-full px-1.5 absolute -mt-3 -mr-1 right-0 top-0">3</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Filter controls */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {!classesLoading && classes && classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>{typeof cls.id === 'number' ? `Class ${cls.name}` : cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
                disabled={selectedClass === 'all'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {!subjectsLoading && subjects && subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>{subject.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Manage Content</CardTitle>
                <Button onClick={() => setLocation("/admin/upload")}>
                  <i className="ri-add-line mr-2"></i>
                  Add New Content
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="books">Books</TabsTrigger>
                  <TabsTrigger value="chapters">Chapters</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="books" className="w-full overflow-x-auto">
                  {contentLoading ? (
                    <div className="text-center py-8">
                      <i className="ri-loader-4-line text-primary text-3xl animate-spin"></i>
                      <p className="mt-2">Loading books...</p>
                    </div>
                  ) : renderBooksTable()}
                </TabsContent>

                <TabsContent value="chapters" className="w-full overflow-x-auto">
                  {contentLoading ? (
                    <div className="text-center py-8">
                      <i className="ri-loader-4-line text-primary text-3xl animate-spin"></i>
                      <p className="mt-2">Loading chapters...</p>
                    </div>
                  ) : renderChaptersTable()}
                </TabsContent>

                <TabsContent value="resources" className="w-full overflow-x-auto">
                  {contentLoading ? (
                    <div className="text-center py-8">
                      <i className="ri-loader-4-line text-primary text-3xl animate-spin"></i>
                      <p className="mt-2">Loading resources...</p>
                    </div>
                  ) : renderResourcesTable()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Guide card */}
          <Card>
            <CardHeader>
              <CardTitle>Content Management Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <i className="ri-file-list-line text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Organizing Content</h3>
                    <p className="text-sm text-gray-500">
                      Ensure each piece of content is assigned to the correct class and subject for easy discovery.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <i className="ri-upload-2-line text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">File Uploads</h3>
                    <p className="text-sm text-gray-500">
                      For best performance, optimize PDFs and images before uploading them to the platform.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <i className="ri-star-line text-yellow-600"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Featured Content</h3>
                    <p className="text-sm text-gray-500">
                      Mark important content as featured to have it displayed prominently on the homepage.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected {deleteType} 
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
