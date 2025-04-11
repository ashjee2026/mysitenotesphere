import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Class, Subject } from "@shared/schema";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SidebarNav({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const [openClassId, setOpenClassId] = useState<number | null>(null);

  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["/api/classes"],
  });

  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["/api/subjects"],
  });

  // On small screens, close the sidebar when navigating to a new page
  useEffect(() => {
    if (window.innerWidth < 768) {
      onClose();
    }
  }, [location, onClose]);

  // Handle toggling of class dropdown
  const toggleClass = (classId: number) => {
    setOpenClassId(openClassId === classId ? null : classId);
  };

  // Get subjects for a specific class
  const getSubjectsForClass = (classId: number) => {
    if (!subjects) return [];
    return subjects.filter((subject: Subject) => subject.classId === classId);
  };

  // Check if a subject is active
  const isSubjectActive = (subjectId: number) => {
    return location === `/subject/${subjectId}`;
  };

  // Check if class is active
  const isClassActive = (classId: number) => {
    if (location === `/class/${classId}`) return true;
    
    if (subjects) {
      const classSubjects = getSubjectsForClass(classId);
      return classSubjects.some(subject => isSubjectActive(subject.id));
    }
    
    return false;
  };

  return (
    <aside 
      className={cn(
        "sidebar bg-white w-64 border-r border-gray-200 fixed inset-y-0 left-0 pt-16 pb-4 overflow-y-auto flex-shrink-0 z-20 transition-all duration-300 ease-in-out",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="px-3 py-4">
        <div className="mb-4">
          <button className="flex items-center justify-between w-full p-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
            <span>Switch Class</span>
            <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
          </button>
        </div>
        
        <nav className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Classes</h3>
          
          {isLoadingClasses ? (
            <div className="px-3 py-2 text-sm text-gray-500">Loading classes...</div>
          ) : (
            classes?.map((classItem: Class) => (
              <div key={classItem.id} className={cn("dropdown", openClassId === classItem.id && "dropdown-open")}>
                <button 
                  onClick={() => toggleClass(classItem.id)}
                  className={cn(
                    "dropdown-toggle flex items-center justify-between w-full p-2 rounded-md text-sm font-medium",
                    isClassActive(classItem.id) ? "bg-blue-50 text-primary" : "hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center">
                    <i className={cn(`fas ${classItem.icon} mr-3`, isClassActive(classItem.id) ? "text-primary" : "text-gray-500")}></i>
                    <span>{classItem.name}</span>
                  </div>
                  <i className={cn(
                    "fas",
                    openClassId === classItem.id ? "fa-chevron-up" : "fa-chevron-down",
                    isClassActive(classItem.id) ? "text-primary" : "text-gray-400",
                    "text-xs"
                  )}></i>
                </button>
                <div className="dropdown-content pl-5 mt-1 space-y-1">
                  <Link href={`/class/${classItem.id}`}>
                    <a className={cn(
                      "flex items-center pl-8 py-2 text-sm font-medium rounded-md",
                      location === `/class/${classItem.id}` 
                        ? "text-primary bg-blue-50" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                    )}>
                      All Subjects
                    </a>
                  </Link>
                  {isLoadingSubjects ? (
                    <div className="pl-8 py-2 text-sm text-gray-500">Loading subjects...</div>
                  ) : (
                    getSubjectsForClass(classItem.id).map((subject: Subject) => (
                      <Link key={subject.id} href={`/subject/${subject.id}`}>
                        <a className={cn(
                          "flex items-center pl-8 py-2 text-sm font-medium rounded-md",
                          isSubjectActive(subject.id) 
                            ? "text-primary bg-blue-50" 
                            : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                        )}>
                          {subject.name}
                        </a>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
          
          <div className="pt-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Support</h3>
            
            <a href="#" className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-primary">
              <i className="fas fa-question-circle mr-3 text-gray-500"></i>
              <span>Help Center</span>
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-primary">
              <i className="fas fa-comment-alt mr-3 text-gray-500"></i>
              <span>Contact Us</span>
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-primary">
              <i className="fas fa-cog mr-3 text-gray-500"></i>
              <span>Settings</span>
            </a>
          </div>
          
          <div className="pt-4">
            <Link href="/admin">
              <a className={cn(
                "flex items-center px-3 py-2 mt-1 text-sm font-medium rounded-md",
                location.startsWith("/admin") 
                  ? "text-primary bg-blue-50" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-primary"
              )}>
                <i className={cn("fas fa-shield-alt mr-3", location.startsWith("/admin") ? "text-primary" : "text-gray-500")}></i>
                <span>Admin Panel</span>
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}
