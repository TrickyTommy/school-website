import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FileUpload } from '@/components/FileUpload';
import { principalsAPI } from '@/services/api';

export default function PrincipalsManager() {
  const [principals, setPrincipals] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrincipal, setEditingPrincipal] = useState(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nama: '',
    tahun_jabatan: '',
    foto: null
  });

  useEffect(() => {
    loadPrincipals();
  }, []);

  const loadPrincipals = async () => {
    try {
      const result = await principalsAPI.getAll();
      if (result.status === 'success') {
        setPrincipals(result.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data kepala sekolah",
        variant: "destructive"
      });
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.nama || !formData.tahun_jabatan) {
        toast({
          title: "Validasi Error",
          description: "Nama dan periode harus diisi",
          duration: 3000,
          variant: "destructive"
        });
        return;
      }

      let submitData = {
        ...(editingPrincipal?.id && { id: editingPrincipal.id }),
        nama: formData.nama,
        tahun_jabatan: formData.tahun_jabatan,
      };

      // Handle photo data with webp support
      if (formData.foto === null || formData.foto === '') {
        submitData.foto = null;
      } else if (formData.foto instanceof File) {
        const base64 = await convertToBase64(formData.foto);
        submitData.foto = base64.split(',')[1];
      } else if (typeof formData.foto === 'string') {
        submitData.foto = formData.foto.replace(/^data:image\/[a-z]+;base64,/, '');
      }

      const result = await (editingPrincipal ? 
        principalsAPI.update(submitData) : 
        principalsAPI.create(submitData));

      if (result.status === 'success') {
        await loadPrincipals();
        setIsDialogOpen(false);
        resetForm();
        toast({
          title: "Berhasil",
          description: editingPrincipal ? "Data berhasil diperbarui" : "Data berhasil ditambahkan",
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    try {
      const result = await principalsAPI.delete(id);
      if (result.status === 'success') {
        await loadPrincipals();
        toast({
          title: "Berhasil",
          description: result.message
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus data",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      tahun_jabatan: '',
      foto: null
    });
    setEditingPrincipal(null);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      foto: null
    }));
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsDialogOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kepala Sekolah
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPrincipal ? 'Edit' : 'Tambah'} Kepala Sekolah</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Lengkap</Label>
              <Input
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
              />
            </div>
            <div>
              <Label>Periode Jabatan</Label>
              <Input
                value={formData.tahun_jabatan}
                onChange={(e) => setFormData({...formData, tahun_jabatan: e.target.value})}
              />
            </div>
            <div>
              <Label>Foto</Label>
              <div className="space-y-2">
                <FileUpload
                  accept="image/*,.webp"
                  onFileSelect={(file) => {
                    if (!file) return;
                    
                    if (file.size > 5000000) {
                      toast({
                        title: "Error",
                        description: "Ukuran file terlalu besar (maksimal 5MB)",
                        variant: "destructive",
                        duration: 3000
                      });
                      return;
                    }

                    // Validate file type
                    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
                    if (!validTypes.includes(file.type)) {
                      toast({
                        title: "Error",
                        description: "Format file tidak didukung",
                        variant: "destructive",
                        duration: 3000
                      });
                      return;
                    }

                    setFormData(prev => ({...prev, foto: file}));
                  }}
                  preview={formData.foto ? {
                    type: 'image',
                    url: formData.foto instanceof File ? 
                      URL.createObjectURL(formData.foto) : 
                      (formData.foto?.startsWith('data:') ? formData.foto : `data:image/jpeg;base64,${formData.foto}`)
                  } : null}
                  onRemove={handleRemoveImage}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}>
                Batal
              </Button>
              <Button onClick={handleSubmit}>
                {editingPrincipal ? 'Perbarui' : 'Simpan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {principals.map((principal) => (
          <Card key={principal.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={principal.foto ? 
                    (principal.foto.startsWith('data:') ? principal.foto : `data:image/jpeg;base64,${principal.foto}`) 
                    : '/placeholder-user.jpg'}
                  alt={principal.nama}
                  className="w-12 h-12 rounded-full object-cover bg-gray-100"
                  onError={(e) => {
                    e.target.src = '/placeholder-user.jpg';
                  }}
                />
                <div>
                  <h3 className="font-semibold">{principal.nama}</h3>
                  <p className="text-sm text-gray-500">{principal.tahun_jabatan}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({
                      nama: principal.nama,
                      tahun_jabatan: principal.tahun_jabatan,
                      foto: principal.foto || ''  // Use empty string for editing mode
                    });
                    setEditingPrincipal(principal);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(principal.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
