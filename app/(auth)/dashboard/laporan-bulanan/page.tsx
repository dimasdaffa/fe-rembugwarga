'use client';

import { useState, FormEvent } from 'react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

// Definisikan tipe data
interface PaymentStatus {
  user_id: number;
  name: string;
  house_number: string;
  status: string;
}
interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export default function WargaReportPage() {
  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
  });
  const token = Cookies.get('auth_token');

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeriod({ ...period, [e.target.name]: e.target.value });
  };

  const fetchReports = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      // Ambil data status pembayaran
      const statusRes = await fetch(`${apiUrl}/reports/payment-status?year=${period.year}&month=${period.month}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const statusData = await statusRes.json();
      setPaymentStatuses(statusData);

      // Ambil data pengeluaran
      const expenseRes = await fetch(`${apiUrl}/reports/expenses?year=${period.year}&month=${period.month}`, {
         headers: { 'Authorization': `Bearer ${token}` },
      });
      const expenseData = await expenseRes.json();
      setExpenses(expenseData);
    } catch (error) {
      console.error(error);
      alert('Gagal memuat laporan.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Laporan Keuangan Warga</h1>
      <Card>
        <CardHeader><CardTitle>Pilih Periode</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={fetchReports} className="flex items-end gap-4">
            <div className="grid gap-2">
              <Label htmlFor="year">Tahun</Label>
              <Input id="year" name="year" type="number" value={period.year} onChange={handlePeriodChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="month">Bulan</Label>
              <Input id="month" name="month" type="number" min="1" max="12" value={period.month} onChange={handlePeriodChange} />
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Memuat...' : 'Tampilkan'}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabel Status Pembayaran */}
      <Card>
        <CardHeader><CardTitle>Status Pembayaran Iuran Warga</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>No. Rumah</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {paymentStatuses.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.house_number}</TableCell>
                  <TableCell><Badge variant={user.status === 'paid' ? 'default' : 'destructive'}>{user.status.replace('_', ' ')}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Tabel Pengeluaran */}
      <Card>
        <CardHeader><CardTitle>Rincian Pengeluaran Bulan Ini</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Tanggal</TableHead><TableHead>Deskripsi</TableHead><TableHead className="text-right">Jumlah</TableHead></TableRow></TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{new Date(expense.date).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}