import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FileUpload } from '@/components/FileUpload';

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

  React.useEffect(() => {
    const storedData = localStorage.getItem('teacherStaffData');
    if (storedData) {
      setMembers(JSON.parse(storedData));
    }
  }, []);

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

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const newMember = {
      id: editingMember?.id || `member${Date.now()}`,
      ...formData,
      date: editingMember?.date || new Date().toISOString()
    };

    const updatedMembers = editingMember
      ? members.map(m => m.id === editingMember.id ? newMember : m)
      : [...members, newMember];

    setMembers(updatedMembers);
    localStorage.setItem('teacherStaffData', JSON.stringify(updatedMembers));
    resetForm();
    setIsDialogOpen(false);
    toast({
      title: `${editingMember ? 'Updated' : 'Added'} successfully`,
      description: `Member has been ${editingMember ? 'updated' : 'added'}.`
    });
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit' : 'Add'} Member</DialogTitle>
          </DialogHeader>
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
                    <Label>Subject</Label>
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
                    value={formData.expertise}
                    onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                  >
                    <option value="kurikulum">Kurikulum</option>
                    <option value="kesiswaan">Kesiswaan</option>
                    <option value="sarana">Sarana & Prasarana</option>
                    <option value="humas">Hubungan Masyarakat</option>
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

            <div className="flex justify-end space-x-2">
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
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6">
        {/* Leadership Section */}
        {members.some(m => m.role === 'principal' || m.role === 'vice_principal') && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Kepemimpinan Sekolah</h2>
            <div className="grid gap-4">
              {members
                .filter(m => m.role === 'principal' || m.role === 'vice_principal')
                .map((member) => (
                  <Card key={member.id} className="border-2 border-primary">
                    <CardContent className="flex items-center p-4">
                      {member.image && (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
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
                        <Button variant="destructive" size="sm" onClick={() => {
                          setMembers(prev => prev.filter(m => m.id !== member.id));
                          localStorage.setItem('teacherStaffData', JSON.stringify(
                            members.filter(m => m.id !== member.id)
                          ));
                          toast({
                            title: "Deleted successfully",
                            description: "Member has been removed."
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
                          src={member.image}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
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
                        <Button variant="destructive" size="sm" onClick={() => {
                          setMembers(prev => prev.filter(m => m.id !== member.id));
                          localStorage.setItem('teacherStaffData', JSON.stringify(
                            members.filter(m => m.id !== member.id)
                          ));
                          toast({
                            title: "Deleted successfully",
                            description: "Member has been removed."
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
                          src={member.image}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
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
                        <Button variant="destructive" size="sm" onClick={() => {
                          setMembers(prev => prev.filter(m => m.id !== member.id));
                          localStorage.setItem('teacherStaffData', JSON.stringify(
                            members.filter(m => m.id !== member.id)
                          ));
                          toast({
                            title: "Deleted successfully",
                            description: "Member has been removed."
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
        )}
      </div>
    </div>
  );
}
