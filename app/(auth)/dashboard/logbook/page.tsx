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
interface Transaction {
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
}
interface Summary {
  total_income: number;
  total_expense: number;
  final_balance: number;
}

export default function LogbookPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
  });
  const token = Cookies.get('auth_token');

  const fetchLogbook = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/reports/logbook?year=${period.year}&month=${period.month}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setTransactions(data.transactions);
      setSummary(data.summary);
    } catch (error) {
      console.error(error);
      alert('Gagal memuat logbook.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Logbook Keuangan</h1>
      <Card>
        <CardHeader><CardTitle>Pilih Periode</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={fetchLogbook} className="flex items-end gap-4">
            <div className="grid gap-2">
              <Label htmlFor="year">Tahun</Label>
              <Input id="year" name="year" type="number" value={period.year} onChange={(e) => setPeriod({...period, year: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="month">Bulan</Label>
              <Input id="month" name="month" type="number" min="1" max="12" value={period.month} onChange={(e) => setPeriod({...period, month: e.target.value})} />
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Memuat...' : 'Tampilkan'}</Button>
          </form>
        </CardContent>
      </Card>

      {summary && (
        <>
        <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><CardTitle>Total Pemasukan</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(summary.total_income)}</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Total Pengeluaran</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{formatCurrency(summary.total_expense)}</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Saldo Akhir Bulan</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatCurrency(summary.final_balance)}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Rincian Transaksi</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Waktu</TableHead><TableHead>Deskripsi</TableHead><TableHead className="text-right">Debit (Masuk)</TableHead><TableHead className="text-right">Kredit (Keluar)</TableHead></TableRow></TableHeader>
              <TableBody>
                {transactions.map((trx, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(trx.date)}</TableCell>
                    <TableCell>{trx.description}</TableCell>
                    <TableCell className="text-right text-green-600">{trx.type === 'income' ? formatCurrency(trx.amount) : '-'}</TableCell>
                    <TableCell className="text-right text-red-600">{trx.type === 'expense' ? formatCurrency(trx.amount) : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </>
      )}
    </div>
  );
}