import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Class } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

type SidebarProps = {
  mobile?: boolean;
  onItemClick?: () => void;
};

export default function Sidebar({ mobile = false, onItemClick }: SidebarProps) {
  const [location] = useLocation();
  
  // Fetch classes from API
  const { data: classes, isLoading } = useQuery<Class[]>({
    queryKey: ['/api/classes'],
  });

  // Sample competitive exams - these could come from backend too
  const exams = [
    { id: 'jee', name: 'JEE', icon: 'file-list-3-line' },
    { id: 'neet', name: 'NEET', icon: 'medicine-bottle-line' },
  ];

  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div className={cn(
      "flex flex-col bg-white border-r border-gray-200 h-full",
      mobile ? "w-full" : "w-64"
    )}>
      <div className="p-4 border-b">
        <Link href="/" onClick={handleClick}>
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <i className="ri-book-open-line"></i>
            </div>
            <span className="text-xl font-semibold">NoteSphere</span>
          </div>
        </Link>
      </div>
      
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-6">
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Classes</h3>
            <div className="mt-2 space-y-1">
              {isLoading ? (
                <div className="px-3 py-2 text-sm">Loading...</div>
              ) : (
                classes?.map((cls) => (
                  <Link 
                    key={cls.id} 
                    href={`/class/${cls.id}`}
                    onClick={handleClick}
                  >
                    <a 
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        location === `/class/${cls.id}` 
                          ? "text-primary bg-primary-50" 
                          : "hover:bg-gray-100 hover:text-primary"
                      )}
                    >
                      <i className={cn(
                        `ri-${cls.icon || 'book-mark-line'} mr-3`,
                        location === `/class/${cls.id}` ? "text-primary" : "text-gray-400 group-hover:text-primary"
                      )}></i>
                      <span>Class {cls.name}</span>
                    </a>
                  </Link>
                ))
              )}
            </div>
          </div>
          
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Competitive Exams</h3>
            <div className="mt-2 space-y-1">
              {exams.map((exam) => (
                <Link 
                  key={exam.id} 
                  href={`/class/${exam.id}`}
                  onClick={handleClick}
                >
                  <a 
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      location === `/class/${exam.id}` 
                        ? "text-primary bg-primary-50" 
                        : "hover:bg-gray-100 hover:text-primary"
                    )}
                  >
                    <i className={cn(
                      `ri-${exam.icon} mr-3`,
                      location === `/class/${exam.id}` ? "text-primary" : "text-gray-400 group-hover:text-primary"
                    )}></i>
                    <span>{exam.name}</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resources</h3>
            <div className="mt-2 space-y-1">
              <Link href="/downloads" onClick={handleClick}>
                <a className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-primary">
                  <i className="ri-folder-download-line mr-3 text-gray-400 group-hover:text-primary"></i>
                  <span>Downloads</span>
                </a>
              </Link>
              <Link href="/faq" onClick={handleClick}>
                <a className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-primary">
                  <i className="ri-question-answer-line mr-3 text-gray-400 group-hover:text-primary"></i>
                  <span>FAQ</span>
                </a>
              </Link>
            </div>
          </div>
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <Link href="/admin/login" onClick={handleClick}>
          <a className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-primary">
            <i className="ri-login-box-line mr-3 text-gray-400 group-hover:text-primary"></i>
            <span>Admin Login</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
