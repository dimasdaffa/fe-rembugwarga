'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Definisikan tipe data untuk notifikasi
interface Notification {
  id: string;
  data: {
    message: string;
  };
  created_at: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    const token = Cookies.get('auth_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${apiUrl}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
      if (!response.ok) throw new Error('Gagal mengambil notifikasi');
      const data = await response.json();
      setNotifications(data.data); // data.data karena pagination
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      fetchNotifications();
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifikasi</h4>
            <p className="text-sm text-muted-foreground">
              Pemberitahuan terbaru untuk Anda.
            </p>
          </div>
          <div className="grid gap-2">
            {loading ? <p>Memuat...</p> : 
              notifications.length > 0 ? notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
                >
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">
                      {notification.data.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              )) : <p className="text-sm">Belum ada notifikasi.</p>
            }
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}