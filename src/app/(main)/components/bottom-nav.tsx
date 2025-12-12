'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Users, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from 'firebase/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface BottomNavProps {
    user: User;
    onSignOut: () => void;
}

export function BottomNav({ user, onSignOut }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: LayoutGrid, label: 'Tableau de bord' },
    { href: '/prospects', icon: Users, label: 'Prospects' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background shadow-t-lg z-10">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-full text-muted-foreground hover:text-primary transition-colors">
                <item.icon className={cn('size-6 mb-1', isActive && 'text-primary')} />
                <span className={cn('text-xs', isActive && 'text-primary font-semibold')}>{item.label}</span>
            </Link>
          );
        })}

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex flex-col items-center justify-center w-full text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    <UserIcon className="size-6 mb-1" />
                    <span className="text-xs">Profil</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-2">
                    <Avatar className="size-8">
                        {user.photoURL && <AvatarImage src={user.photoURL} alt="User Avatar" />}
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || 'Utilisateur'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                        </p>
                    </div>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem disabled>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
