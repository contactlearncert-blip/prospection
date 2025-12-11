'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, UserPlus, FileSearch, Loader2, Frown, Sparkles } from 'lucide-react';
import { evaluateProspectAction } from '../actions';
import type { EvaluateProspectOutput } from '@/ai/flows/automated-prospect-evaluation';
import { industries, type Industry } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Step = 'initial' | 'loading' | 'result' | 'form';

export function AddProspectDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('initial');
  const [industry, setIndustry] = useState('');
  const [onlinePresence, setOnlinePresence] = useState('');
  const [evaluationResult, setEvaluationResult] = useState<EvaluateProspectOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluation = async () => {
    if (!industry || !onlinePresence) {
      setError('Veuillez remplir les deux champs.');
      return;
    }
    setError(null);
    setStep('loading');
    try {
      const result = await evaluateProspectAction({ industry, onlinePresence });
      setEvaluationResult(result);
      setStep('result');
    } catch (err) {
      setError("Échec de l'évaluation du prospect. Veuillez réessayer.");
      setStep('initial');
    }
  };

  const resetState = () => {
    setStep('initial');
    setIndustry('');
    setOnlinePresence('');
    setEvaluationResult(null);
    setError(null);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
    }
    setOpen(isOpen);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter un prospect
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {step === 'initial' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><FileSearch /> Évaluer un prospect</DialogTitle>
              <DialogDescription>
                Laissez notre assistant IA évaluer une piste potentielle en fonction de son secteur d'activité et de sa présence en ligne.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="industry" className="text-right">
                  Industrie
                </Label>
                <Select onValueChange={setIndustry}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez une industrie" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="online-presence" className="text-right">
                  Présence en ligne
                </Label>
                <Textarea
                  id="online-presence"
                  value={onlinePresence}
                  onChange={(e) => setOnlinePresence(e.target.value)}
                  className="col-span-3"
                  placeholder="par ex., site web d'entreprise, profil LinkedIn, actualités récentes..."
                />
              </div>
              {error && <p className="text-sm text-destructive col-span-4 text-center">{error}</p>}
            </div>
            <DialogFooter>
              <Button onClick={handleEvaluation}>Évaluer</Button>
            </DialogFooter>
          </>
        )}
        {step === 'loading' && (
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <Loader2 className="size-12 animate-spin text-primary" />
                <p className="text-muted-foreground">L'IA évalue le prospect...</p>
            </div>
        )}
        {step === 'result' && evaluationResult && (
            <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {evaluationResult.isGoodFit ? <Sparkles className="text-green-500" /> : <Frown />} 
                    Résultat de l'évaluation
                  </DialogTitle>
                  <DialogDescription>
                    {evaluationResult.isGoodFit ? "Ce prospect semble être une bonne piste !" : "Ce prospect n'est peut-être pas une bonne piste."}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm bg-muted p-4 rounded-md">{evaluationResult.reason}</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={resetState}>Évaluer un autre</Button>
                    {evaluationResult.isGoodFit && <Button onClick={() => setStep('form')}>Ajouter les détails du prospect</Button>}
                </DialogFooter>
            </>
        )}
        {step === 'form' && (
             <>
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2"><UserPlus /> Ajouter un nouveau prospect</DialogTitle>
               <DialogDescription>
                 Remplissez les détails pour le nouveau prospect.
               </DialogDescription>
             </DialogHeader>
             <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="name" className="text-right">Nom</Label>
                 <Input id="name" className="col-span-3" />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="company" className="text-right">Entreprise</Label>
                 <Input id="company" className="col-span-3" />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="email" className="text-right">Email</Label>
                 <Input id="email" type="email" className="col-span-3" />
               </div>
             </div>
             <DialogFooter>
                <Button variant="outline" onClick={() => setStep('result')}>Retour à l'évaluation</Button>
               <Button onClick={() => handleOpenChange(false)}>Enregistrer le prospect</Button>
             </DialogFooter>
           </>
        )}
      </DialogContent>
    </Dialog>
  );
}
