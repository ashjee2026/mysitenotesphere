import { useEffect, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { Category, ResourceType } from "@/lib/types";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch categories and resource types
    const fetchData = async () => {
      try {
        const [categoriesRes, typesRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/resource-types"),
        ]);

        if (categoriesRes.ok && typesRes.ok) {
          const categoriesData = await categoriesRes.json();
          const typesData = await typesRes.json();
          setCategories(categoriesData);
          setResourceTypes(typesData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load categories or resource types",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if the file is a PDF
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 25MB",
          variant: "destructive",
        });
        return;
      }
      
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pdfFile) {
      toast({
        title: "Missing file",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      });
      return;
    }
    
    if (!title || !description || !categoryId || !typeId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("categoryId", categoryId);
      formData.append("typeId", typeId);
      formData.append("isFeatured", isFeatured.toString());
      formData.append("pdfFile", pdfFile);
      
      const response = await fetch("/api/admin/resources", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Resource uploaded successfully",
        });
        
        // Reset form
        setTitle("");
        setDescription("");
        setCategoryId("");
        setTypeId("");
        setIsFeatured(false);
        setPdfFile(null);
        
        // Reset file input
        const fileInput = document.getElementById("pdfFile") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload resource");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // Redirect if not logged in or not an admin
  if (!user || !user.isAdmin) {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Educational Resource</CardTitle>
          <CardDescription>
            Add new PDF materials for students to download. All fields are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Physics NCERT Solutions Class 12"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of this resource"
                required
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={categoryId} 
                  onValueChange={setCategoryId}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Resource Type</Label>
                <Select 
                  value={typeId} 
                  onValueChange={setTypeId}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pdfFile">PDF File</Label>
              <Input
                id="pdfFile"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                Maximum file size: 25MB. Only PDF files are allowed.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={isFeatured}
                onCheckedChange={(checked) => 
                  setIsFeatured(checked === true)
                }
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Feature this resource on homepage
              </Label>
            </div>
            
            <CardFooter className="px-0 pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Resource
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}