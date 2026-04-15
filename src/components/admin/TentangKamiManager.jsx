import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/FileUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, Upload, Image as ImageIcon, Video, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { tentangKamiAPI } from '@/services/api';

// Helper: ekstrak YouTube video ID
const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

const ICON_OPTIONS = ['History', 'Building', 'Award', 'Users', 'Bookmark', 'Star', 'Heart', 'Zap'];

export default function TentangKamiManager() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [videoInputMode, setVideoInputMode] = useState('upload');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_type: 'History',
    image: null,
    video_url: '',
    video_file: null,
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const result = await tentangKamiAPI.getAll();
      if (result.status === 'success') {
        setItems(result.data);
      } else {
        throw new Error(result.message || 'Gagal memuat data tentang kami');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Gagal memuat data tentang kami',
        variant: 'destructive'
      });
    }
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleFileSelect = async (file) => {
    try {
      const base64 = await convertToBase64(file);
      const isVideo = file.type.startsWith('video/');
      setFilePreview({ url: base64, type: isVideo ? 'video' : 'image' });
      setFormData((prev) => ({
        ...prev,
        image: isVideo ? prev.image : base64,
        video_file: isVideo ? base64 : prev.video_file,
        video_url: isVideo ? '' : prev.video_url
      }));
    } catch {
      toast({ title: 'Error', description: 'Gagal memproses file', variant: 'destructive' });
    }
  };

  const isValidVideoUrl = (url) => {
    if (!url) return false;
    const ytId = getYouTubeId(url);
    if (ytId) return true;
    return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      toast({ title: 'Validasi Error', description: 'Judul harus diisi', variant: 'destructive' });
      return;
    }

    try {
      setIsLoading(true);

      const submitData = editingItem
        ? {
            ...formData,
            id: editingItem.id,
            image: formData.image || editingItem.image || null,
            video_url: formData.video_url || editingItem.video_url || null,
            video_file: formData.video_file || editingItem.video_file || null
          }
        : { ...formData, id: `tentang_${Date.now()}` };

      const action = editingItem ? tentangKamiAPI.update : tentangKamiAPI.create;
      const result = await action(submitData);

      if (result.status === 'success') {
        await loadItems();
        setIsDialogOpen(false);
        resetForm();
        toast({
          title: 'Berhasil',
          description: editingItem ? 'Data berhasil diperbarui' : 'Data berhasil dibuat'
        });
      } else {
        throw new Error(result.message || 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({ title: 'Error', description: error.message || 'Gagal menyimpan data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm('Yakin ingin menghapus item ini?')) return;
    try {
      const result = await tentangKamiAPI.delete(itemId);
      if (result.status === 'success') {
        await loadItems();
        toast({ title: 'Berhasil dihapus', description: 'Item telah dihapus.' });
      } else {
        throw new Error(result.message || 'Gagal menghapus item');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({ title: 'Error', description: error.message || 'Gagal menghapus item', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon_type: 'History',
      image: null,
      video_url: '',
      video_file: null,
      display_order: 0,
      is_active: true
    });
    setFilePreview(null);
    setEditingItem(null);
    setVideoInputMode('upload');
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      icon_type: item.icon_type || 'History',
      image: item.image || null,
      video_url: item.video_url || '',
      video_file: item.video_file || null,
      display_order: item.display_order || 0,
      is_active: item.is_active !== false
    });
    if (item.video_url) {
      setFilePreview({ url: item.video_url, type: 'video-url' });
      setVideoInputMode('link');
    } else if (item.video_file) {
      setFilePreview({ url: item.video_file, type: 'video' });
      setVideoInputMode('upload');
    } else if (item.image) {
      setFilePreview({ url: item.image, type: 'image' });
    }
    setIsDialogOpen(true);
  };

  const VideoUrlPreview = ({ url }) => {
    const ytId = getYouTubeId(url);
    if (ytId) {
      return (
        <div className="mt-2 aspect-video rounded-lg overflow-hidden border">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title="YouTube Preview"
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      );
    }
    if (/\.(mp4|webm|ogg)/i.test(url)) {
      return (
        <video controls className="mt-2 w-full rounded-lg border max-h-48">
          <source src={url} />
        </video>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsDialogOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Item Tentang Kami
      </Button>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) { setIsDialogOpen(false); resetForm(); } else setIsDialogOpen(true); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Buat'} Item Tentang Kami</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* Judul */}
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input
                placeholder="Contoh: Sejarah Singkat, Fasilitas Sekolah..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                placeholder="Tuliskan deskripsi lengkap tentang item ini..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
              />
            </div>

            {/* Tipe Icon */}
            <div className="space-y-2">
              <Label>Tipe Icon</Label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={formData.icon_type}
                onChange={(e) => setFormData({ ...formData, icon_type: e.target.value })}
              >
                {ICON_OPTIONS.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>

            {/* Urutan Tampilan */}
            <div className="space-y-2">
              <Label>Urutan Tampilan (angka rendah = muncul duluan)</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            {/* Gambar */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><ImageIcon className="h-4 w-4" /> Unggah Gambar</Label>
              <FileUpload
                accept="image/*"
                onFileSelect={handleFileSelect}
                preview={filePreview?.type === 'image' ? filePreview : null}
                onClear={() => {
                  setFilePreview(null);
                  setFormData((p) => ({ ...p, image: null }));
                }}
              />
            </div>

            {/* Video */}
            <div className="space-y-4 border-t pt-4">
              <Label className="flex items-center gap-1"><Video className="h-4 w-4" /> Media Video</Label>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={videoInputMode === 'upload' ? 'default' : 'outline'}
                  onClick={() => setVideoInputMode('upload')}
                  size="sm"
                >
                  Upload File
                </Button>
                <Button
                  type="button"
                  variant={videoInputMode === 'link' ? 'default' : 'outline'}
                  onClick={() => setVideoInputMode('link')}
                  size="sm"
                >
                  Gunakan Link
                </Button>
              </div>

              {videoInputMode === 'upload' ? (
                <FileUpload
                  accept="video/*"
                  onFileSelect={handleFileSelect}
                  preview={filePreview?.type === 'video' ? filePreview : null}
                  onClear={() => {
                    setFilePreview(null);
                    setFormData((p) => ({ ...p, video_file: null }));
                  }}
                />
              ) : (
                <>
                  <Input
                    placeholder="Paste link YouTube atau URL video langsung (.mp4, .webm)"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  />
                  {formData.video_url && <VideoUrlPreview url={formData.video_url} />}
                </>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_active" className="cursor-pointer">Aktifkan item ini</Label>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Menyimpan...' : editingItem ? 'Perbarui' : 'Buat'}
            </Button>
            <Button
              variant="outline"
              onClick={() => { setIsDialogOpen(false); resetForm(); }}
            >
              Batal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* List Items */}
      <div className="space-y-2 mt-6">
        <h3 className="font-semibold">Item Tentang Kami ({items.length})</h3>
        {items.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-center text-gray-500">
              Tidak ada item. Tambahkan item baru untuk memulai.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
                      <div className="flex gap-2 mt-2 text-xs text-gray-500">
                        <span>Icon: {item.icon_type}</span>
                        <span>Order: {item.display_order}</span>
                        <span>{item.is_active ? '✓ Aktif' : '✗ Nonaktif'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
