import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const galleryImages = [
  {
    id: 1,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Festival Desa",
    category: "Perayaan",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Pemandangan Desa",
    category: "Alam",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Olahraga Warga",
    category: "Olahraga",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Kelas Memasak",
    category: "Kuliner",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Bermain Anak",
    category: "Anak-anak",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Arisan Lansia",
    category: "Sosial",
  },
]

export function GalleryPreview() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
            Galeri <span className="gradient-text">Komunitas</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Momen-momen berharga dari kehidupan sehari-hari komunitas kita
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative group cursor-pointer overflow-hidden rounded-lg ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div className="glass-card h-full">
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className={`w-full object-cover transition-all duration-300 group-hover:scale-105 ${
                    index === 0 ? "h-64 md:h-full" : "h-48"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <div className="glass-button rounded-lg px-3 py-1 w-fit mb-2">
                    <span className="text-xs font-medium text-primary">{image.category}</span>
                  </div>
                  <h3 className="text-white font-semibold">{image.alt}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="glass-button text-primary font-semibold">
            Lihat Semua Foto
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
