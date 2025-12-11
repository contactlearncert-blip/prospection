'use client';
import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Send } from 'lucide-react';
import type { Prospect } from '@/lib/types';
import { generateMessageAction } from '../actions';

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prospect: Prospect;
  onMessageSent: () => void;
}

export function SendMessageDialog({ open, onOpenChange, prospect, onMessageSent }: SendMessageDialogProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSending, startSending] = useTransition();

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setError(null);
      setMessage('');

      generateMessageAction({
        prospectName: prospect.name,
        prospectOnlinePresence: prospect.onlinePresence,
        serviceOffering: 'une suite de services en ligne pour améliorer la présence web et l\'engagement des utilisateurs.',
      })
        .then(result => {
          setMessage(result.personalizedMessage);
        })
        .catch(() => {
          setError('Échec de la génération du message. Vous pouvez toujours en écrire un manuellement.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, prospect]);

  const handleSend = () => {
    startSending(() => {
        // Dans une vraie application, cela enverrait le message
        console.log(`Envoi du message à ${prospect.name}: ${message}`);
        onMessageSent();
        onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" /> Personnaliser le message
          </DialogTitle>
          <DialogDescription>
            Message généré par l'IA pour {prospect.name}. N'hésitez pas à le modifier.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={8}
              placeholder="Écrivez votre message..."
            />
          )}
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSend} disabled={isLoading || isSending || !message}>
            {isSending ? <Loader2 className="mr-2 size-4 animate-spin"/> : <Send className="mr-2 size-4"/>}
            Envoyer le message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
