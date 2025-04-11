/**
 * Book formats supported by the platform
 */
export const BOOK_FORMATS = ["PDF", "EPUB", "MOBI"] as const;

/**
 * Default book cover image for when no image is provided
 */
export const DEFAULT_BOOK_COVER = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop";

/**
 * Configuration for pagination limits
 */
export const PAGINATION = {
  BOOKS_PER_PAGE: 5,
  RECENT_BOOKS_LIMIT: 3,
  FEATURED_BOOKS_LIMIT: 3,
};

/**
 * Subject icons mapping (for future use)
 */
export const SUBJECT_ICONS = {
  "Physics": "fa-atom",
  "Chemistry": "fa-flask",
  "Mathematics": "fa-square-root-alt",
  "Biology": "fa-dna",
  "English": "fa-book",
  "Social Studies": "fa-globe",
  "default": "fa-book-open"
};

/**
 * Topic tags color mapping
 */
export const TOPIC_COLORS = {
  "Electrostatics": { bg: "bg-blue-100", text: "text-blue-800" },
  "Current Electricity": { bg: "bg-indigo-100", text: "text-indigo-800" },
  "Magnetism": { bg: "bg-purple-100", text: "text-purple-800" },
  "Optics": { bg: "bg-cyan-100", text: "text-cyan-800" },
  "Modern Physics": { bg: "bg-pink-100", text: "text-pink-800" },
  "Mechanics": { bg: "bg-amber-100", text: "text-amber-800" },
  "Thermodynamics": { bg: "bg-orange-100", text: "text-orange-800" },
  "Waves": { bg: "bg-emerald-100", text: "text-emerald-800" },
  "default": { bg: "bg-gray-100", text: "text-gray-800" }
};

/**
 * Class names and their corresponding configurations
 */
export const CLASS_CONFIG = {
  "Class 10": { icon: "fa-graduation-cap", color: "text-blue-500" },
  "Class 11": { icon: "fa-graduation-cap", color: "text-indigo-500" },
  "Class 12": { icon: "fa-graduation-cap", color: "text-purple-500" },
  "JEE": { icon: "fa-award", color: "text-amber-500" },
  "NEET": { icon: "fa-heartbeat", color: "text-green-500" },
};
