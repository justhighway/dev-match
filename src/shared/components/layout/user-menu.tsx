'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createClient } from '@/shared/supabase/client';

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-ring cursor-pointer rounded-full focus-visible:ring-2 focus-visible:outline-none">
        <Avatar>
          <AvatarImage src={user.user_metadata.avatar_url ?? ''} />
          <AvatarFallback>
            {user.user_metadata.full_name?.charAt(0) ?? user.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user.user_metadata.full_name ?? user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">마이페이지</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>로그아웃</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
