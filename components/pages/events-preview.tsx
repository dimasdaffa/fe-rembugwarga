import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, ArrowRight } from "lucide-react"

const upcomingEvents = [
  {
    id: 1,
    title: "Gotong Royong Bulanan",
    date: "2025-01-25",
    time: "07:00 WIB",
    location: "Balai Desa",
    description: "Kegiatan bersih-bersih lingkungan dan perawatan fasilitas umum",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Rapat RT/RW",
    date: "2025-02-01",
    time: "19:30 WIB",
    location: "Aula Warga",
    description: "Pembahasan program kerja dan anggaran bulan Februari",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Pelatihan Digital",
    date: "2025-02-10",
    time: "14:00 WIB",
    location: "Ruang Serbaguna",
    description: "Workshop penggunaan aplikasi digital untuk warga",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export function EventsPreview() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
            Kegiatan <span className="gradient-text">Mendatang</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ikuti berbagai kegiatan menarik yang akan datang di komunitas kita
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="glass-card hover:shadow-lg transition-all duration-300 group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 glass-button rounded-lg px-3 py-1">
                  <span className="text-sm font-medium text-primary">Upcoming</span>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  {new Date(event.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  • {event.time}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  {event.location}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>

                <Button variant="ghost" className="w-full justify-between group/btn mt-4">
                  Pelajari Lebih Lanjut
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="glass-card bg-transparent">
            Lihat Semua Kegiatan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
