import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Class, Subject } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ClassDropdownProps {
  classItem: Class;
  subjects: Subject[];
  isActive: boolean;
  currentSubjectId?: number;
}

export function ClassDropdown({ classItem, subjects, isActive, currentSubjectId }: ClassDropdownProps) {
  const [isOpen, setIsOpen] = useState(isActive);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("dropdown", isOpen && "dropdown-open")}>
      <button 
        onClick={toggleDropdown}
        className={cn(
          "dropdown-toggle flex items-center justify-between w-full p-2 rounded-md text-sm font-medium",
          isActive ? "bg-blue-50 text-primary" : "hover:bg-gray-100"
        )}
      >
        <div className="flex items-center">
          <i className={cn(`fas ${classItem.icon} mr-3`, isActive ? "text-primary" : "text-gray-500")}></i>
          <span>{classItem.name}</span>
        </div>
        <i className={cn(
          "fas",
          isOpen ? "fa-chevron-up" : "fa-chevron-down",
          isActive ? "text-primary" : "text-gray-400",
          "text-xs"
        )}></i>
      </button>
      <div className={cn("dropdown-content pl-5 mt-1 space-y-1", !isOpen && "hidden")}>
        {subjects.map((subject) => (
          <Link key={subject.id} href={`/subject/${subject.id}`}>
            <a className={cn(
              "flex items-center pl-8 py-2 text-sm font-medium rounded-md",
              currentSubjectId === subject.id
                ? "text-primary bg-blue-50" 
                : "text-gray-600 hover:bg-gray-100 hover:text-primary"
            )}>
              {subject.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
