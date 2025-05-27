import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Edit2, Trash2, Save, XCircle, AlertTriangle, Image as ImageIcon, Video, Upload } from 'lucide-react';
import { initialJurusanIcons, getIconName } from '@/pages/AdminPage'; 
import { jurusanAPI } from '@/services/api';

const JurusanManager = ({ jurusanList, setJurusanList }) => {
  const { toast } = useToast();
  const [currentJurusan, setCurrentJurusan] = useState({ id: '', name: '', description: '', icon: initialJurusanIcons.Briefcase, image: '', color: 'text-green-500', videoUrl: '' });
  const [isEditingJurusan, setIsEditingJurusan] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSaveJurusan = async () => {
    if (!currentJurusan.name) {
      toast({
        title: "Error",
        description: "Nama jurusan harus diisi",
        variant: "destructive"
      });
      return;
    }

    try {
      // Format data before sending to API
      const formattedData = {
        id: currentJurusan.id || null,
        name: currentJurusan.name,
        description: currentJurusan.description || '',
        icon: getIconName(currentJurusan.icon),
        image: imagePreview || currentJurusan.image || '',
        video_url: currentJurusan.videoUrl || '',
        color: currentJurusan.color || 'text-gray-500'
      };

      const result = isEditingJurusan 
        ? await jurusanAPI.update(formattedData)
        : await jurusanAPI.create(formattedData);

      if (result.status === 'success') {
        const updatedData = await jurusanAPI.getAll();
        if (updatedData.status === 'success') {
          setJurusanList(updatedData.data);
        }
        
        resetJurusanForm();
        setImagePreview(null);
        
        toast({ 
          title: "Sukses", 
          description: `Jurusan berhasil ${isEditingJurusan ? 'diperbarui' : 'ditambahkan'}.`
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan jurusan",
        variant: "destructive"
      });
    }
  };

  const handleEditJurusan = (jurusan) => {
    setCurrentJurusan({
      ...jurusan,
      icon: jurusan.icon || initialJurusanIcons.Briefcase
    });
    setImagePreview(jurusan.image);
    setIsEditingJurusan(true);
  };

  const handleDeleteJurusan = async (id) => {
    try {
      const result = await jurusanAPI.delete(id);
      if (result.status === 'success') {
        const updatedData = await jurusanAPI.getAll();
        if (updatedData.status === 'success') {
          setJurusanList(updatedData.data);
        }
        toast({ 
          title: "Sukses", 
          description: "Jurusan berhasil dihapus."
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus jurusan",
        variant: "destructive"
      });
    }
  };

  const resetJurusanForm = () => {
    setCurrentJurusan({ id: '', name: '', description: '', icon: initialJurusanIcons.Briefcase, image: '', color: 'text-green-500', videoUrl: '' });
    setIsEditingJurusan(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setCurrentJurusan({...currentJurusan, image: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const validateYouTubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    return pattern.test(url);
  };

  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    if (!url || validateYouTubeUrl(url)) {
      setCurrentJurusan({...currentJurusan, videoUrl: url});
    } else {
      toast({
        title: "Error",
        description: "URL YouTube tidak valid",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadJurusan = async () => {
      try {
        const result = await jurusanAPI.getAll();
        if (result.status === 'success') {
          setJurusanList(result.data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat data jurusan",
          variant: "destructive"
        });
      }
    };

    loadJurusan();
  }, []);

  return (
    <>
      <Card className="shadow-lg glassmorphic dark:bg-gray-800/60">
        <CardHeader>
          <CardTitle className="text-2xl">{isEditingJurusan ? 'Edit Jurusan' : 'Tambah Jurusan Baru'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="jurusanName">Nama Jurusan</Label>
            <Input id="jurusanName" value={currentJurusan.name} onChange={(e) => setCurrentJurusan({...currentJurusan, name: e.target.value})} className="mt-1 bg-white/80 dark:bg-gray-700/60" />
          </div>
          <div>
            <Label htmlFor="jurusanDesc">Deskripsi</Label>
            <Textarea id="jurusanDesc" value={currentJurusan.description} onChange={(e) => setCurrentJurusan({...currentJurusan, description: e.target.value})} className="mt-1 bg-white/80 dark:bg-gray-700/60" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Foto</Label>
              <div className="mt-2 space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-white/80 dark:bg-gray-700/60"
                />
                {imagePreview && (
                  <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label>URL Video YouTube</Label>
              <Input
                value={currentJurusan.videoUrl || ''}
                onChange={handleVideoUrlChange}
                placeholder="https://youtube.com/watch?v=..."
                className="mt-1 bg-white/80 dark:bg-gray-700/60"
              />
              {currentJurusan.videoUrl && validateYouTubeUrl(currentJurusan.videoUrl) && (
                <div className="mt-2 aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentJurusan.videoUrl.match(/[?&]v=([^&]+)/)[1]}`}
                    title="YouTube video"
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="jurusanIcon">Ikon</Label>
              <select id="jurusanIcon" value={getIconName(currentJurusan.icon)} onChange={(e) => setCurrentJurusan({...currentJurusan, icon: initialJurusanIcons[e.target.value]})} className="w-full mt-1 p-2 border rounded-md bg-white/80 dark:bg-gray-700/60 dark:border-gray-600">
                {Object.keys(initialJurusanIcons).map(iconName => (
                  <option key={iconName} value={iconName}>{iconName}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="jurusanColor">Warna Ikon (Tailwind Class)</Label>
              <Input id="jurusanColor" value={currentJurusan.color} onChange={(e) => setCurrentJurusan({...currentJurusan, color: e.target.value})} placeholder="e.g., text-green-500" className="mt-1 bg-white/80 dark:bg-gray-700/60" />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleSaveJurusan} className="bg-green-500 hover:bg-green-600 text-white">
              <Save className="mr-2 h-4 w-4" /> {isEditingJurusan ? 'Simpan Perubahan' : 'Tambah Jurusan'}
            </Button>
            {isEditingJurusan && (
              <Button variant="outline" onClick={resetJurusanForm}>
                <XCircle className="mr-2 h-4 w-4" /> Batal
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Daftar Jurusan</h3>
        {jurusanList.length === 0 ? (
            <Card className="glassmorphic dark:bg-gray-800/60">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500 mb-3" />
                <p className="text-gray-600 dark:text-gray-300">Belum ada jurusan yang ditambahkan.</p>
              </CardContent>
            </Card>
        ) : (
          <div className="space-y-3">
          {jurusanList.map(jurusan => {
            const IconComponent = jurusan.icon;
            return (
            <Card key={jurusan.id} className="flex items-center justify-between p-4 shadow-sm glassmorphic-sm dark:bg-gray-700/50">
              <div className="flex items-center space-x-3">
                {IconComponent && <IconComponent className={`w-6 h-6 ${jurusan.color || 'text-gray-500'}`} />}
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{jurusan.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{jurusan.description}</p>
                </div>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditJurusan(jurusan)} className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/30">
                  <Edit2 className="mr-1 h-3 w-3" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteJurusan(jurusan.id)}>
                  <Trash2 className="mr-1 h-3 w-3" /> Hapus
                </Button>
              </div>
            </Card>
          )})}
          </div>
        )}
      </div>
    </>
  );
};

export default JurusanManager;