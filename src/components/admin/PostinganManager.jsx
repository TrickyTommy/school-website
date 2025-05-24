import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/FileUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function PostinganManager({ postinganList, setPostinganList }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'berita',
    category: ''
  });

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process file",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newPost = {
      id: editingPost?.id || `post${Date.now()}`,
      ...formData,
      image: filePreview?.type === 'image' ? filePreview.url : null,
      videoUrl: filePreview?.type === 'video' ? filePreview.url : null,
      date: editingPost?.date || new Date().toISOString(),
      author: 'Admin'
    };

    const updatedList = editingPost 
      ? postinganList.map(p => p.id === editingPost.id ? newPost : p)
      : [newPost, ...postinganList];

    setPostinganList(updatedList);
    localStorage.setItem('postinganData', JSON.stringify(updatedList));
    resetForm();
    setIsDialogOpen(false);
    toast({
      title: `${editingPost ? 'Updated' : 'Created'} successfully`,
      description: `Post has been ${editingPost ? 'updated' : 'created'}.`
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'berita',
      category: ''
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit' : 'Buat'} Postingan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}>
                Batal
              </Button>
              <Button onClick={handleSubmit}>
                {editingPost ? 'Perbarui' : 'Buat'} Postingan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {postinganList.map((post) => (
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
                <Button variant="destructive" size="sm" onClick={() => {
                  setPostinganList(prev => prev.filter(p => p.id !== post.id));
                  localStorage.setItem('postinganData', JSON.stringify(postinganList.filter(p => p.id !== post.id)));
                  toast({
                    title: "Berhasil dihapus",
                    description: "Postingan telah dihapus."
                  });
                }}>
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