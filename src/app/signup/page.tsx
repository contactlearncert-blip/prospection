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
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export default function SignupPage() {
  const { signUp } = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "Mot de passe trop court",
            description: "Le mot de passe doit contenir au moins 6 caractères.",
        });
        return;
    }
    setLoading(true);
    try {
      const userCredential = await signUp(email, password);
      if (userCredential?.user && firestore) {
        await setDoc(doc(firestore, "users", userCredential.user.uid), {
            id: userCredential.user.uid,
            name: name,
            email: email,
        });
      }
      toast({
        title: "Compte créé",
        description: "Votre compte a été créé avec succès. Vous allez être redirigé.",
      });
      router.push('/dashboard');
    } catch (error) {
        console.error(error);
        let title = 'Erreur d\'inscription';
        let description = "Une erreur s'est produite. Veuillez réessayer.";
        if (error instanceof FirebaseError) {
            if (error.code === 'auth/email-already-in-use') {
                title = 'Email déjà utilisé';
                description = 'Cet email est déjà associé à un compte.';
            } else if (error.code === 'auth/invalid-email') {
                title = 'Email invalide';
                description = 'Veuillez saisir une adresse email valide.';
            }
        }
      toast({
        variant: 'destructive',
        title: title,
        description: description,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center">
          <Logo className="mb-2" />
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>Entrez vos informations pour commencer</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input 
                    id="name" 
                    placeholder="John Doe" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Création...' : 'Créer le compte'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="underline">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
