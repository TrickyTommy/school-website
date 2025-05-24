import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { LogIn, Eye, EyeOff } from 'lucide-react';

    const AdminLoginForm = ({ onLoginSuccess }) => {
      const { toast } = useToast();
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [showPassword, setShowPassword] = useState(false);

      const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin123') {
          onLoginSuccess();
        } else {
          toast({ title: "Login Gagal", description: "Username atau password salah.", variant: "destructive" });
        }
      };

      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="w-full max-w-md shadow-2xl glassmorphic dark:bg-gray-800/70">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-primary">Admin Login</CardTitle>
                <CardDescription>Silakan masuk untuk mengelola konten website.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" required className="mt-1 bg-white/80 dark:bg-gray-700/60" />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="admin123" required className="mt-1 bg-white/80 dark:bg-gray-700/60" />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                    <LogIn className="mr-2 h-5 w-5" /> Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default AdminLoginForm;