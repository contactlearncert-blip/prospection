'use client';
import { useState, useMemo, useTransition, useEffect } from 'react';
import type { Prospect, ProspectStatus, Industry } from '@/lib/types';
import { industries } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ArrowDown, ArrowUp, Send, Mail, MessageCircleReply, ThumbsUp, ThumbsDown, Laptop, HeartPulse, Landmark, ShoppingBag, BookOpen, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SendMessageDialog } from './send-message-dialog';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const statusIcons: Record<ProspectStatus, React.ReactNode> = {
    new: <Mail className="size-4" />,
    contacted: <Send className="size-4" />,
    replied: <MessageCircleReply className="size-4" />,
    interested: <ThumbsUp className="size-4" />,
    not_interested: <ThumbsDown className="size-4" />,
};

const statusTranslations: Record<ProspectStatus, string> = {
  new: 'Nouveau',
  contacted: 'Contacté',
  replied: 'A répondu',
  interested: 'Intéressé',
  not_interested: 'Pas intéressé',
};

const industryIcons: Record<Industry, React.ReactNode> = {
    Tech: <Laptop className="size-4" />,
    Healthcare: <HeartPulse className="size-4" />,
    Finance: <Landmark className="size-4" />,
    'E-commerce': <ShoppingBag className="size-4" />,
    Education: <BookOpen className="size-4" />,
    Marketing: <Send className="size-4" />,
    'Real Estate': <Building2 className="size-4" />,
};

type SortConfig = {
  key: keyof Prospect | 'lastContacted';
  direction: 'ascending' | 'descending';
};

const getStatusBadgeVariant = (status: ProspectStatus) => {
    switch (status) {
        case 'interested':
        return 'default';
        case 'new':
        return 'secondary';
        case 'not_interested':
        return 'destructive';
        default:
        return 'outline';
    }
}

export function ProspectsTable({ data }: { data: Prospect[] }) {
  const [prospects, setProspects] = useState<Prospect[]>(data);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProspectStatus | 'all'>('all');
  const [industryFilter, setIndustryFilter] = useState<Industry | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setProspects(data);
  }, [data]);

  const handleStatusChange = (prospectId: string, newStatus: ProspectStatus) => {
     if (!user || !firestore) return;
    
    const originalProspects = prospects;
    // Optimistic update
    setProspects(prev =>
      prev.map(p =>
        p.id === prospectId ? { ...p, status: newStatus, lastContacted: new Date().toISOString() } : p
      )
    );
    
    const prospectRef = doc(firestore, `users/${user.uid}/prospects/${prospectId}`);
    updateDoc(prospectRef, {
        status: newStatus,
        lastContacted: new Date().toISOString(),
    }).catch(() => {
        toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Impossible de mettre à jour le statut du prospect.'
        });
        // Revert optimistic update
        setProspects(originalProspects);
    });
  };

  const filteredAndSortedProspects = useMemo(() => {
    let filtered = prospects.filter(p =>
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       p.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || p.status === statusFilter) &&
      (industryFilter === 'all' || p.industry === industryFilter)
    );

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === 'lastContacted') {
            aValue = a.lastContacted ? new Date(a.lastContacted).getTime() : 0;
            bValue = b.lastContacted ? new Date(b.lastContacted).getTime() : 0;
        } else {
            aValue = a[sortConfig.key as keyof Prospect];
            bValue = b[sortConfig.key as keyof Prospect];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [prospects, searchTerm, statusFilter, industryFilter, sortConfig]);

  const requestSort = (key: keyof Prospect | 'lastContacted') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof Prospect | 'lastContacted') => {
    if (!sortConfig || sortConfig.key !== key) {
        return null;
    }
    return sortConfig.direction === 'ascending' ? <ArrowUp className="ml-2 size-4" /> : <ArrowDown className="ml-2 size-4" />;
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  const handleSendMessageClick = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setDialogOpen(true);
  };

  return (
    <>
    <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
        <Input 
            placeholder="Rechercher par nom ou entreprise..."
            value={searchTerm}
            onChange={e => startTransition(() => setSearchTerm(e.target.value))}
            className="max-w-sm"
        />
        <div className="flex gap-2 w-full sm:w-auto">
        <Select value={statusFilter} onValueChange={(value) => startTransition(() => setStatusFilter(value as any))}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(statusTranslations).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        <Select value={industryFilter} onValueChange={(value) => startTransition(() => setIndustryFilter(value as any))}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrer par industrie" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Toutes les industries</SelectItem>
                {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        </div>
    </div>
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => requestSort('name')}>
                <div className="flex items-center cursor-pointer">Prospect {getSortIcon('name')}</div>
            </TableHead>
            <TableHead onClick={() => requestSort('industry')}>
                <div className="flex items-center cursor-pointer">Industrie {getSortIcon('industry')}</div>
            </TableHead>
            <TableHead onClick={() => requestSort('status')}>
                <div className="flex items-center cursor-pointer">Statut {getSortIcon('status')}</div>
            </TableHead>
            <TableHead onClick={() => requestSort('lastContacted')}>
                <div className="flex items-center cursor-pointer">Dernier contact {getSortIcon('lastContacted')}</div>
            </TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(isPending || filteredAndSortedProspects.length > 0) ? (
            filteredAndSortedProspects.map(prospect => (
              <TableRow key={prospect.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={prospect.avatar} alt={prospect.name} data-ai-hint="person" />
                      <AvatarFallback>{prospect.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{prospect.name}</div>
                      <div className="text-sm text-muted-foreground">{prospect.company}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                      {industryIcons[prospect.industry]}
                      {prospect.industry}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(prospect.status)} className="capitalize">
                      {statusTranslations[prospect.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {prospect.lastContacted
                    ? formatDistanceToNow(new Date(prospect.lastContacted), { addSuffix: true, locale: fr })
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleSendMessageClick(prospect)}>
                          <Send className="mr-2 size-4" />
                          Personnaliser le message
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
                      {Object.keys(statusIcons).map(status => (
                          <DropdownMenuItem key={status} onClick={() => handleStatusChange(prospect.id, status as ProspectStatus)}>
                              {statusIcons[status as ProspectStatus]}
                              <span className="ml-2 capitalize">{statusTranslations[status as ProspectStatus]}</span>
                          </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Aucun prospect trouvé. Commencez par en ajouter un !
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    {selectedProspect && (
        <SendMessageDialog open={dialogOpen} onOpenChange={setDialogOpen} prospect={selectedProspect} onMessageSent={() => handleStatusChange(selectedProspect.id, 'contacted')}/>
    )}
    </>
  );
}
