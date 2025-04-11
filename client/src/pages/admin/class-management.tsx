import { useState, useContext, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext } from "@/App";
import { apiRequest } from "@/lib/queryClient";
import { Class, Subject } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const classSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  icon: z.string().min(1, "Icon is required"),
  displayOrder: z.coerce.number().int().positive(),
});

const subjectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  classId: z.coerce.number().int().positive(),
});

export default function ClassManagement() {
  const [location, navigate] = useLocation();
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [deleteType, setDeleteType] = useState<"class" | "subject">("class");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  
  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["/api/classes"],
  });
  
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["/api/subjects"],
  });
  
  // Class form
  const classForm = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: "",
      icon: "fa-graduation-cap",
      displayOrder: 1,
    },
  });
  
  // Subject form
  const subjectForm = useForm<z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
      classId: 0,
    },
  });
  
  // Mutations
  const addClassMutation = useMutation({
    mutationFn: async (data: z.infer<typeof classSchema>) => {
      const response = await apiRequest("POST", "/api/classes", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      toast({
        title: "Class added",
        description: "The class has been successfully added",
      });
      setIsAddClassOpen(false);
      classForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add class: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const addSubjectMutation = useMutation({
    mutationFn: async (data: z.infer<typeof subjectSchema>) => {
      const response = await apiRequest("POST", "/api/subjects", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subjects"] });
      toast({
        title: "Subject added",
        description: "The subject has been successfully added",
      });
      setIsAddSubjectOpen(false);
      subjectForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add subject: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const deleteClassMutation = useMutation({
    mutationFn: async (classId: number) => {
      await apiRequest("DELETE", `/api/classes/${classId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      toast({
        title: "Class deleted",
        description: "The class has been successfully deleted",
      });
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete class: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const deleteSubjectMutation = useMutation({
    mutationFn: async (subjectId: number) => {
      await apiRequest("DELETE", `/api/subjects/${subjectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subjects"] });
      toast({
        title: "Subject deleted",
        description: "The subject has been successfully deleted",
      });
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete subject: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const handleDeleteClass = (classItem: Class) => {
    setItemToDelete(classItem);
    setDeleteType("class");
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteSubject = (subject: Subject) => {
    setItemToDelete(subject);
    setDeleteType("subject");
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    if (deleteType === "class") {
      deleteClassMutation.mutate(itemToDelete.id);
    } else {
      deleteSubjectMutation.mutate(itemToDelete.id);
    }
  };
  
  const onSubmitClass = (data: z.infer<typeof classSchema>) => {
    addClassMutation.mutate(data);
  };
  
  const onSubmitSubject = (data: z.infer<typeof subjectSchema>) => {
    addSubjectMutation.mutate(data);
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
          <h1 className="text-2xl font-bold text-gray-900">Class & Subject Management</h1>
          <p className="text-sm text-gray-500">Organize educational content by classes and subjects</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsAddSubjectOpen(true)}>
            <i className="fas fa-plus mr-2"></i>
            Add Subject
          </Button>
          <Button onClick={() => setIsAddClassOpen(true)}>
            <i className="fas fa-plus mr-2"></i>
            Add Class
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Classes</CardTitle>
            <CardDescription>
              Manage educational class categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingClasses ? (
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
                      <TableHead>Name</TableHead>
                      <TableHead>Icon</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes?.length ? (
                      classes.map((classItem: Class) => (
                        <TableRow key={classItem.id}>
                          <TableCell className="font-medium">{classItem.name}</TableCell>
                          <TableCell>
                            <i className={`fas ${classItem.icon} text-primary`}></i>
                          </TableCell>
                          <TableCell>{classItem.displayOrder}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <i className="fas fa-edit text-gray-500"></i>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteClass(classItem)}
                              >
                                <i className="fas fa-trash text-red-500"></i>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No classes found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Subjects Table */}
        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
            <CardDescription>
              Manage educational subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSubjects || isLoadingClasses ? (
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
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects?.length ? (
                      subjects.map((subject: Subject) => (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell>
                            {classes?.find((c: Class) => c.id === subject.classId)?.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <i className="fas fa-edit text-gray-500"></i>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteSubject(subject)}
                              >
                                <i className="fas fa-trash text-red-500"></i>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          No subjects found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
              {deleteType === "class" && " All associated subjects and books will also be affected."}
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
              disabled={deleteClassMutation.isPending || deleteSubjectMutation.isPending}
            >
              {(deleteClassMutation.isPending || deleteSubjectMutation.isPending) ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Class Dialog */}
      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>
              Create a new educational class category
            </DialogDescription>
          </DialogHeader>
          
          <Form {...classForm}>
            <form onSubmit={classForm.handleSubmit(onSubmitClass)} className="space-y-4">
              <FormField
                control={classForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Class 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={classForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon (FontAwesome class)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. fa-graduation-cap" {...field} />
                    </FormControl>
                    <FormDescription>
                      Use FontAwesome class names like fa-graduation-cap, fa-book, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={classForm.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Lower numbers will appear first in the list
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddClassOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addClassMutation.isPending}
                >
                  {addClassMutation.isPending ? "Adding..." : "Add Class"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Add Subject Dialog */}
      <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>
              Create a new subject for an existing class
            </DialogDescription>
          </DialogHeader>
          
          <Form {...subjectForm}>
            <form onSubmit={subjectForm.handleSubmit(onSubmitSubject)} className="space-y-4">
              <FormField
                control={subjectForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Physics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={subjectForm.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Select a class</option>
                        {classes?.map((classItem: Class) => (
                          <option key={classItem.id} value={classItem.id}>
                            {classItem.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddSubjectOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addSubjectMutation.isPending}
                >
                  {addSubjectMutation.isPending ? "Adding..." : "Add Subject"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
