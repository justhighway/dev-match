import NavLinks from './nav-links';
import UserMenu from './user-menu';
import Logo from './logo';
import Container from './container';
import LoginButton from './login-button';
import { createClient } from '@/shared/supabase/server';

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-2xl">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-6">
          <NavLinks />
          {user ? <UserMenu user={user} /> : <LoginButton />}
        </div>
      </Container>
    </header>
  );
}
