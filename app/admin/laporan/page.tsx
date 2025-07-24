'use client';

import { useState, FormEvent } from 'react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Definisikan tipe data untuk ringkasan
interface SummaryData {
  total_income: number;
  total_expense: number;
  balance: number;
}

// Definisikan tipe data untuk rincian (bisa Invoice atau Expense)
interface TransactionDetail {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

export default function ReportPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [details, setDetails] = useState<TransactionDetail[]>([]);
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
    setSummary(null);
    setDetails([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      // 1. Ambil data ringkasan
      const summaryRes = await fetch(`${apiUrl}/admin/financial-summary?year=${period.year}&month=${period.month}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
      if (!summaryRes.ok) throw new Error('Gagal mengambil ringkasan');
      const summaryData = await summaryRes.json();
      setSummary(summaryData.summary);

      // 2. Ambil rincian pemasukan (invoice lunas)
      const incomeRes = await fetch(`${apiUrl}/admin/invoices?status=paid`, {
         headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
      const incomeData = await incomeRes.json();
      const incomeDetails = incomeData.data.map((inv: any) => ({
          id: `inc-${inv.id}`,
          date: inv.updated_at,
          description: `Iuran dari ${inv.user.name} (${inv.user.house_number})`,
          amount: inv.amount,
          type: 'income'
      }));

      // 3. Ambil rincian pengeluaran
      const expenseRes = await fetch(`${apiUrl}/admin/expenses`, {
         headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
      const expenseData = await expenseRes.json();
      const expenseDetails = expenseData.data.map((exp: any) => ({
          id: `exp-${exp.id}`,
          date: exp.date,
          description: exp.description,
          amount: exp.amount,
          type: 'expense'
      }));

      // 4. Gabungkan dan urutkan semua rincian berdasarkan tanggal
      setDetails([...incomeDetails, ...expenseDetails].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    } catch (error) {
      console.error(error);
      alert('Gagal memuat laporan.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Laporan Keuangan</h1>

      {/* Form Filter Periode */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Periode Laporan</CardTitle>
        </CardHeader>
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
            <Button type="submit" disabled={loading}>{loading ? 'Memuat...' : 'Tampilkan Laporan'}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Hasil Laporan */}
      {summary && (
        <div className="space-y-6">
          {/* Kartu Ringkasan */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>Total Pemasukan</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(summary.total_income)}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Pengeluaran</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-red-600">{formatCurrency(summary.total_expense)}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Saldo Akhir</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{formatCurrency(summary.balance)}</p></CardContent>
            </Card>
          </div>

          {/* Tabel Rincian */}
          <Card>
            <CardHeader><CardTitle>Rincian Transaksi</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.date).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}