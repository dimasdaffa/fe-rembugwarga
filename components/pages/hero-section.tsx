import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Calendar, Camera } from "lucide-react"

export function HeroSection() {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                Selamat Datang di <span className="gradient-text">Desa Harmoni</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Rembug Warga: Modern, Guyub, Sejahtera. Membangun komunitas yang kuat melalui teknologi dan kebersamaan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="glass-button text-primary font-semibold group">
                Bergabung Sekarang
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="glass-card bg-transparent">
                Pelajari Lebih Lanjut
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-2 mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">250+</div>
                <div className="text-sm text-muted-foreground">Keluarga</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-2 mx-auto">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">Kegiatan</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-2 mx-auto">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">1000+</div>
                <div className="text-sm text-muted-foreground">Foto</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="glass-card rounded-2xl p-8 floating-animation">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Komunitas Desa Harmoni"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Floating Cards */}
            <div
              className="absolute -top-4 -left-4 glass-card rounded-lg p-4 floating-animation"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Updates</span>
              </div>
            </div>

            <div
              className="absolute -bottom-4 -right-4 glass-card rounded-lg p-4 floating-animation"
              style={{ animationDelay: "2s" }}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-primary">98%</div>
                <div className="text-xs text-muted-foreground">Kepuasan</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
