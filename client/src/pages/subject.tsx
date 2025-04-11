import { useEffect } from "react";
import MainLayout from "@/layouts/main-layout";
import { useQuery } from "@tanstack/react-query";
import { Class, Subject, Book, Chapter, Resource } from "@shared/schema";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb, { BreadcrumbItem } from "@/components/breadcrumb";
import SubjectTabs from "@/components/subject-tabs";
import BookCard from "@/components/book-card";
import ChapterCard from "@/components/chapter-card";
import ResourceCard from "@/components/resource-card";
import CTASection from "@/components/cta-section";
import { SUBJECT_TABS } from "@/lib/constants";

export default function SubjectPage() {
  const [match, params] = useRoute("/class/:classId/subject/:subjectId");
  const classId = params?.classId;
  const subjectId = params?.subjectId;
  const { toast } = useToast();

  // Fetch class details
  const { data: classDetails } = useQuery<Class>({
    queryKey: [`/api/classes/${classId}`],
  });

  // Fetch subject details
  const { data: subject, isLoading: subjectLoading, error } = useQuery<Subject>({
    queryKey: [`/api/subjects/${subjectId}`],
  });

  // Fetch books for this subject
  const { data: books, isLoading: booksLoading } = useQuery<Book[]>({
    queryKey: [`/api/subjects/${subjectId}/books`],
  });

  // Fetch chapters for this subject
  const { data: chapters, isLoading: chaptersLoading } = useQuery<Chapter[]>({
    queryKey: [`/api/subjects/${subjectId}/chapters`],
  });

  // Fetch additional resources
  const { data: resources, isLoading: resourcesLoading } = useQuery<Resource[]>({
    queryKey: [`/api/subjects/${subjectId}/resources`],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load subject details",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: classId || "",
      name: classDetails ? 
        (typeof classDetails.id === 'number' ? `Class ${classDetails.name}` : classDetails.name) : 
        String(classId),
      href: `/class/${classId}`,
    },
    {
      id: subjectId || "",
      name: subject?.name || "Subject",
      href: `/class/${classId}/subject/${subjectId}`,
    },
  ];

  // Sample data for rendering if API calls are still loading
  const sampleBooks: Book[] = [
    {
      id: 1,
      title: "Physics NCERT Textbook",
      author: "Class 11 - Part 1",
      coverImage: "https://images.unsplash.com/photo-1608228088998-57828365d486?ixlib=rb-4.0.3&auto=format&fit=crop",
      featured: true,
      downloads: 4200,
      subjectId: 1,
      classId: 1,
      fileUrl: "",
    },
    {
      id: 2,
      title: "Concepts of Physics",
      author: "HC Verma - Volume 1",
      coverImage: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?ixlib=rb-4.0.3&auto=format&fit=crop",
      rating: "4.9",
      downloads: 10500,
      subjectId: 1,
      classId: 1,
      fileUrl: "",
    },
    {
      id: 3,
      title: "Problems in Physics",
      author: "SS Krotov",
      coverImage: "https://images.unsplash.com/photo-1621944190310-e3cca1564bd7?ixlib=rb-4.0.3&auto=format&fit=crop",
      rating: "4.7",
      downloads: 5800,
      subjectId: 1,
      classId: 1,
      fileUrl: "",
    },
    {
      id: 4,
      title: "Physics for JEE",
      author: "DC Pandey",
      coverImage: "https://images.unsplash.com/photo-1632571401005-458e9d244591?ixlib=rb-4.0.3&auto=format&fit=crop",
      rating: "4.8",
      downloads: 8200,
      subjectId: 1,
      classId: 1,
      fileUrl: "",
    },
  ];

  const sampleChapters: Chapter[] = [
    {
      id: 1,
      subjectId: 1,
      name: "Chapter 1: Physical World",
      description: "",
      lessons: 4,
      practices: 2,
      status: "completed",
      order: 1,
    },
    {
      id: 2,
      subjectId: 1,
      name: "Chapter 2: Units and Measurements",
      description: "",
      lessons: 6,
      practices: 3,
      status: "completed",
      order: 2,
    },
    {
      id: 3,
      subjectId: 1,
      name: "Chapter 3: Motion in a Straight Line",
      description: "",
      lessons: 5,
      practices: 4,
      status: "in-progress",
      order: 3,
    },
  ];

  const sampleResources: Resource[] = [
    {
      id: 1,
      title: "Video Lectures",
      description: "",
      type: "video",
      icon: "youtube-line",
      count: 42,
      metadata: "42 videos • 5 playlists",
      subjectId: 1,
      classId: 1,
    },
    {
      id: 2,
      title: "Previous Year Papers",
      description: "",
      type: "paper",
      icon: "file-paper-2-line",
      count: 20,
      metadata: "10 years • 20 papers",
      subjectId: 1,
      classId: 1,
    },
    {
      id: 3,
      title: "Virtual Lab Experiments",
      description: "",
      type: "experiment",
      icon: "flask-line",
      count: 15,
      metadata: "15 simulations • Interactive",
      subjectId: 1,
      classId: 1,
    },
  ];

  // Use API data if available, otherwise use sample data
  const displayBooks = books || sampleBooks;
  const displayChapters = chapters || sampleChapters;
  const displayResources = resources || sampleResources;

  return (
    <MainLayout>
      <Breadcrumb items={breadcrumbItems} />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {subjectLoading ? 
                "Loading..." : 
                `${classDetails ? (typeof classDetails.id === 'number' ? `Class ${classDetails.name}` : classDetails.name) : classId} - ${subject?.name || "Physics"}`
              }
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Access all books, notes and resources for {subject?.name || "this subject"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:flex">
            <div className="relative inline-block text-left">
              <Button 
                variant="outline"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <i className="ri-filter-3-line mr-2"></i>
                Filter
                <i className="ri-arrow-down-s-line ml-2"></i>
              </Button>
            </div>
            <Button 
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
            >
              <i className="ri-download-cloud-line mr-2"></i>
              Download All
            </Button>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <SubjectTabs tabs={SUBJECT_TABS} activeTab="overview" />

      {/* Featured Books */}
      <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-medium text-gray-900">Featured Books</h2>
        <div className="mt-4 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {booksLoading ? (
            // Loading placeholders
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="group relative bg-white shadow rounded-lg overflow-hidden">
                <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 h-56 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="mt-2 h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : (
            displayBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))
          )}
        </div>
      </div>

      {/* Chapters & Topics */}
      <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-medium text-gray-900">Chapters & Topics</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chaptersLoading ? (
            // Loading placeholders
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : (
            displayChapters.map((chapter) => (
              <ChapterCard 
                key={chapter.id} 
                chapter={chapter} 
                classId={Number(classId)} 
                subjectId={Number(subjectId)} 
              />
            ))
          )}
        </div>
        <div className="mt-6 text-center">
          <Button 
            variant="outline"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            View All Chapters
            <i className="ri-arrow-right-line ml-2"></i>
          </Button>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-medium text-gray-900">Additional Resources</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resourcesLoading ? (
            // Loading placeholders
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5 animate-pulse">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-200 rounded-md p-3 w-12 h-12"></div>
                    <div className="ml-5 w-0 flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            displayResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
          )}
        </div>
      </div>

      {/* Call to Action */}
      <CTASection />
    </MainLayout>
  );
}
