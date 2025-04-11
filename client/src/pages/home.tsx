import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BookCard } from "@/components/ui/book-card";
import { Button } from "@/components/ui/button";
import { Class, Book } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["/api/classes"],
  });

  const { data: featuredBooks, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ["/api/books/featured"],
  });

  const { data: recentBooks, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["/api/books/recent"],
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to NoteSphere</h1>
          <p className="text-lg mb-6">
            Your comprehensive platform for educational resources across different class levels
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Explore Resources
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Class Categories */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore by Class</h2>
        
        {isLoadingClasses ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {classes?.map((classItem: Class) => (
              <Link key={classItem.id} href={`/class/${classItem.id}`}>
                <a className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow duration-300 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-primary mb-4">
                    <i className={`fas ${classItem.icon} text-2xl`}></i>
                  </div>
                  <h3 className="font-medium text-gray-900">{classItem.name}</h3>
                  <p className="text-sm text-gray-500 mt-2">View all resources</p>
                </a>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Books */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Featured Books</h2>
          <Button variant="ghost" className="text-primary">View All</Button>
        </div>
        
        {isLoadingFeatured ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks?.map((book: Book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Updates */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recently Added</h2>
          <span className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        
        {isLoadingRecent ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recentBooks?.map((book: Book) => (
              <div key={book.id} className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className={`flex-shrink-0 w-10 h-10 ${book.format === 'PDF' ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center ${book.format === 'PDF' ? 'text-green-700' : 'text-primary'}`}>
                  <i className={`fas ${book.format === 'PDF' ? 'fa-file-pdf' : 'fa-book'}`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{book.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{book.description}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-xs text-gray-500">
                      Added {new Date(book.createdAt).toLocaleDateString()}
                    </span>
                    <Link href={`/subject/${book.subjectId}`}>
                      <a className="text-primary hover:text-blue-700 text-xs font-medium">View Details</a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <div className="text-4xl font-bold text-primary mb-2">5</div>
          <p className="text-gray-500">Educational Categories</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <div className="text-4xl font-bold text-primary mb-2">15+</div>
          <p className="text-gray-500">Subjects Covered</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <div className="text-4xl font-bold text-primary mb-2">100+</div>
          <p className="text-gray-500">Quality Resources</p>
        </div>
      </section>
    </div>
  );
}
