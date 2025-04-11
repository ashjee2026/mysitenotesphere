import { useEffect } from "react";
import MainLayout from "@/layouts/main-layout";
import { useQuery } from "@tanstack/react-query";
import { Class, Subject } from "@shared/schema";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SUBJECTS } from "@/lib/constants";
import Breadcrumb, { BreadcrumbItem } from "@/components/breadcrumb";

export default function ClassPage() {
  const [match, params] = useRoute("/class/:classId");
  const classId = params?.classId;
  const { toast } = useToast();

  // Fetch class details from API
  const { data: classDetails, isLoading, error } = useQuery<Class>({
    queryKey: [`/api/classes/${classId}`],
  });

  // Fetch subjects for this class
  const { data: subjects, isLoading: subjectsLoading } = useQuery<Subject[]>({
    queryKey: [`/api/classes/${classId}/subjects`],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load class details",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Breadcrumb navigation items
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: classId || "",
      name: classDetails ? (typeof classDetails.id === 'number' ? `Class ${classDetails.name}` : classDetails.name) : 
        ((typeof classId === 'string' && !Number.isNaN(+classId)) ? `Class ${classId}` : String(classId)),
      href: `/class/${classId}`,
    },
  ];

  // If no class is found or loading, use static data
  const usedSubjects = subjects || 
    (classId && SUBJECTS[classId as keyof typeof SUBJECTS] ? 
      SUBJECTS[classId as keyof typeof SUBJECTS] : []);

  return (
    <MainLayout>
      <Breadcrumb items={breadcrumbItems} />

      {/* Class Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isLoading ? (
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
              ) : (
                classDetails ? 
                  (typeof classDetails.id === 'number' ? `Class ${classDetails.name}` : classDetails.name) :
                  ((typeof classId === 'string' && !Number.isNaN(+classId)) ? `Class ${classId}` : String(classId))
              )}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isLoading ? (
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
              ) : (
                classDetails?.description || 
                  (typeof classId === 'string' && !Number.isNaN(+classId)) ? 
                    `All subjects and resources for Class ${classId}` : 
                    `Comprehensive material for ${classId} preparation`
              )}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:flex space-x-3">
            <Button 
              variant="outline"
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <i className="ri-filter-3-line mr-2"></i>
              Filter
              <i className="ri-arrow-down-s-line ml-2"></i>
            </Button>
            <Button>
              <i className="ri-download-cloud-line mr-2"></i>
              Download All
            </Button>
          </div>
        </div>
      </div>

      {/* Subject Grid */}
      <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-medium text-gray-900">Subjects</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subjectsLoading ? (
            // Loading placeholders
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-200 rounded-md p-3 w-12 h-12 animate-pulse"></div>
                    <div className="ml-5 w-0 flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            usedSubjects.map((subject) => (
              <Link 
                key={subject.id} 
                href={`/class/${classId}/subject/${subject.id}`}
              >
                <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                        <i className={`ri-${subject.icon || 'book-open-line'} text-primary text-xl`}></i>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-900 truncate">
                            {subject.name}
                          </dt>
                          <dd>
                            <span className="text-xs text-gray-500">
                              Complete curriculum
                            </span>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <div className="font-medium text-primary hover:text-primary-500">
                        View all content
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Recent Updates Section */}
      <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Recent Updates</h3>
            <p className="mt-1 text-sm text-gray-500">Latest resources and materials added.</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="divide-y divide-gray-200">
              <li className="py-4">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-2">
                    <i className="ri-file-add-line text-green-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">New Practice Papers Added</p>
                    <p className="text-sm text-gray-500">25 new practice papers for all subjects</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">2 days ago</div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2">
                    <i className="ri-book-mark-line text-blue-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Updated Textbooks</p>
                    <p className="text-sm text-gray-500">Latest edition textbooks now available</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">1 week ago</div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-2">
                    <i className="ri-video-add-line text-purple-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">New Video Lectures</p>
                    <p className="text-sm text-gray-500">15 new concept explanation videos</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">2 weeks ago</div>
                </div>
              </li>
            </ul>
          </div>
          <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
            <div className="text-sm">
              <Link href="/updates">
                <a className="font-medium text-primary hover:text-primary-500">
                  View all updates <i className="ri-arrow-right-line ml-1"></i>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-700 rounded-lg shadow-xl overflow-hidden">
          <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">Need personalized guidance?</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-indigo-200">
                Connect with experienced teachers and mentors to get one-on-one assistance with your studies.
              </p>
              <Button 
                className="mt-8 bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-primary-600 hover:bg-indigo-50"
              >
                Connect with Mentors
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
