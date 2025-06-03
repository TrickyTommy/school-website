import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FileUpload } from '@/components/FileUpload';
import { guruStaffAPI } from '@/services/api';

export default function TeacherStaffManager() {
  const [members, setMembers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    type: 'teacher',
    role: 'staff', // Add new role field
    email: '',
    subject: '',
    expertise: '',
    position: '',
    image: null
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const result = await guruStaffAPI.getAll();
      console.log('Loaded members:', result); // Debug log

      if (result.status === 'success' && Array.isArray(result.data)) {
        setMembers(result.data);
        console.log('Members set:', result.data); // Debug log
      } else {
        throw new Error(result.message || 'Data format invalid');
      }
    } catch (error) {
      console.error('Load error:', error); // Debug log
      toast({
        title: "Error",
        description: error.message || "Gagal memuat data guru & staff",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (file) => {
    try {
      const base64 = await convertToBase64(file);
      setImagePreview({ type: 'image', url: base64 });
      setFormData(prev => ({ ...prev, image: base64 }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
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
      if (!formData.name || !formData.role) {
        toast({
          title: "Validation Error",
          description: "Harap isi nama dan kategori",
          variant: "destructive"
        });
        return;
      }

      // Add expertise validation for vice principal
      if (formData.role === 'vice_principal' && !formData.expertise) {
        toast({
          title: "Validation Error",
          description: "Harap pilih bidang untuk Wakil Kepala Sekolah",
          variant: "destructive"
        });
        return;
      }

      const submitData = {
        ...formData,
        id: editingMember?.id,
        expertise: formData.role === 'vice_principal' ? 
          // Map expertise values to proper display names
          {
            'kurikulum': 'Kurikulum',
            'kesiswaan': 'Kesiswaan',
            'sarana': 'Sarana & Prasarana',
            'humas': 'Hubungan Masyarakat',
            'bendahara': 'Bendahara'
          }[formData.expertise] || formData.expertise 
          : formData.expertise,
        type: formData.role === 'teacher' ? 'teacher' : formData.type
      };

      const action = editingMember ? guruStaffAPI.update : guruStaffAPI.create;
      const result = await action(submitData);

      if (result.status === 'success') {
        await loadMembers();
        resetForm();
        setIsDialogOpen(false);
        toast({
          title: "Berhasil",
          description: result.message
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan data",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const result = await guruStaffAPI.delete(id);
        if (result.status === 'success') {
          await loadMembers();
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
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'teacher',
      role: 'staff',
      email: '',
      subject: '',
      expertise: '',
      position: '',
      image: null
    });
    setImagePreview(null);
    setEditingMember(null);
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('data:image/')) return image;
    return `data:image/jpeg;base64,${image}`;
  };

  const getDisplayTitle = (member) => {
    switch (member.role) {
      case 'principal':
        return 'Kepala Sekolah';
      case 'vice_principal':
        return `Wakil Kepala Sekolah Bidang ${member.expertise || ''}`;
      case 'program_head':
        return `Kepala Program ${member.expertise || ''}`;
      case 'teacher':
        return member.subject || 'Guru';
      case 'staff':
        return member.position || 'Staff';  
      default:
        return member.position || member.role;
    }
  };

  const groupLeadershipByRole = (members) => {
    const principal = members.filter(m => m.role === 'principal');
    const viceprincipals = members.filter(m => m.role === 'vice_principal');
    const programHeads = members.filter(m => m.role === 'program_head');
    return { principal, viceprincipals, programHeads };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Member
        </Button>
        <select 
          className="p-2 border rounded"
          value={formData.type}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="leadership">Kepemimpinan</option>
          <option value="teacher">Guru</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit' : 'Add'} Member</DialogTitle>
          </DialogHeader>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="principal">Kepala Sekolah</option>
                    <option value="vice_principal">Wakil Kepala Sekolah</option>
                    <option value="program_head">Kepala Program</option>
                    <option value="teacher">Guru</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                {formData.type === 'teacher' ? (
                  <>
                    <div className="space-y-2">
                      <Label>Mata Pelajaran </Label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expertise</Label>
                      <Input
                        value={formData.expertise}
                        onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                    />
                  </div>
                )}

                {formData.role === 'vice_principal' && (
                  <div className="space-y-2">
                    <Label>Bidang</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.expertise || ''}
                      onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                      required
                    >
                      <option value="">Pilih Bidang</option>
                      <option value="Kurikulum">Kurikulum</option>
                      <option value="Kesiswaan">Kesiswaan</option>
                      <option value="Sarana & Prasarana">Sarana & Prasarana</option>
                      <option value="Hubungan Masyarakat">Hubungan Masyarakat</option>
                      <option value="Bendahara">Bendahara</option>
                    </select>
                  </div>
                )}
                {formData.role === 'program_head' && (
                  <div className="space-y-2">
                    <Label>Bidang</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.expertise}
                      onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                    >
                      <option value="akuntansi">Akuntansi dan Keuangan Lembaga</option>
                      <option value="tkj">Teknik Komputer Jaringan</option>
                      <option value="rpl">Rekayasa Perangkat Lunak & Gim</option>
                      
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Photo</Label>
                  <FileUpload
                    accept="image/*"
                    onFileSelect={handleFileSelect}
                    preview={imagePreview}
                    onClear={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sticky footer with buttons */}
          <div className="sticky bottom-0 pt-4 mt-4 border-t bg-background flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingMember ? 'Update' : 'Add'} Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center p-4">Memuat data...</div>
      ) : members.length === 0 ? (
        <div className="text-center p-4">Tidak ada data</div>
      ) : (
        <div className="grid gap-6">
          {/* Leadership Section */}
          {members.some(m => ['principal', 'vice_principal', 'program_head'].includes(m.role)) && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Kepemimpinan Sekolah</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Principal Column */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Kepala Sekolah</h3>
                  {members
                    .filter(m => m.role === 'principal')
                    .map((member) => (
                      <Card key={member.id} className="border-2 border-primary">
                        <CardContent className="flex items-center p-4">
                          {member.image && (
                            <img
                              src={getImageUrl(member.image)}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover mr-4"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150';
                              }}
                            />
                          )}
                          <div className="flex-grow">
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-gray-500">
                              {getDisplayTitle(member)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => {
                              setEditingMember(member);
                              setFormData(member);
                              setImagePreview(member.image ? { type: 'image', url: member.image } : null);
                              setIsDialogOpen(true);
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                {/* Vice Principals Column */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Wakil Kepala Sekolah</h3>
                  {members
                    .filter(m => m.role === 'vice_principal')
                    .sort((a, b) => a.expertise?.localeCompare(b.expertise))
                    .map((member) => (
                      <Card key={member.id} className="border-2 border-secondary">
                        <CardContent className="flex items-center p-4">
                          {member.image && (
                            <img
                              src={getImageUrl(member.image)}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover mr-4"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150';
                              }}
                            />
                          )}
                          <div className="flex-grow">
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-gray-500">
                              {getDisplayTitle(member)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => {
                              setEditingMember(member);
                              setFormData(member);
                              setImagePreview(member.image ? { type: 'image', url: member.image } : null);
                              setIsDialogOpen(true);
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                {/* Program Heads Column */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Kepala Program</h3>
                  {members
                    .filter(m => m.role === 'program_head')
                    .sort((a, b) => a.expertise?.localeCompare(b.expertise))
                    .map((member) => (
                      <Card key={member.id} className="border-2 border-secondary">
                        <CardContent className="flex items-center p-4">
                          {member.image && (
                            <img
                              src={getImageUrl(member.image)}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover mr-4"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150';
                              }}
                            />
                          )}
                          <div className="flex-grow">
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-gray-500">
                              {getDisplayTitle(member)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => {
                              setEditingMember(member);
                              setFormData(member);
                              setImagePreview(member.image ? { type: 'image', url: member.image } : null);
                              setIsDialogOpen(true);
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Teachers Section */}
          {members.some(m => m.role === 'teacher') && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Guru</h2>
              <div className="grid gap-4">
                {members
                  .filter(m => m.role === 'teacher')
                  .map((member) => (
                    <Card key={member.id}>
                      <CardContent className="flex items-center p-4">
                        {member.image && (
                          <img
                            src={getImageUrl(member.image)}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                        )}
                        <div className="flex-grow">
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-500">
                            {member.subject && `Mata Pelajaran: ${member.subject}`}
                            {member.expertise && ` - ${member.expertise}`}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            setEditingMember(member);
                            setFormData(member);
                            setImagePreview(member.image ? { type: 'image', url: member.image } : null);
                            setIsDialogOpen(true);
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Staff Section */}
          {members.some(m => m.role === 'staff') && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Staff</h2>
              <div className="grid gap-4">
                {members
                  .filter(m => m.role === 'staff')
                  .map((member) => (
                    <Card key={member.id}>
                      <CardContent className="flex items-center p-4">
                        {member.image && (
                          <img
                            src={getImageUrl(member.image)}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                        )}
                        <div className="flex-grow">
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-500">
                            {member.type === 'teacher' ? member.subject : member.position}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            setEditingMember(member);
                            setFormData(member);
                            setImagePreview(member.image ? { type: 'image', url: member.image } : null);
                            setIsDialogOpen(true);
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}