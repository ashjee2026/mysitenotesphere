import { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/App";

export default function AdminIndex() {
  const [location, navigate] = useLocation();
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const { toast } = useToast();
  
  const { data: classes } = useQuery({
    queryKey: ["/api/classes"],
  });
  
  const { data: subjects } = useQuery({
    queryKey: ["/api/subjects"],
  });
  
  const { data: books } = useQuery({
    queryKey: ["/api/books"],
  });
  
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
          <CardFooter>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Manage educational content and resources</p>
        </div>
      </div>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{classes?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{subjects?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{books?.length || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Book Management</CardTitle>
            <CardDescription>
              Add, edit and manage books and educational resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm">Total Books</span>
                <span className="font-medium">{books?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm">Featured Books</span>
                <span className="font-medium">{books?.filter(b => b.featured).length || 0}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Recently Added</span>
                <span className="font-medium">{books?.slice(0, 5).length || 0} in last week</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/books">
              <Button className="w-full">Manage Books</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Class & Subject Management</CardTitle>
            <CardDescription>
              Organize educational content by classes and subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm">Total Classes</span>
                <span className="font-medium">{classes?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm">Total Subjects</span>
                <span className="font-medium">{subjects?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Avg. Subjects per Class</span>
                <span className="font-medium">
                  {classes && subjects ? Math.round(subjects.length / classes.length) : 0}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/classes">
              <Button className="w-full">Manage Classes</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest changes and additions to the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {books?.slice(0, 5).map(book => (
              <div key={book.id} className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-primary">
                  <i className="fas fa-book"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{book.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{book.description}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-xs text-gray-500">
                      Added {new Date(book.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {(!books || books.length === 0) && (
              <div className="text-center py-6">
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
