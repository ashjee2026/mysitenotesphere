import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">NoteSphere - Unlock Learning</h1>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            Your ultimate resource for free educational materials. Access high-quality notes, textbooks, and study materials for boards and competitive exams.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#categories">
              <Button
                variant="hero"
                size="hero"
              >
                Explore Resources
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="heroOutline"
                size="hero"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 h-16 rounded-t-[50%] -mb-1"></div>
    </section>
  );
}
