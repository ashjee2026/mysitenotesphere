
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              NoteSphere aims to make quality educational resources accessible to all students, regardless of their financial background. 
              We believe that education is a fundamental right, and every student deserves access to the best learning materials available.
            </p>
            <p className="text-gray-600">
              Our platform provides carefully curated resources for various educational levels, from class 10th to 12th, as well as 
              specialized materials for competitive exams like JEE and NEET.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Comprehensive textbooks and reference materials
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Subject-wise organized content
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Study materials for boards and competitive exams
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Resources from trusted educational sources
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Regular updates with the latest materials
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Simple and intuitive user interface
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About SuperToppers</h2>
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">
                NoteSphere is maintained by SuperToppers, a community dedicated to helping students achieve academic excellence. 
                Our team consists of passionate educators and top-performing students who understand the challenges faced by 
                students in their academic journey.
              </p>
              <p className="text-gray-600 mb-6">
                Join our Telegram community to get instant updates, access additional resources, and connect with like-minded students.
              </p>
              <div className="flex justify-center">
                <Button asChild className="bg-[#0088cc] hover:bg-[#0088cc]/90">
                  <a href="https://t.me/supertoppers" target="_blank" rel="noopener noreferrer">
                    Join our Telegram Channel
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">DMCA Disclaimer</h2>
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">
                SuperToppers (@supertoppers) respects the intellectual property rights of others and expects its users to do the same. 
                In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to claims of copyright 
                infringement committed using our service.
              </p>
              <p className="text-gray-600 mb-4">
                If you are a copyright owner, or are authorized to act on behalf of one, please submit your claim via email to{' '}
                <span className="font-semibold">dmca@supertoppers.com</span>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
