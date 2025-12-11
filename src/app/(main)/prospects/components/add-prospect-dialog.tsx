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
      setError('Please fill in both fields.');
      return;
    }
    setError(null);
    setStep('loading');
    try {
      const result = await evaluateProspectAction({ industry, onlinePresence });
      setEvaluationResult(result);
      setStep('result');
    } catch (err) {
      setError('Failed to evaluate prospect. Please try again.');
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
          Add Prospect
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {step === 'initial' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><FileSearch /> Evaluate a Prospect</DialogTitle>
              <DialogDescription>
                Let our AI assistant evaluate a potential lead based on their industry and online presence.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="industry" className="text-right">
                  Industry
                </Label>
                <Select onValueChange={setIndustry}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="online-presence" className="text-right">
                  Online Presence
                </Label>
                <Textarea
                  id="online-presence"
                  value={onlinePresence}
                  onChange={(e) => setOnlinePresence(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Company website, LinkedIn profile, recent news..."
                />
              </div>
              {error && <p className="text-sm text-destructive col-span-4 text-center">{error}</p>}
            </div>
            <DialogFooter>
              <Button onClick={handleEvaluation}>Evaluate</Button>
            </DialogFooter>
          </>
        )}
        {step === 'loading' && (
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <Loader2 className="size-12 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is evaluating the prospect...</p>
            </div>
        )}
        {step === 'result' && evaluationResult && (
            <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {evaluationResult.isGoodFit ? <Sparkles className="text-green-500" /> : <Frown />} 
                    Evaluation Result
                  </DialogTitle>
                  <DialogDescription>
                    {evaluationResult.isGoodFit ? "This prospect seems like a good fit!" : "This prospect might not be a good fit."}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm bg-muted p-4 rounded-md">{evaluationResult.reason}</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={resetState}>Evaluate Another</Button>
                    {evaluationResult.isGoodFit && <Button onClick={() => setStep('form')}>Add Prospect Details</Button>}
                </DialogFooter>
            </>
        )}
        {step === 'form' && (
             <>
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2"><UserPlus /> Add New Prospect</DialogTitle>
               <DialogDescription>
                 Fill in the details for the new prospect.
               </DialogDescription>
             </DialogHeader>
             <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="name" className="text-right">Name</Label>
                 <Input id="name" className="col-span-3" />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="company" className="text-right">Company</Label>
                 <Input id="company" className="col-span-3" />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="email" className="text-right">Email</Label>
                 <Input id="email" type="email" className="col-span-3" />
               </div>
             </div>
             <DialogFooter>
                <Button variant="outline" onClick={() => setStep('result')}>Back to Evaluation</Button>
               <Button onClick={() => handleOpenChange(false)}>Save Prospect</Button>
             </DialogFooter>
           </>
        )}
      </DialogContent>
    </Dialog>
  );
}
