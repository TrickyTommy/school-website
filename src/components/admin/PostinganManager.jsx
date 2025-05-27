import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/FileUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { API_ENDPOINTS } from '@/services/api';
import { Progress } from "@/components/ui/progress";

export default function PostinganManager() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'berita',
    category: '',
    image: null,
    videoUrl: '',
    video: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.postingan);
      const result = await response.json();
      if (result.status === 'success') {
        setPosts(result.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts",
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

  const handleFileSelect = async (file) => {
    try {
      // Validate file size (100MB max)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "Ukuran file terlalu besar. Maksimal 100MB",
          variant: "destructive"
        });
        return;
      }

      setUploadedFile(file);
      const isVideo = file.type.startsWith('video/');
      
      // Create preview URL
      const preview = {
        type: isVideo ? 'video' : 'image',
        url: URL.createObjectURL(file)
      };
      
      setFilePreview(preview);
      setFormData(prev => ({
        ...prev,
        type: isVideo ? 'video' : 'foto'
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memproses file: " + error.message,
        variant: "destructive"
      });
    }
  };

  const getVideoEmbedUrl = (url) => {
    if (!url) return null;
    
    try {
      const urlObj = new URL(url);
      
      // Make sure we have a valid protocol
      if (!urlObj.protocol.startsWith('http')) {
        throw new Error('URL harus dimulai dengan http:// atau https://');
      }

      // Handle different video platforms
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.hostname.includes('youtube.com') 
          ? urlObj.searchParams.get('v')
          : urlObj.pathname.slice(1);
        if (!videoId) throw new Error('ID Video YouTube tidak ditemukan');
        return {
          type: 'youtube',
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          originalUrl: url
        };
      }
      
      // For other URLs, try to load as generic embed with fallback
      return {
        type: 'generic',
        embedUrl: url,
        originalUrl: url
      };
    } catch (error) {
      console.error('Video URL Error:', error);
      return null;
    }
  };

  const VideoEmbed = ({ url, title }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const embedInfo = getVideoEmbedUrl(url);

    if (!embedInfo) {
      return (
        <div className="p-4 text-amber-600 bg-amber-50 border border-amber-200 rounded">
          URL video tidak valid
        </div>
      );
    }

    return (
      <div className="relative w-full h-0 pb-[56.25%]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-600 text-sm">
            Gagal memuat video
          </div>
        )}
        <iframe
          src={embedInfo.embedUrl}
          title={title || "Video"}
          className={`absolute top-0 left-0 w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  };

  const validateVideoUrl = (url) => {
    const embedInfo = getVideoEmbedUrl(url);
    return !!embedInfo;
  };

  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, videoUrl: url }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setUploadProgress(0);

      const formDataToSend = new FormData();
      
      // Add basic form data
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('id', `post_${Date.now()}`);

      // Handle video URL
      if (formData.videoUrl) {
        formDataToSend.append('videoUrl', formData.videoUrl);
      }

      // Handle file upload (video or image)
      if (uploadedFile) {
        formDataToSend.append('file', uploadedFile);
      }

      const response = await fetch(API_ENDPOINTS.postingan, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        await loadPosts();
        resetForm();
        toast({
          title: "Berhasil",
          description: "Postingan telah dibuat"
        });
      } else {
        throw new Error(result.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan postingan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.postingan}?id=${postId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        await loadPosts(); // Reload posts after successful deletion
        toast({
          title: "Berhasil dihapus",
          description: "Postingan telah dihapus."
        });
      } else {
        throw new Error(result.message || 'Failed to delete post');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus postingan",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'berita',
      category: '',
      image: null,
      videoUrl: '',
      video: null
    });
    setUploadedFile(null);
    setFilePreview(null);
    setEditingPost(null);
  };

  const renderUploadProgress = () => {
    if (uploadProgress > 0 && uploadProgress < 100) {
      return (
        <div className="w-full space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-gray-500 text-center">{uploadProgress}% Uploaded</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsDialogOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Postingan Baru
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>{editingPost ? 'Edit' : 'Buat'} Postingan</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pb-20">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Jenis Postingan</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="berita">Berita</option>
                  <option value="foto">Foto</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Judul Postingan</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Konten</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>

              {formData.type === 'video' && (
                <div className="space-y-2">
                  <Label>URL Video</Label>
                  <Input
                    value={formData.videoUrl}
                    onChange={handleVideoUrlChange}
                    placeholder="Masukkan URL video"
                  />
                  {formData.videoUrl && (
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <VideoEmbed url={formData.videoUrl} />
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>Unggah {formData.type === 'video' ? 'Video' : 'Foto'}</Label>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  preview={filePreview}
                  accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                  onClear={() => {
                    setUploadedFile(null);
                    setFilePreview(null);
                    setFormData(prev => ({
                      ...prev,
                      image: null,
                      video: null
                    }));
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4 sticky bottom-0 bg-background pt-4 mt-4 border-t">
            {renderUploadProgress()}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}>
                Batal
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {editingPost ? 'Perbarui' : 'Buat'} Postingan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="flex justify-between items-center p-4">
              <div className="flex items-center space-x-4">
                {post.type === 'video' && (post.video || post.videoUrl) && (
                  <div className="w-32 h-20 bg-gray-100 rounded overflow-hidden">
                    {post.videoUrl ? (
                      <VideoEmbed url={post.videoUrl} title={post.title} />
                    ) : (
                      <video
                        src={post.video}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-500">{post.type}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setEditingPost(post);
                  setFormData({
                    title: post.title,
                    content: post.content,
                    type: post.type,
                    category: post.category
                  });
                  setFilePreview(post.image ? { type: 'image', url: post.image } : 
                               post.videoUrl ? { type: 'video', url: post.videoUrl } : null);
                  setIsDialogOpen(true);
                }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deletePost(post.id)}>
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