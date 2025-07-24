'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


// Definisikan tipe data untuk Invoice
interface Invoice {
  id: number;
  amount: number;
  period: string;
  status: 'pending' | 'waiting_verification' | 'paid';
  payment_proof_url: string | null;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // State untuk dialog upload
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const token = Cookies.get('auth_token');

  const fetchInvoices = async () => {
    if (!token) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/invoices`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
      if (!response.ok) throw new Error('Gagal mengambil data tagihan');
      const data = await response.json();
      setInvoices(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      fetchInvoices();
    }
  }, [router, token]);

  const handleOpenDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
    setUploadError('');
    setSelectedFile(null);
  };
  
  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedInvoice || !token) return;
    
    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('proof', selectedFile);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    try {
      const response = await fetch(`${apiUrl}/invoices/${selectedInvoice.id}/upload-proof`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload gagal');
      }

      // Sukses
      setIsDialogOpen(false);
      // Refresh data tagihan untuk melihat status terbaru
      await fetchInvoices(); 
      alert('Upload bukti berhasil! Menunggu verifikasi admin.');

    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };
  
  // ... (fungsi formatCurrency dan formatPeriod tetap sama)
  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  const formatPeriod = (period: string) => new Date(period).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  if (loading) return <div className="p-8">Memuat data tagihan...</div>;

  return (
    <>
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Daftar Tagihan Saya</h1>
            <Button asChild><Link href="/dashboard">Kembali ke Dashboard</Link></Button>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Periode</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{formatPeriod(invoice.period)}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={ invoice.status === 'paid' ? 'default' : invoice.status === 'waiting_verification' ? 'secondary' : 'destructive' }>
                      {invoice.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {invoice.status === 'pending' && (
                      <Button size="sm" onClick={() => handleOpenDialog(invoice)}>Upload Bukti</Button>
                    )}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={4} className="text-center">Belum ada tagihan.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Dialog untuk Upload Bukti */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
            <DialogDescription>
              Untuk periode {selectedInvoice ? formatPeriod(selectedInvoice.period) : ''} sebesar {selectedInvoice ? formatCurrency(selectedInvoice.amount) : ''}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="proof-file" className="text-right">File Gambar</Label>
                <Input
                  id="proof-file"
                  type="file"
                  className="col-span-3"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  required
                />
              </div>
              {uploadError && <p className="text-sm text-red-600 col-span-4 text-center">{uploadError}</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Batal</Button>
              </DialogClose>
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Mengupload...' : 'Kirim'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}