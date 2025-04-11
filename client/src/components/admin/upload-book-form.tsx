import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Subject } from "@shared/schema";

// Create a schema for book validation
const bookSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  author: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  format: z.enum(["PDF", "EPUB", "MOBI"]),
  pageCount: z.coerce.number().int().positive().optional(),
  fileUrl: z.string().min(1, "File URL is required"),
  subjectId: z.coerce.number().int().positive("Subject is required"),
  topics: z.string().array().optional(),
  refNumber: z.string().max(10).optional(),
  featured: z.boolean().default(false),
  recommended: z.boolean().default(false),
  rating: z.coerce.number().int().min(0).max(50).optional(),
});

export function UploadBookForm() {
  const [topicInput, setTopicInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch subjects for dropdown
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["/api/subjects"],
  });
  
  // Initialize form with default values
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      coverImage: "",
      format: "PDF",
      pageCount: 1,
      fileUrl: "/books/",
      subjectId: 0,
      topics: [],
      refNumber: "",
      featured: false,
      recommended: false,
      rating: 0,
    },
  });
  
  // Add topics to the array
  const addTopic = () => {
    if (!topicInput.trim()) return;
    
    const currentTopics = form.getValues("topics") || [];
    if (!currentTopics.includes(topicInput.trim())) {
      form.setValue("topics", [...currentTopics, topicInput.trim()]);
    }
    setTopicInput("");
  };
  
  // Remove a topic from the array
  const removeTopic = (topic: string) => {
    const currentTopics = form.getValues("topics") || [];
    form.setValue("topics", currentTopics.filter(t => t !== topic));
  };
  
  // Handle form submission
  const onSubmit = async (data: z.infer<typeof bookSchema>) => {
    try {
      await apiRequest("POST", "/api/books", data);
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      
      toast({
        title: "Book added successfully",
        description: "The book has been added to the library",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error adding book",
        description: `${error}`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Title*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter book title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Author name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject*</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">Select a subject</option>
                    {subjects?.map((subject: Subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Format*</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="PDF">PDF</option>
                    <option value="EPUB">EPUB</option>
                    <option value="MOBI">MOBI</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pageCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Count</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="Number of pages" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="refNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. B1001" {...field} />
                </FormControl>
                <FormDescription>
                  A unique identifier for this book (max 10 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a brief description of the book"
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                Enter a URL for the book cover image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File URL*</FormLabel>
              <FormControl>
                <Input placeholder="/books/filename.pdf" {...field} />
              </FormControl>
              <FormDescription>
                Path where the book file is or will be stored
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Topics</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {form.getValues("topics")?.map((topic, index) => (
              <div 
                key={index} 
                className="bg-blue-100 text-primary px-2 py-1 rounded-full text-sm flex items-center"
              >
                {topic}
                <button 
                  type="button" 
                  className="ml-1 text-primary/70 hover:text-primary"
                  onClick={() => removeTopic(topic)}
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            <Input
              placeholder="Add a topic"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              className="mr-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTopic();
                }
              }}
            />
            <Button type="button" onClick={addTopic}>Add</Button>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="mt-0">Featured Book</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="recommended"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="mt-0">Recommended Book</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (0-50)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    placeholder="Rating out of 50"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This will be displayed as X.X out of 5
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit">Add Book</Button>
        </div>
      </form>
    </Form>
  );
}
