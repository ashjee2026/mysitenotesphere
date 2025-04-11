import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryAction?: {
    text: string;
    href: string;
  };
  secondaryAction?: {
    text: string;
    href: string;
  };
}

export default function CTASection({
  title = "Ready to ace your exams?",
  description = "Get personalized study plans, expert guidance, and comprehensive resources to help you succeed in your exams.",
  primaryAction = {
    text: "Create Study Plan",
    href: "/study-plan",
  },
  secondaryAction = {
    text: "Take Assessment",
    href: "/assessment",
  },
}: CTASectionProps) {
  return (
    <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-primary-700 rounded-lg shadow-xl overflow-hidden">
        <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
          <div className="lg:self-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">{title}</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-indigo-200">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={primaryAction.href}>
                <Button
                  className="bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-primary-600 hover:bg-indigo-50"
                >
                  {primaryAction.text}
                </Button>
              </Link>
              <Link href={secondaryAction.href}>
                <Button
                  variant="link"
                  className="text-base font-medium text-white hover:text-indigo-100 inline-flex items-center ml-0 md:ml-4"
                >
                  {secondaryAction.text}
                  <i className="ri-arrow-right-line ml-1"></i>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
