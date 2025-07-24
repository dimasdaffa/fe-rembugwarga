'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

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

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchAnnouncements = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const response = await fetch(`${apiUrl}/announcements`);
        const data = await response.json();
        setAnnouncements(data.data);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [router]);

  if (loading) {
    return <div>Memuat data...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pengumuman Terbaru</h1>
      
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