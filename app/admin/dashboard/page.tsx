'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker'; // <-- Import komponen baru
import { format } from 'date-fns'; // <-- Import format dari date-fns

export default function AdminDashboardPage() {
  // State untuk form Generate Tagihan
  const [period, setPeriod] = useState<Date | undefined>(new Date()); // <-- Ubah state menjadi Date
  const [amount, setAmount] = useState('65000');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleGenerateInvoices = async (e: FormEvent) => {
    e.preventDefault();
    if (!period) {
      setMessage({ type: 'error', text: 'Periode harus diisi.' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });

    const token = Cookies.get('auth_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      // Format tanggal menjadi YYYY-MM-DD sebelum dikirim ke API
      const formattedPeriod = format(period, 'yyyy-MM-dd');

      const response = await fetch(`${apiUrl}/admin/invoices/generate-monthly`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          period: formattedPeriod,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Terjadi kesalahan');
      setMessage({ type: 'success', text: data.message });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate Tagihan Bulanan</CardTitle>
            <CardDescription>Buat tagihan iuran untuk semua warga dalam satu klik.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateInvoices} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="period">Periode</Label>
                <div>
                  {/* Ganti <Input> dengan <DatePicker> */}
                  <DatePicker date={period} setDate={setPeriod} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah Iuran (Rp)</Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              {message.text && (
                <p className={`text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                  {message.text}
                </p>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? 'Memproses...' : 'Generate Tagihan'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Menu Admin</CardTitle>
            <CardDescription>Akses fitur-fitur administratif lainnya.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
             <Button asChild variant="outline"><Link href="/admin/verifikasi">Verifikasi Pembayaran</Link></Button>
             <Button asChild variant="outline"><Link href="/admin/expenses">Manajemen Pengeluaran</Link></Button>
             <Button asChild variant="outline"><Link href="/admin/laporan">Laporan Keuangan</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}