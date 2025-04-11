import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  insertBookSchema, 
  insertChapterSchema, 
  insertResourceSchema,
  Class, 
  Subject, 
  User
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";


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

// Extended schemas with file upload validation
const bookFormSchema = insertBookSchema.extend({
  fileUpload: z.instanceof(File, { message: "Please select a file" }).optional(),
  coverImageUpload: z.instanceof(File, { message: "Please select a cover image" }).optional(),
});

const chapterFormSchema = insertChapterSchema;

const resourceFormSchema = insertResourceSchema;

type BookFormValues = z.infer<typeof bookFormSchema>;
type ChapterFormValues = z.infer<typeof chapterFormSchema>;
type ResourceFormValues = z.infer<typeof resourceFormSchema>;

export default function UploadContent() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("book");
  const [selectedClass, setSelectedClass] = useState<number | string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [resourceUrl, setResourceUrl] = useState('');

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
    queryKey: ['/api/classes', selectedClass, 'subjects'],
    enabled: !!selectedClass,
  });

  // Book form setup
  const bookForm = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      classId: 0,
      subjectId: 0,
      featured: false,
      downloads: 0,
      rating: "",
      type: "book",
    },
  });

  // Chapter form setup
  const chapterForm = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterFormSchema),
    defaultValues: {
      name: "",
      description: "",
      subjectId: 0,
      lessons: 0,
      practices: 0,
      status: "new",
      order: 0,
    },
  });

  // Resource form setup
  const resourceForm = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "video",
      icon: "",
      count: 0,
      metadata: "",
      classId: 0,
      subjectId: 0,
    },
  });

  // Update subject dropdown when class changes
  useEffect(() => {
    if (selectedClass) {
      switch (activeTab) {
        case "book":
          bookForm.setValue("classId", Number(selectedClass));
          bookForm.setValue("subjectId", 0);
          break;
        case "resource":
          resourceForm.setValue("classId", Number(selectedClass));
          resourceForm.setValue("subjectId", 0);
          break;
      }
    }
  }, [selectedClass, activeTab, bookForm, resourceForm]);

  // Book upload mutation
  const bookMutation = useMutation({
    mutationFn: async (data: BookFormValues) => {
      const response = await apiRequest("POST", "/api/books", {
        title: data.title,
        author: data.author,
        description: data.description,
        classId: data.classId,
        subjectId: data.subjectId,
        featured: data.featured,
        coverImage: data.coverImageUpload ? "url_from_uploaded_file" : undefined,
        fileUrl: data.fileUpload ? "url_from_uploaded_file" : undefined,
        downloads: data.downloads,
        rating: data.rating,
        type: data.type,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Book uploaded successfully",
        description: "The book has been added to the library",
      });
      bookForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred while uploading the book",
        variant: "destructive",
      });
    },
  });

  // Chapter upload mutation
  const chapterMutation = useMutation({
    mutationFn: async (data: ChapterFormValues) => {
      const response = await apiRequest("POST", "/api/chapters", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Chapter created successfully",
        description: "The chapter has been added to the curriculum",
      });
      chapterForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/chapters'] });
    },
    onError: (error) => {
      toast({
        title: "Creation failed",
        description: error instanceof Error ? error.message : "An error occurred while creating the chapter",
        variant: "destructive",
      });
    },
  });

  // Resource upload mutation
  const resourceMutation = useMutation({
    mutationFn: async (data: ResourceFormValues) => {
      const response = await apiRequest("POST", "/api/resources", {
        ...data,
        fileUrl: uploadMethod === 'file' ? "url_from_uploaded_file" : resourceUrl
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Resource added successfully",
        description: "The resource has been added to the library",
      });
      resourceForm.reset();
      setUploadMethod('file');
      setResourceUrl('');
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred while adding the resource",
        variant: "destructive",
      });
    },
  });

  // Submit handlers
  const onBookSubmit = (data: BookFormValues) => {
    bookMutation.mutate(data);
  };

  const onChapterSubmit = (data: ChapterFormValues) => {
    chapterMutation.mutate(data);
  };

  const onResourceSubmit = (data: ResourceFormValues) => {
    resourceMutation.mutate(data);
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

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-3">
            <h1 className="text-2xl font-bold text-gray-900">Upload Content</h1>
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
          <Card>
            <CardHeader>
              <CardTitle>Add New Educational Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="book">Book</TabsTrigger>
                  <TabsTrigger value="chapter">Chapter</TabsTrigger>
                  <TabsTrigger value="resource">Resource</TabsTrigger>
                </TabsList>

                {/* Book Upload Form */}
                <TabsContent value="book">
                  <Form {...bookForm}>
                    <form onSubmit={bookForm.handleSubmit(onBookSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={bookForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Book Title*</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Physics NCERT Textbook" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={bookForm.control}
                          name="author"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Author</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., HC Verma" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={bookForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter a brief description of the book..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={bookForm.control}
                          name="classId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Class*</FormLabel>
                              <Select
                                value={field.value.toString()}
                                onValueChange={(value) => {
                                  field.onChange(Number(value));
                                  setSelectedClass(Number(value));
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a class" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {classesLoading ? (
                                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                                  ) : (
                                    classes?.map((cls) => (
                                      <SelectItem key={cls.id} value={cls.id.toString()}>
                                        {typeof cls.id === 'number' ? `Class ${cls.name}` : cls.name}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={bookForm.control}
                          name="subjectId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject*</FormLabel>
                              <Select
                                value={field.value.toString()}
                                onValueChange={(value) => {
                                  field.onChange(Number(value));
                                }}
                                disabled={!selectedClass || subjectsLoading}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a subject" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {!selectedClass ? (
                                    <SelectItem value="select-class" disabled>Select a class first</SelectItem>
                                  ) : subjectsLoading ? (
                                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                                  ) : (
                                    subjects?.map((subject) => (
                                      <SelectItem key={subject.id} value={subject.id.toString()}>
                                        {subject.name}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={bookForm.control}
                          name="fileUpload"
                          render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>Book File (PDF)</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => onChange(e.target.files?.[0] || null)}
                                  {...fieldProps}
                                />
                              </FormControl>
                              <FormDescription>Upload the PDF file of the book</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={bookForm.control}
                          name="coverImageUpload"
                          render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>Cover Image</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => onChange(e.target.files?.[0] || null)}
                                  {...fieldProps}
                                />
                              </FormControl>
                              <FormDescription>Upload a cover image for the book</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={bookForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content Type</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="book">Book</SelectItem>
                                  <SelectItem value="notes">Notes</SelectItem>
                                  <SelectItem value="solution">Solutions</SelectItem>
                                  <SelectItem value="guide">Study Guide</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={bookForm.control}
                          name="rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rating (optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 4.7" {...field} />
                              </FormControl>
                              <FormDescription>Format: 0.0 - 5.0</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={bookForm.control}
                          name="featured"
                          render={({ field }) => (
                            <FormItem className="flex items-end space-x-2 h-full">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel>Featured on homepage</FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" disabled={bookMutation.isPending}>
                        {bookMutation.isPending ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <i className="ri-upload-2-line mr-2"></i>
                            Upload Book
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                {/* Chapter Creation Form */}
                <TabsContent value="chapter">
                  <Form {...chapterForm}>
                    <form onSubmit={chapterForm.handleSubmit(onChapterSubmit)} className="space-y-6">
                      <FormField
                        control={chapterForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chapter Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Chapter 1: Motion in a Straight Line" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={chapterForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter a brief description of the chapter..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={chapterForm.control}
                          name="subjectId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject*</FormLabel>
                              <Select
                                value={field.value.toString()}
                                onValueChange={(value) => {
                                  field.onChange(Number(value));
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a subject" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {classesLoading ? (
                                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                                  ) : (
                                    // Here in a real app, we'd first select a class and then show subjects
                                    // For simplicity, showing a flat list of all subjects
                                    subjects?.map((subject) => (
                                      <SelectItem key={subject.id} value={subject.id.toString()}>
                                        {subject.name}
                                      </SelectItem>
                                    )) || [] // If no subjects, empty array
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={chapterForm.control}
                          name="order"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Order*</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="e.g., 1" 
                                  min={1}
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                                />
                              </FormControl>
                              <FormDescription>Position of this chapter in the curriculum</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={chapterForm.control}
                          name="lessons"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Lessons</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="e.g., 5" 
                                  min={0}
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={chapterForm.control}
                          name="practices"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Practice Sets</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="e.g., 3" 
                                  min={0}
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={chapterForm.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" disabled={chapterMutation.isPending}>
                        {chapterMutation.isPending ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            Creating...
                          </>
                        ) : (
                          <>
                            <i className="ri-add-line mr-2"></i>
                            Create Chapter
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                {/* Resource Upload Form */}
                <TabsContent value="resource">
                  <Form {...resourceForm}>
                    <form onSubmit={resourceForm.handleSubmit(onResourceSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={resourceForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Resource Title*</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Video Lectures" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={resourceForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Resource Type*</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select resource type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="video">Video</SelectItem>
                                  <SelectItem value="paper">Previous Paper</SelectItem>
                                  <SelectItem value="experiment">Experiment</SelectItem>
                                  <SelectItem value="notes">Notes</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={resourceForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter a description of this resource..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={resourceForm.control}
                          name="classId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Class*</FormLabel>
                              <Select
                                value={field.value.toString()}
                                onValueChange={(value) => {
                                  field.onChange(Number(value));
                                  setSelectedClass(Number(value));
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a class" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {classesLoading ? (
                                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                                  ) : (
                                    classes?.map((cls) => (
                                      <SelectItem key={cls.id} value={cls.id.toString()}>
                                        {typeof cls.id === 'number' ? `Class ${cls.name}` : cls.name}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={resourceForm.control}
                          name="subjectId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject*</FormLabel>
                              <Select
                                value={field.value.toString()}
                                onValueChange={(value) => {
                                  field.onChange(Number(value));
                                }}
                                disabled={!selectedClass || subjectsLoading}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a subject" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {!selectedClass ? (
                                    <SelectItem value="select-class" disabled>Select a class first</SelectItem>
                                  ) : subjectsLoading ? (
                                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                                  ) : (
                                    subjects?.map((subject) => (
                                      <SelectItem key={subject.id} value={subject.id.toString()}>
                                        {subject.name}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={resourceForm.control}
                          name="count"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Count</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="e.g., 42" 
                                  min={0}
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                                />
                              </FormControl>
                              <FormDescription>Number of items (videos, papers, etc.)</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={resourceForm.control}
                          name="metadata"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Info</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 42 videos • 5 playlists" {...field} />
                              </FormControl>
                              <FormDescription>Displayed as a subtitle</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={resourceForm.control}
                        name="icon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., youtube-line" {...field} />
                            </FormControl>
                            <FormDescription>Remix Icon name (leave empty for automatic selection)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <div>
                          <Label>Choose upload method</Label>
                          <Select defaultValue="file" onValueChange={(value) => setUploadMethod(value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select upload method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="file">Upload File</SelectItem>
                              <SelectItem value="url">Provide URL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {uploadMethod === 'file' ? (
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => resourceForm.setValue('fileUrl', e.target.files?.[0])}
                              required={uploadMethod === 'file'}
                            />
                            <p className="text-sm text-muted-foreground">
                              Maximum file size: 25MB. Only PDF files are allowed.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Input
                              type="url"
                              placeholder="Enter resource URL"
                              value={resourceUrl}
                              onChange={(e) => setResourceUrl(e.target.value)}
                              required={uploadMethod === 'url'}
                            />
                            <p className="text-sm text-muted-foreground">
                              Enter a direct URL to the PDF file
                            </p>
                          </div>
                        )}
                      </div>

                      <Button type="submit" disabled={resourceMutation.isPending}>
                        {resourceMutation.isPending ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            Adding...
                          </>
                        ) : (
                          <>
                            <i<i className="ri-add-line mr-2"></i>
                            Add Resource
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Tips and Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upload Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 mr-3">
                    <i className="ri-file-list-line text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Book Uploads</h3>
                    <p className="text-sm text-gray-500">
                      Use PDF format for books. Optimize file size for faster downloads.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-2 mr-3">
                    <i className="ri-image-line text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Cover Images</h3>
                    <p className="text-sm text-gray-500">
                      Use high-quality cover images in JPG or PNG format with dimensions of 400x600 pixels.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-2 mr-3">
                    <i className="ri-links-line text-purple-600"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Resource Organization</h3>
                    <p className="text-sm text-gray-500">
                      Always link resources to the appropriate class and subject for better discoverability.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}