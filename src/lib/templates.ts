export interface VisualTemplate {
  id: string;
  name: string;
  description: string;
  previewUrl?: string;
}

export const VISUAL_TEMPLATES: VisualTemplate[] = [
  {
    id: "spotlight",
    name: "Product Spotlight",
    description: "Overlay text with price on a background image.",
    previewUrl: "https://images.unsplash.com/photo-1524147043834-0852e90f2b3b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "modern-text",
    name: "Modern Typography",
    description: "Clean, bold text on a vibrant gradient background.",
    previewUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "split-banner",
    name: "Split Banner",
    description: "Half image and half focused message with a CTA.",
    previewUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "minimal-alert",
    name: "Minimalist Alert",
    description: "High-contrast announcement with a minimalist aesthetic.",
    previewUrl: "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "video-background",
    name: "Video Canvas",
    description: "Text overlay on a looping YouTube video.",
    previewUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop",
  }
];
