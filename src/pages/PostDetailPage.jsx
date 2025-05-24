import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('postinganData') || '[]');
    const foundPost = posts.find(p => p.id === id);
    if (foundPost) {
      setPost(foundPost);
    }
  }, [id]);

  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali
      </Button>

      <Card>
        <CardContent className="p-6 space-y-6">
          {(post.image || post.videoUrl) && (
            <div className="rounded-lg overflow-hidden">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              ) : (
                <video
                  src={post.videoUrl}
                  controls
                  className="w-full"
                />
              )}
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(post.date).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {post.author}
              </span>
              <span className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                {post.category}
              </span>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {post.content}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostDetailPage;
