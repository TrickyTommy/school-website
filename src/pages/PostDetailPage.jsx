import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, UserCircle, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// const API_URL = 'http://localhost/sekolah/api/postingan.php';
const API_URL = 'http://localhost/postingan.php';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPostDetail();
  }, [id]);

  const loadPostDetail = async () => {
    try {
      const response = await fetch(`${API_URL}?action=detail&id=${id}`);
      const result = await response.json();
      
      console.log('API Response:', result); // Debug log
      
      if (result.status === 'success' && result.data) {
        // Handle both array and single object response
        const postData = Array.isArray(result.data) ? result.data[0] : result.data;
        
        if (!postData) {
          throw new Error('Post data is empty');
        }

        console.log('Post Data:', postData); // Debug log
        setPost(postData);
      } else {
        throw new Error(result.message || 'Post not found');
      }
    } catch (error) {
      console.error('Error loading post:', error); // Debug log
      toast({
        title: "Error",
        description: error.message || "Gagal memuat detail postingan",
        variant: "destructive"
      });
      navigate('/postingan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center p-8">Postingan tidak ditemukan</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/postingan')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
      </Button>

      <Card className="overflow-hidden">
        {post?.image && (
          <div className="w-full h-[400px]">
            <img 
              src={post.image.startsWith('data:') ? post.image : `data:image/jpeg;base64,${post.image}`}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image load error:', e);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            <span className="flex items-center">
              <CalendarDays className="mr-1 h-4 w-4" />
              {new Date(post.date).toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="flex items-center">
              <UserCircle className="mr-1 h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center">
              <Tag className="mr-1 h-4 w-4" />
              {post.category}
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose max-w-none">
            {post?.content ? (
              <p className="whitespace-pre-line">{post.content}</p>
            ) : (
              <p className="text-gray-500">Tidak ada konten</p>
            )}
          </div>

          {post?.type === 'video' && post?.videoUrl && (
            <div className="aspect-w-16 aspect-h-9 mt-6">
              <iframe
                src={post.videoUrl}
                title={post.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-[400px]"
              ></iframe>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
