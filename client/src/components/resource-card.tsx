import { Resource } from "@shared/schema";
import { Link } from "wouter";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  // Icon and background color based on resource type
  const getIconStyles = (type: string) => {
    switch (type) {
      case "video":
        return {
          bgColor: "bg-primary-100",
          textColor: "text-primary",
          icon: "ri-youtube-line"
        };
      case "paper":
        return {
          bgColor: "bg-secondary-100",
          textColor: "text-secondary-600",
          icon: "ri-file-paper-2-line"
        };
      case "experiment":
        return {
          bgColor: "bg-accent-100",
          textColor: "text-accent-600",
          icon: "ri-flask-line"
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          icon: "ri-file-list-line"
        };
    }
  };

  const iconStyles = getIconStyles(resource.type);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconStyles.bgColor} rounded-md p-3`}>
            <i className={`${iconStyles.icon} ${iconStyles.textColor} text-xl`}></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-900 truncate">
                {resource.title}
              </dt>
              <dd>
                <span className="text-xs text-gray-500">
                  {resource.metadata}
                </span>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link href={`/resources/${resource.type}/${resource.id}`}>
            <a className="font-medium text-primary hover:text-primary-500">
              View all
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
