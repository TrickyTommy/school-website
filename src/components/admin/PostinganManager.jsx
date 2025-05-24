import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { Newspaper, Image as ImageIcon, Video, Edit2, Trash2, Save, XCircle, AlertTriangle } from 'lucide-react';

    const PostinganManager = ({ postinganList, setPostinganList }) => {
      const { toast } = useToast();
      const [currentPostingan, setCurrentPostingan] = useState({ id: '', title: '', type: 'berita', content: '', image: '', videoUrl: '', date: '', author: '', category: '' });
      const [isEditingPostingan, setIsEditingPostingan] = useState(false);

      const handleSavePostingan = () => {
        let updatedList;
        const postToSave = { ...currentPostingan, date: currentPostingan.date || new Date().toISOString().split('T')[0] };
        if (isEditingPostingan) {
          updatedList = postinganList.map(p => p.id === postToSave.id ? postToSave : p);
        } else {
          postToSave.id = Date.now().toString();
          updatedList = [...postinganList, postToSave];
        }
        setPostinganList(updatedList);
        localStorage.setItem('postinganData', JSON.stringify(updatedList));
        resetPostinganForm();
        toast({ title: "Sukses", description: `Postingan berhasil ${isEditingPostingan ? 'diperbarui' : 'ditambahkan'}.`, variant: "default" });
      };

      const handleEditPostingan = (postingan) => {
        setCurrentPostingan(postingan);
        setIsEditingPostingan(true);
      };

      const handleDeletePostingan = (id) => {
        const updatedList = postinganList.filter(p => p.id !== id);
        setPostinganList(updatedList);
        localStorage.setItem('postinganData', JSON.stringify(updatedList));
        toast({ title: "Sukses", description: "Postingan berhasil dihapus.", variant: "destructive" });
      };

      const resetPostinganForm = () => {
        setCurrentPostingan({ id: '', title: '', type: 'berita', content: '', image: '', videoUrl: '', date: '', author: '', category: '' });
        setIsEditingPostingan(false);
      };

      return (
        <>
          <Card className="shadow-lg glassmorphic dark:bg-gray-800/60">
            <CardHeader>
              <CardTitle className="text-2xl">{isEditingPostingan ? 'Edit Postingan' : 'Tambah Postingan Baru'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="postTitle">Judul Postingan</Label>
                <Input id="postTitle" value={currentPostingan.title} onChange={(e) => setCurrentPostingan({...currentPostingan, title: e.target.value})} className="mt-1 bg-white/80 dark:bg-gray-700/60" />
              </div>
              <div>
                <Label htmlFor="postContent">Konten</Label>
                <Textarea id="postContent" value={currentPostingan.content} onChange={(e) => setCurrentPostingan({...currentPostingan, content: e.target.value})} className="mt-1 bg-white/80 dark:bg-gray-700/60" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postType">Jenis Postingan</Label>
                  <select id="postType" value={currentPostingan.type} onChange={(e) => setCurrentPostingan({...currentPostingan, type: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white/80 dark:bg-gray-700/60 dark:border-gray-600">
                    <option value="berita">Berita</option>
                    <option value="foto">Foto</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="postImage">Deskripsi Gambar/Thumbnail</Label>
                  <Input id="postImage" value={currentPostingan.image} onChange={(e) => setCurrentPostingan({...currentPostingan, image: e.target.value})} placeholder="Contoh: Siswa LKS menerima piala" className="mt-1 bg-white/80 dark:bg-gray-700/60" />
                </div>
              </div>
              {currentPostingan.type === 'video' && (
                <div>
                  <Label htmlFor="postVideoUrl">URL Video (Embed)</Label>
                  <Input id="postVideoUrl" value={currentPostingan.videoUrl} onChange={(e) => setCurrentPostingan({...currentPostingan, videoUrl: e.target.value})} placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID" className="mt-1 bg-white/80 dark:bg-gray-700/60" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                      <Label htmlFor="postDate">Tanggal</Label>
                      <Input id="postDate" type="date" value={currentPostingan.date} onChange={(e) => setCurrentPostingan({...currentPostingan, date: e.target.value})} className="mt-1 bg-white/80 dark:bg-gray-700/60" />
                  </div>
                  <div>
                      <Label htmlFor="postAuthor">Penulis</Label>
                      <Input id="postAuthor" value={currentPostingan.author} onChange={(e) => setCurrentPostingan({...currentPostingan, author: e.target.value})} placeholder="Nama penulis" className="mt-1 bg-white/80 dark:bg-gray-700/60" />
                  </div>
                  <div>
                      <Label htmlFor="postCategory">Kategori</Label>
                      <Input id="postCategory" value={currentPostingan.category} onChange={(e) => setCurrentPostingan({...currentPostingan, category: e.target.value})} placeholder="e.g., Kegiatan Sekolah" className="mt-1 bg-white/80 dark:bg-gray-700/60" />
                  </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSavePostingan} className="bg-green-500 hover:bg-green-600 text-white">
                  <Save className="mr-2 h-4 w-4" /> {isEditingPostingan ? 'Simpan Perubahan' : 'Tambah Postingan'}
                </Button>
                {isEditingPostingan && (
                  <Button variant="outline" onClick={resetPostinganForm}>
                    <XCircle className="mr-2 h-4 w-4" /> Batal
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Daftar Postingan</h3>
              {postinganList.length === 0 ? (
                <Card className="glassmorphic dark:bg-gray-800/60">
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500 mb-3" />
                    <p className="text-gray-600 dark:text-gray-300">Belum ada postingan yang ditambahkan.</p>
                  </CardContent>
                </Card>
            ) : (
              <div className="space-y-3">
              {postinganList.map(post => (
                <Card key={post.id} className="flex items-center justify-between p-4 shadow-sm glassmorphic-sm dark:bg-gray-700/50">
                  <div className="flex items-center space-x-3">
                    {post.type === 'berita' && <Newspaper className="w-5 h-5 text-blue-500" />}
                    {post.type === 'foto' && <ImageIcon className="w-5 h-5 text-green-500" />}
                    {post.type === 'video' && <Video className="w-5 h-5 text-red-500" />}
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{post.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Kategori: {post.category} | Tanggal: {new Date(post.date).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditPostingan(post)} className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/30">
                      <Edit2 className="mr-1 h-3 w-3" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeletePostingan(post.id)}>
                      <Trash2 className="mr-1 h-3 w-3" /> Hapus
                    </Button>
                  </div>
                </Card>
              ))}
              </div>
            )}
          </div>
        </>
      );
    };

    export default PostinganManager;