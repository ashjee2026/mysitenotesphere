import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BookCard } from "@/components/ui/book-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Book } from "@shared/schema";

export default function ClassPage() {
  const { id } = useParams<{ id: string }>();
  const classId = parseInt(id);
  
  const { data: classData, isLoading: isLoadingClass } = useQuery({
    queryKey: [`/api/classes/${classId}`],
  });
  
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: [`/api/classes/${classId}/subjects`],
  });
  
  // Get all books for this class's subjects
  const { data: allBooks, isLoading: isLoadingBooks } = useQuery({
    queryKey: ["/api/books"],
  });
  
  // Filter books for this class
  const getBooksForClass = () => {
    if (!allBooks || !subjects) return [];
    const subjectIds = subjects.map((subject: any) => subject.id);
    return allBooks.filter((book: Book) => subjectIds.includes(book.subjectId));
  };
  
  const classBooks = getBooksForClass();
  
  if (isLoadingClass) {
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
  
  if (!classData) {
    return <div className="text-center py-10">Class not found</div>;
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
          <span className="text-gray-900 font-medium">{classData.name}</span>
        </div>
      </div>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{classData.name} Resources</h1>
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
      
      {/* Subjects Navigation */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Subjects</h2>
        
        {isLoadingSubjects ? (
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {subjects?.map((subject: any) => (
              <Link key={subject.id} href={`/subject/${subject.id}`}>
                <a className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-primary">
                  {subject.name}
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Books Section */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Available Books</h2>
        
        {isLoadingBooks ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : classBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classBooks.map((book: Book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <i className="fas fa-book-open text-gray-400 text-3xl mb-3"></i>
            <h3 className="text-gray-500">No books available for this class yet</h3>
          </div>
        )}
      </section>
    </div>
  );
}
