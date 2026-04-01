import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, UserCircle, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { API_ENDPOINTS } from '@/services/api';

// Ekstrak YouTube ID dari berbagai format URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

// Cek apakah URL adalah link video langsung (mp4, webm, ogg)
const isDirectVideoUrl = (url) =>
  url && /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [post, setPost] = useState(location.state?.post || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!post) {
      loadPostDetail(id);
    } else {
      setLoading(false);
    }
  }, [id, post]);

  const loadPostDetail = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.postingan}?action=detail&id=${id}`);
      const result = await response.json();

      if (result.status === 'success' && result.data) {
        const postData = Array.isArray(result.data) ? result.data[0] : result.data;
        if (!postData) throw new Error('Post data is empty');
        setPost(postData);
      } else {
        throw new Error(result.message || 'Post not found');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Gagal memuat detail postingan',
        variant: 'destructive'
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

  // Resolve video: prioritaskan video_url lalu video_file (upload)
  const videoUrl    = post.video_url  || post.videoUrl  || null;
  const videoFile   = post.video_file || post.videoFile || null;
  const ytEmbedUrl  = getYouTubeEmbedUrl(videoUrl);
  const isDirectVid = isDirectVideoUrl(videoUrl);

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
        {/* ── Gambar cover (jika bukan video atau ada gambar thumbnail) ── */}
        {post.image && !videoFile && !videoUrl && (
          <div className="relative w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <img
              src={post.image.startsWith('data:') ? post.image : `data:image/jpeg;base64,${post.image}`}
              alt={post.title}
              className="max-w-full max-h-[80vh] object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* ── Video dari YouTube URL ── */}
        {ytEmbedUrl && (
          <div className="w-full aspect-video bg-black">
            <iframe
              src={ytEmbedUrl}
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* ── Video dari URL langsung (mp4/webm/ogg) ── */}
        {!ytEmbedUrl && isDirectVid && (
          <div className="w-full bg-black">
            <video
              controls
              className="w-full max-h-[70vh]"
              preload="metadata"
            >
              <source src={videoUrl} />
              Browser Anda tidak mendukung pemutaran video.
            </video>
          </div>
        )}

        {/* ── Video dari file upload (base64) ── */}
        {videoFile && !ytEmbedUrl && !isDirectVid && (
          <div className="w-full bg-black">
            <video
              controls
              className="w-full max-h-[70vh]"
              preload="metadata"
            >
              <source src={videoFile} />
              Browser Anda tidak mendukung pemutaran video.
            </video>
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            {post.date && (
              <span className="flex items-center">
                <CalendarDays className="mr-1 h-4 w-4" />
                {new Date(post.date).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
            {post.author && (
              <span className="flex items-center">
                <UserCircle className="mr-1 h-4 w-4" />
                {post.author}
              </span>
            )}
            {post.category && (
              <span className="flex items-center">
                <Tag className="mr-1 h-4 w-4" />
                {post.category}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            {post.content ? (
              <p className="whitespace-pre-line">{post.content}</p>
            ) : (
              <p className="text-gray-500">Tidak ada konten</p>
            )}
          </div>

          {/* Jika ada gambar DAN ada video, tampilkan gambar di bawah konten sebagai thumbnail */}
          {post.image && (videoFile || videoUrl) && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2">Gambar terkait:</p>
              <img
                src={post.image.startsWith('data:') ? post.image : `data:image/jpeg;base64,${post.image}`}
                alt={post.title}
                className="rounded-lg max-h-64 object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
