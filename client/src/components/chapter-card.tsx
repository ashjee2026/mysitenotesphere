import { Button } from "@/components/ui/button";
import { Chapter } from "@shared/schema";
import { Link } from "wouter";

interface ChapterCardProps {
  chapter: Chapter;
  subjectId: number;
  classId: number;
}

export default function ChapterCard({ chapter, subjectId, classId }: ChapterCardProps) {
  // Status badge styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            New
          </span>
        );
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            {chapter.name}
          </h3>
          <p className="mt-1 max-w-2xl text-xs text-gray-500">
            {chapter.lessons} lessons • {chapter.practices} practice sets
          </p>
        </div>
        {getStatusBadge(chapter.status)}
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {/* We'd normally map through topics here, but we'll show two placeholders */}
          <div className="py-3 sm:py-3 sm:grid sm:px-6">
            <a href="#" className="text-sm font-medium text-primary hover:text-primary-700 flex items-center">
              <i className="ri-file-text-line mr-2"></i>
              Introduction to the Chapter
            </a>
          </div>
          <div className="py-3 sm:py-3 sm:grid sm:px-6">
            <a href="#" className="text-sm font-medium text-primary hover:text-primary-700 flex items-center">
              <i className="ri-file-text-line mr-2"></i>
              Key Concepts
            </a>
          </div>
        </dl>
      </div>
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 sm:px-6">
        <Link href={`/class/${classId}/subject/${subjectId}/chapter/${chapter.id}`}>
          <Button 
            variant="primary" 
            size="sm"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-700"
          >
            View Full Chapter
          </Button>
        </Link>
      </div>
    </div>
  );
}
