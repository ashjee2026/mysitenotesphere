import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Learning Today</h2>
          <p className="text-lg text-white/90 mb-8">
            Access thousands of free educational resources to excel in your studies and competitive exams.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#categories">
              <Button
                variant="hero"
                size="hero"
              >
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
