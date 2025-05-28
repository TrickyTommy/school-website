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
    image: null
  });

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
      const base64String = await convertToBase64(file);
      setUploadedFile(file);
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      setFilePreview({
        url: base64String,
        type
      });
      setFormData(prev => ({
        ...prev,
        image: base64String
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process file",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINTS.postingan, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: `post_${Date.now()}`
        })
      });

      const result = await response.json();
      if (result.status === 'success') {
        await loadPosts();
        resetForm();
        toast({
          title: "Success",
          description: "Post created successfully"
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save post",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
      image: null
    });
    setUploadedFile(null);
    setFilePreview(null);
    setEditingPost(null);
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

              <div className="space-y-2">
                <Label>Unggah Media</Label>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  preview={filePreview}
                  onClear={() => {
                    setUploadedFile(null);
                    setFilePreview(null);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 sticky bottom-0 bg-background pt-4 mt-4 border-t">
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
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-500">{post.type}</p>
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