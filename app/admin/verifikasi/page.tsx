'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Definisikan tipe data untuk Invoice, termasuk data user
interface Invoice {
  id: number;
  amount: number;
  period: string;
  status: 'pending' | 'waiting_verification' | 'paid';
  payment_proof_url: string | null;
  user: {
    name: string;
    house_number: string;
  }
}

export default function VerificationPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = Cookies.get('auth_token');

  const fetchInvoicesToVerify = useCallback(async () => {
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      // Ambil data tagihan yang statusnya 'waiting_verification'
      const response = await fetch(`${apiUrl}/admin/invoices?status=waiting_verification`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();
      setInvoices(data.data);
    } catch (error) {
      console.error(error);
      // Jika token tidak valid atau bukan admin, tendang ke login
      if ((error as Response).status === 401 || (error as Response).status === 403) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router, token]);

  useEffect(() => {
    fetchInvoicesToVerify();
  }, [fetchInvoicesToVerify]);

  const handleVerify = async (invoiceId: number) => {
    if(!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/admin/invoices/${invoiceId}/verify`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Verifikasi gagal');

      // Jika berhasil, refresh data di tabel
      await fetchInvoicesToVerify();
      alert('Pembayaran berhasil diverifikasi!');

    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat verifikasi.');
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  const formatPeriod = (period: string) => new Date(period).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  if (loading) return <div className="p-8">Memuat data verifikasi...</div>;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Verifikasi Pembayaran</h1>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Warga</TableHead>
              <TableHead>No. Rumah</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Bukti Bayar</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.user.name}</TableCell>
                <TableCell>{invoice.user.house_number}</TableCell>
                <TableCell>{formatPeriod(invoice.period)}</TableCell>
                <TableCell>
                  {invoice.payment_proof_url ? (
                    <a href={`http://127.0.0.1:8000/storage/${invoice.payment_proof_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      Lihat Bukti
                    </a>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => handleVerify(invoice.id)}>Verifikasi</Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Tidak ada pembayaran yang perlu diverifikasi.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}