import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { EventsPreview } from "@/components/pages/events-preview"
import { GalleryPreview } from "@/components/pages/gallery-preview"
import { HeroSection } from "@/components/pages/hero-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <Navbar />
      <main>
        <HeroSection />
        <EventsPreview />
        <GalleryPreview />
      </main>
      <Footer />
    </div>
  )
}
