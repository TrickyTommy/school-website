import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/FileUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, Link, Upload, Image as ImageIcon, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { postinganAPI } from '@/services/api';

// Helper: ekstrak YouTube video ID dari berbagai format URL
const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

// Helper: tampilkan thumbnail / badge tipe postingan
const PostTypeBadge = ({ type }) => {
  const styles = {
    berita: 'bg-blue-100 text-blue-700',
    foto:   'bg-green-100 text-green-700',
    video:  'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[type] || 'bg-gray-100 text-gray-600'}`}>
      {type}
    </span>
  );
};

export default function PostinganManager() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // Mode input video: 'upload' atau 'link'
  const [videoInputMode, setVideoInputMode] = useState('upload');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'berita',
    category: '',
    image: null,
    video_url: '',   // URL YouTube / link video eksternal
    video_file: null // Base64 video upload
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const result = await postinganAPI.getAll();
      if (result.status === 'success') {
        setPosts(result.data);
      } else {
        throw new Error(result.message || 'Gagal memuat postingan');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Gagal memuat postingan',
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

  // Handle upload gambar/video
  const handleFileSelect = async (file) => {
    try {
      const base64 = await convertToBase64(file);
      const isVideo = file.type.startsWith('video/');
      setFilePreview({ url: base64, type: isVideo ? 'video' : 'image' });
      setFormData((prev) => ({
        ...prev,
        image: isVideo ? prev.image : base64,
        video_file: isVideo ? base64 : prev.video_file,
        // Reset URL jika user memilih upload
        video_url: isVideo ? '' : prev.video_url
      }));
    } catch {
      toast({ title: 'Error', description: 'Gagal memproses file', variant: 'destructive' });
    }
  };

  // Validasi URL YouTube
  const isValidVideoUrl = (url) => {
    if (!url) return false;
    const ytId = getYouTubeId(url);
    if (ytId) return true;
    // Juga terima URL .mp4 / .webm langsung
    return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      toast({ title: 'Validasi Error', description: 'Judul postingan harus diisi', variant: 'destructive' });
      return;
    }
    if (formData.type === 'video' && videoInputMode === 'link' && formData.video_url && !isValidVideoUrl(formData.video_url)) {
      toast({ title: 'Validasi Error', description: 'URL video tidak valid. Gunakan link YouTube atau URL video langsung (.mp4)', variant: 'destructive' });
      return;
    }

    try {
      setIsLoading(true);

      const submitData = editingPost
        ? {
            ...formData,
            id: editingPost.id,
            image: formData.image || editingPost.image || null,
            video_url: formData.video_url || editingPost.video_url || null,
            video_file: formData.video_file || editingPost.video_file || null
          }
        : { ...formData, id: `post_${Date.now()}` };

      const action = editingPost ? postinganAPI.update : postinganAPI.create;
      const result = await action(submitData);

      if (result.status === 'success') {
        await loadPosts();
        setIsDialogOpen(false);
        resetForm();
        toast({
          title: 'Berhasil',
          description: editingPost ? 'Postingan berhasil diperbarui' : 'Postingan berhasil dibuat'
        });
      } else {
        throw new Error(result.message || 'Gagal menyimpan postingan');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({ title: 'Error', description: error.message || 'Gagal menyimpan postingan', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm('Yakin ingin menghapus postingan ini?')) return;
    try {
      const result = await postinganAPI.delete(postId);
      if (result.status === 'success') {
        await loadPosts();
        toast({ title: 'Berhasil dihapus', description: 'Postingan telah dihapus.' });
      } else {
        throw new Error(result.message || 'Gagal menghapus postingan');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({ title: 'Error', description: error.message || 'Gagal menghapus postingan', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', type: 'berita', category: '', image: null, video_url: '', video_file: null });
    setFilePreview(null);
    setEditingPost(null);
    setVideoInputMode('upload');
  };

  const openEditDialog = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      type: post.type || 'berita',
      category: post.category || '',
      image: post.image || null,
      video_url: post.video_url || '',
      video_file: post.video_file || null
    });
    // Tentukan preview
    if (post.video_url) {
      setFilePreview({ url: post.video_url, type: 'video-url' });
      setVideoInputMode('link');
    } else if (post.video_file) {
      setFilePreview({ url: post.video_file, type: 'video' });
      setVideoInputMode('upload');
    } else if (post.image) {
      setFilePreview({ url: post.image, type: 'image' });
    }
    setIsDialogOpen(true);
  };

  // Preview section untuk video URL (YouTube atau MP4 langsung)
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
        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Postingan Baru
      </Button>

      {/* ────────── Dialog Form ────────── */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) { setIsDialogOpen(false); resetForm(); } else setIsDialogOpen(true); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit' : 'Buat'} Postingan</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* Jenis Postingan */}
            <div className="space-y-2">
              <Label>Jenis Postingan</Label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="berita">📰 Berita</option>
                <option value="foto">🖼️ Foto</option>
                <option value="video">🎬 Video</option>
              </select>
            </div>

            {/* Judul */}
            <div className="space-y-2">
              <Label>Judul Postingan</Label>
              <Input
                placeholder="Masukkan judul..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Konten */}
            <div className="space-y-2">
              <Label>Konten / Deskripsi</Label>
              <Textarea
                placeholder="Tulis isi postingan..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
              />
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input
                placeholder="Contoh: Kegiatan, Pengumuman..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            {/* ── Media: Foto ── */}
            {formData.type !== 'video' && (
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
            )}

            {/* ── Media: Video ── */}
            {formData.type === 'video' && (
              <div className="space-y-3">
                <Label className="flex items-center gap-1"><Video className="h-4 w-4" /> Media Video</Label>

                {/* Toggle: Upload / Link */}
                <div className="flex rounded-lg border overflow-hidden w-fit text-sm">
                  <button
                    type="button"
                    onClick={() => { setVideoInputMode('upload'); setFormData((p) => ({ ...p, video_url: '' })); }}
                    className={`flex items-center gap-1.5 px-4 py-2 transition-colors ${videoInputMode === 'upload' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => { setVideoInputMode('link'); setFilePreview(null); setFormData((p) => ({ ...p, video_file: null })); }}
                    className={`flex items-center gap-1.5 px-4 py-2 transition-colors ${videoInputMode === 'link' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    <Link className="h-3.5 w-3.5" /> Link URL
                  </button>
                </div>

                {/* Upload Video */}
                {videoInputMode === 'upload' && (
                  <div>
                    <FileUpload
                      accept="video/*,image/*"
                      onFileSelect={handleFileSelect}
                      preview={filePreview?.type === 'video' ? filePreview : null}
                      onClear={() => {
                        setFilePreview(null);
                        setFormData((p) => ({ ...p, video_file: null }));
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Format: MP4, WebM, OGG. Maks 50MB</p>
                  </div>
                )}

                {/* Link Video */}
                {videoInputMode === 'link' && (
                  <div className="space-y-2">
                    <Input
                      placeholder="https://youtube.com/watch?v=... atau link video .mp4"
                      value={formData.video_url}
                      onChange={(e) => {
                        const url = e.target.value;
                        setFormData((p) => ({ ...p, video_url: url }));
                        // Auto-preview saat URL valid
                        if (isValidVideoUrl(url)) {
                          setFilePreview({ url, type: 'video-url' });
                        } else {
                          setFilePreview(null);
                        }
                      }}
                    />
                    {/* Preview YouTube / MP4 */}
                    {formData.video_url && isValidVideoUrl(formData.video_url) && (
                      <VideoUrlPreview url={formData.video_url} />
                    )}
                    {formData.video_url && !isValidVideoUrl(formData.video_url) && (
                      <p className="text-xs text-destructive">URL tidak valid. Gunakan link YouTube atau URL video langsung (.mp4, .webm)</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t mt-2">
            <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : (editingPost ? 'Perbarui' : 'Buat')} Postingan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ────────── Daftar Postingan ────────── */}
      <div className="grid gap-3">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardContent className="flex items-center justify-between p-4 gap-3">
              {/* Thumbnail */}
              <div className="flex items-center gap-3 min-w-0">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                {(post.video_url || post.video_file) && !post.image && (
                  <div className="w-12 h-12 rounded bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Video className="h-5 w-5 text-purple-600" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <PostTypeBadge type={post.type} />
                    {post.category && (
                      <span className="text-xs text-muted-foreground truncate">{post.category}</span>
                    )}
                    {post.video_url && (
                      <span className="text-xs text-purple-500 flex items-center gap-0.5">
                        <Link className="h-3 w-3" /> {getYouTubeId(post.video_url) ? 'YouTube' : 'Video Link'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2 flex-shrink-0">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deletePost(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Belum ada postingan</p>
        )}
      </div>
    </div>
  );
}