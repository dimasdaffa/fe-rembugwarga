'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Definisikan tipe data untuk pengumuman
interface Announcement {
  id: number;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
}

export default function DashboardPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fungsi untuk Logout
  const handleLogout = () => {
    Cookies.remove('auth_token');
    router.push('/login');
  };

  useEffect(() => {
    // Cek apakah token ada, jika tidak, tendang ke halaman login
    const token = Cookies.get('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fungsi untuk mengambil data pengumuman dari API
    const fetchAnnouncements = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const response = await fetch(`${apiUrl}/announcements`, {
          method: 'GET',
          headers: {
            // Walaupun publik, kita bisa saja mengirim token
            // Tapi untuk endpoint ini tidak wajib
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        setAnnouncements(data.data); // data.data karena ada pagination
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [router]);

  if (loading) {
    return <div className="p-8">Memuat data...</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Pengumuman</h1>
        <Button onClick={handleLogout} variant="destructive">Logout</Button>
      </div>

      <div className="grid gap-6">
        {announcements.length > 0 ? (
          announcements.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  Oleh: {item.author_name} - Diposting pada: {item.created_at}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{item.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>Belum ada pengumuman.</p>
        )}
      </div>
    </div>
  );
}