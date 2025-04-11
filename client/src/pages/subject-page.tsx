import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BookCard } from "@/components/ui/book-card";
import { BookTable } from "@/components/book-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Book } from "@shared/schema";

export default function SubjectPage() {
  const { id } = useParams<{ id: string }>();
  const subjectId = parseInt(id);
  
  const { data: subject, isLoading: isLoadingSubject } = useQuery({
    queryKey: [`/api/subjects/${subjectId}`],
  });
  
  const { data: books, isLoading: isLoadingBooks } = useQuery({
    queryKey: [`/api/subjects/${subjectId}/books`],
  });
  
  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["/api/classes"],
  });
  
  // Filter books by topic
  const [activeTab, setActiveTab] = React.useState("books");
  const [activeFilter, setActiveFilter] = React.useState("all");
  
  const getFilteredBooks = () => {
    if (!books) return [];
    
    if (activeFilter === "all") return books;
    
    return books.filter((book: Book) => 
      book.topics?.includes(activeFilter)
    );
  };
  
  // Get unique topics from all books
  const getUniqueTopics = () => {
    if (!books) return [];
    
    const allTopics = books.flatMap((book: Book) => book.topics || []);
    return [...new Set(allTopics)];
  };
  
  const topics = getUniqueTopics();
  const filteredBooks = getFilteredBooks();
  
  // Get class name
  const getClassName = () => {
    if (!classes || !subject) return "";
    const classItem = classes.find((c: any) => c.id === subject.classId);
    return classItem ? classItem.name : "";
  };
  
  if (isLoadingSubject || isLoadingClasses) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  if (!subject) {
    return <div className="text-center py-10">Subject not found</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/">
            <a className="hover:text-primary">Home</a>
          </Link>
          <i className="fas fa-chevron-right mx-2 text-xs"></i>
          <Link href={`/class/${subject.classId}`}>
            <a className="hover:text-primary">{getClassName()}</a>
          </Link>
          <i className="fas fa-chevron-right mx-2 text-xs"></i>
          <span className="text-gray-900 font-medium">{subject.name}</span>
        </div>
      </div>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getClassName()} {subject.name}</h1>
          <p className="mt-1 text-sm text-gray-500">Comprehensive study materials, textbooks, and resources</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="relative md:hidden">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          
          <Button className="flex items-center text-sm font-medium text-white">
            <i className="fas fa-bookmark mr-2"></i>
            Save Course
          </Button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <Tabs defaultValue="books" onValueChange={setActiveTab}>
          <TabsList className="flex space-x-6 overflow-x-auto pb-2">
            <TabsTrigger value="books" className="font-medium text-sm pb-3 text-gray-500 hover:text-gray-700 px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">
              Books
            </TabsTrigger>
            <TabsTrigger value="notes" className="font-medium text-sm pb-3 text-gray-500 hover:text-gray-700 px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">
              Notes
            </TabsTrigger>
            <TabsTrigger value="papers" className="font-medium text-sm pb-3 text-gray-500 hover:text-gray-700 px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">
              Question Papers
            </TabsTrigger>
            <TabsTrigger value="videos" className="font-medium text-sm pb-3 text-gray-500 hover:text-gray-700 px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">
              Video Lectures
            </TabsTrigger>
            <TabsTrigger value="assignments" className="font-medium text-sm pb-3 text-gray-500 hover:text-gray-700 px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">
              Assignments
            </TabsTrigger>
            <TabsTrigger value="syllabus" className="font-medium text-sm pb-3 text-gray-500 hover:text-gray-700 px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">
              Syllabus
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="books" className="pt-4">
            {/* Featured Books */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Featured Books</h2>
              
              {isLoadingBooks ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-80 rounded-lg" />
                  ))}
                </div>
              ) : filteredBooks.filter((book: Book) => book.featured).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBooks
                    .filter((book: Book) => book.featured)
                    .map((book: Book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No featured books available</p>
                </div>
              )}
            </section>
            
            {/* Topic-wise Books */}
            <section className="bg-white p-4 rounded-lg border border-gray-200 mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{subject.name} Topic-wise Books</h2>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      activeFilter === "all"
                        ? "bg-blue-100 text-primary"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-primary"
                    }`}
                  >
                    All Topics
                  </button>
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setActiveFilter(topic)}
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        activeFilter === topic
                          ? "bg-blue-100 text-primary"
                          : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-primary"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
              
              {isLoadingBooks ? (
                <Skeleton className="h-96 w-full" />
              ) : (
                <BookTable books={filteredBooks} />
              )}
            </section>
          </TabsContent>
          
          <TabsContent value="notes" className="pt-4">
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <i className="fas fa-sticky-note text-gray-400 text-3xl mb-3"></i>
              <h3 className="text-gray-500">Notes will be available soon</h3>
            </div>
          </TabsContent>
          
          <TabsContent value="papers" className="pt-4">
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <i className="fas fa-file-alt text-gray-400 text-3xl mb-3"></i>
              <h3 className="text-gray-500">Question papers will be available soon</h3>
            </div>
          </TabsContent>
          
          <TabsContent value="videos" className="pt-4">
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <i className="fas fa-video text-gray-400 text-3xl mb-3"></i>
              <h3 className="text-gray-500">Video lectures will be available soon</h3>
            </div>
          </TabsContent>
          
          <TabsContent value="assignments" className="pt-4">
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <i className="fas fa-tasks text-gray-400 text-3xl mb-3"></i>
              <h3 className="text-gray-500">Assignments will be available soon</h3>
            </div>
          </TabsContent>
          
          <TabsContent value="syllabus" className="pt-4">
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <i className="fas fa-list-check text-gray-400 text-3xl mb-3"></i>
              <h3 className="text-gray-500">Syllabus will be available soon</h3>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
