import Link from "next/link"
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">RW</span>
              </div>
              <span className="font-serif font-bold text-xl gradient-text">Rembug Warga</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Membangun komunitas yang kuat melalui teknologi dan kebersamaan. Bersama kita wujudkan desa yang modern,
              guyub, dan sejahtera.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navigasi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Jl. Harmoni No. 123
                  <br />
                  Desa Harmoni, Kec. Sejahtera
                  <br />
                  Kab. Damai 12345
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">info@desaharmoni.id</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">(021) 1234-5678</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Ikuti Kami</h3>
            <div className="flex space-x-3">
              <a
                href="#"
                className="glass-button w-10 h-10 rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Facebook className="h-4 w-4 text-primary" />
              </a>
              <a
                href="#"
                className="glass-button w-10 h-10 rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Instagram className="h-4 w-4 text-primary" />
              </a>
              <a
                href="#"
                className="glass-button w-10 h-10 rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Twitter className="h-4 w-4 text-primary" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Rembug Warga - Desa Harmoni. Semua hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}
