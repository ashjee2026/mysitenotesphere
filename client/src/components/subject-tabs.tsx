import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface SubjectTabsProps {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function SubjectTabs({ 
  tabs, 
  activeTab, 
  onTabChange 
}: SubjectTabsProps) {
  const [currentTab, setCurrentTab] = useState(activeTab || tabs[0]?.id || "");

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="mt-6 sm:mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "whitespace-nowrap py-3 px-5 border-b-2 font-medium text-sm",
                currentTab === tab.id 
                  ? "border-primary text-primary" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
