'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { Logo } from '@/components/logo';
import { Separator } from '@/components/ui/separator';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="24px"
        height="24px"
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
      </svg>
    );
  }

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
return (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
    >
    <path
        fill="currentColor"
        d="M17.422 9.547c0 2.03-1.484 3.797-3.422 3.797-1.898 0-3.328-1.767-3.328-3.797 0-1.992 1.43-3.75 3.328-3.75 1.938 0 3.422 1.758 3.422 3.75m-3.422 12.187c-3.14 0-4.664-1.445-6.281-4.289-1.938-3.328-2.133-7.578-.656-10.219 1.484-2.671 4.266-4.476 7.406-4.476 1.281 0 2.953.54 4.172 1.5.023.023.023.031.023.054l-1.984 1.344c-.063.047-.149.031-.204-.023a4.42 4.42 0 0 0-1.968-.96c-1.578-.587-3.36.14-4.219 1.578-1.156 1.953-.61 4.531 1.055 6.234 1.219 1.242 2.758 1.906 4.312 1.906.664 0 1.281-.133 1.914-.383.102-.039.203.008.266.094l1.625 2.125c.062.086.047.203-.024.273-1.07.727-2.43 1.243-4.054 1.243"
    />
    </svg>
);
}

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.signIn(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
        if (provider === 'google') {
            await auth.signInWithGoogle();
        } else {
            await auth.signInWithApple();
        }
        router.push('/dashboard');
    } catch (error) {
        console.error(error);
        handleAuthError(error);
    } finally {
        setLoading(false);
    }
  };
  
  const handleAuthError = (error: any) => {
    let title = 'Erreur de connexion';
    let description = "Une erreur s'est produite. Veuillez réessayer.";
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        title = 'Identifiants invalides';
        description = 'L\'email ou le mot de passe est incorrect.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        title = 'Fenêtre fermée';
        description = 'La fenêtre de connexion a été fermée avant la fin de l\'opération.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        title = 'Compte existant';
        description = 'Un compte existe déjà avec cet email. Essayez de vous connecter avec un autre fournisseur.';
      }
    }
    toast({
      variant: 'destructive',
      title: title,
      description: description,
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center">
          <Logo className="mb-2" />
          <CardTitle>Bienvenue !</CardTitle>
          <CardDescription>Connectez-vous pour accéder à votre tableau de bord</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button variant="outline" onClick={() => handleSocialSignIn('google')} disabled={loading}><GoogleIcon className="mr-2"/> Se connecter avec Google</Button>
            <Button variant="outline" onClick={() => handleSocialSignIn('apple')} disabled={loading}><AppleIcon className="mr-2"/> Se connecter avec Apple</Button>
          </div>
          <Separator className="my-4">ou</Separator>
          <form onSubmit={handleSignIn}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Vous n'avez pas de compte ?{' '}
            <Link href="/signup" className="underline">
              S'inscrire
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
