import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            NoteSphere aims to make quality educational resources accessible to all students, regardless of their financial background. 
            We believe that education is a fundamental right, and every student deserves access to the best learning materials available.
          </p>
          <p className="text-gray-700 mb-4">
            Our platform provides carefully curated resources for various educational levels, from class 10th to 12th, as well as 
            specialized materials for competitive exams like JEE and NEET.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Comprehensive textbooks and reference materials</li>
            <li>Subject-wise organized content</li>
            <li>Study materials for boards and competitive exams</li>
            <li>Resources from trusted educational sources</li>
            <li>Regular updates with the latest materials</li>
            <li>Simple and intuitive user interface</li>
          </ul>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">About SuperToppers</h2>
        <Card className="p-6 shadow-md bg-gradient-to-br from-gray-50 to-gray-100">
          <CardContent className="p-0">
            <p className="text-gray-700 mb-4">
              NoteSphere is maintained by SuperToppers, a community dedicated to helping students achieve academic excellence. 
              Our team consists of passionate educators and top-performing students who understand the challenges faced by 
              students in their academic journey.
            </p>
            <p className="text-gray-700 mb-6">
              Join our Telegram community to get instant updates, access additional resources, and connect with like-minded students.
            </p>
            <div className="flex justify-center">
              <Button asChild className="bg-blue-500 hover:bg-blue-600">
                <a href="https://t.me/supertoppers" target="_blank" rel="noopener noreferrer">
                  <i className="ri-telegram-fill mr-2"></i> Join our Telegram Channel
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">DMCA Disclaimer</h2>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <p className="text-gray-700 mb-4">
            SuperToppers (@supertoppers) respects the intellectual property rights of others and expects its users to do the same.
            In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to claims of copyright 
            infringement committed using our service if such claims are reported to our designated Copyright Agent identified below.
          </p>
          <p className="text-gray-700 mb-4">
            If you are a copyright owner, or are authorized to act on behalf of one, and you believe that your copyrighted work 
            has been copied in a way that constitutes copyright infringement, please submit your claim via email to 
            <span className="font-semibold"> dmca@supertoppers.com</span>, with the subject line: "Copyright Infringement" and include 
            in your claim the details specified below.
          </p>
          <p className="text-gray-700 mb-4">
            You can also reach us on our Telegram channel at <a className="text-blue-500 hover:underline" href="https://t.me/supertoppers" 
            target="_blank" rel="noopener noreferrer">https://t.me/supertoppers</a>.
          </p>
          <p className="text-gray-700 mb-4">
            Please note that we may share your complaint letter, including your name and contact information, with the user who posted 
            the content you are reporting. You may be liable for damages if you materially misrepresent that a product or activity 
            is infringing upon your copyrights.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link to="/">
          <Button variant="outline" className="mr-4">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}