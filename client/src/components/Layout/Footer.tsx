import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t py-6">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="text-lg font-semibold">
            NoteSphere
          </Link>
          <p className="text-sm text-muted-foreground">
            Free educational resources for students
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <Link
            href="/category/class-10"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Class 10
          </Link>
          <Link
            href="/category/class-11"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Class 11
          </Link>
          <Link
            href="/category/class-12"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Class 12
          </Link>
          <Link
            href="/category/jee"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            JEE
          </Link>
          <Link
            href="/category/neet"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            NEET
          </Link>
        </div>
        
        <div className="flex flex-col items-center md:items-end">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NoteSphere
          </p>
          <p className="text-xs text-muted-foreground">
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}