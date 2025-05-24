import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { Edit2, Trash2, Save, XCircle, AlertTriangle } from 'lucide-react';
    import { initialJurusanIcons, getIconName } from '@/pages/AdminPage'; 

    const JurusanManager = ({ jurusanList, setJurusanList }) => {
      const { toast } = useToast();
      const [currentJurusan, setCurrentJurusan] = useState({ id: '', name: '', description: '', icon: initialJurusanIcons.Briefcase, image: '', color: 'text-green-500' });
      const [isEditingJurusan, setIsEditingJurusan] = useState(false);

      const handleSaveJurusan = () => {
        let updatedList;
        const jurusanToSave = { ...currentJurusan, icon: getIconName(currentJurusan.icon) };

        if (isEditingJurusan) {
          updatedList = jurusanList.map(j => j.id === jurusanToSave.id ? {...jurusanToSave, icon: currentJurusan.icon} : j);
        } else {
          jurusanToSave.id = Date.now().toString();
          updatedList = [...jurusanList, {...jurusanToSave, icon: currentJurusan.icon}];
        }
        setJurusanList(updatedList);
        localStorage.setItem('jurusanData', JSON.stringify(updatedList.map(j => ({...j, icon: getIconName(j.icon)}))));
        resetJurusanForm();
        toast({ title: "Sukses", description: `Jurusan berhasil ${isEditingJurusan ? 'diperbarui' : 'ditambahkan'}.`, variant: "default" });
      };

      const handleEditJurusan = (jurusan) => {
        setCurrentJurusan({...jurusan, icon: jurusan.icon || initialJurusanIcons.Briefcase });
        setIsEditingJurusan(true);
      };

      const handleDeleteJurusan = (id) => {
        const updatedList = jurusanList.filter(j => j.id !== id);
        setJurusanList(updatedList);
        localStorage.setItem('jurusanData', JSON.stringify(updatedList.map(j => ({...j, icon: getIconName(j.icon)}))));
        toast({ title: "Sukses", description: "Jurusan berhasil dihapus.", variant: "destructive" });
      };

      const resetJurusanForm = () => {
        setCurrentJurusan({ id: '', name: '', description: '', icon: initialJurusanIcons.Briefcase, image: '', color: 'text-green-500' });
        setIsEditingJurusan(false);
      };
      
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
                  <Label htmlFor="jurusanImage">Deskripsi Gambar Ilustrasi</Label>
                  <Input id="jurusanImage" value={currentJurusan.image} onChange={(e) => setCurrentJurusan({...currentJurusan, image: e.target.value})} placeholder="Contoh: Siswa belajar di lab" className="mt-1 bg-white/80 dark:bg-gray-700/60" />
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