import NavLinks from './nav-links';
import UserMenu from './user-menu';
import Logo from './logo';
import Container from './container';

interface HeaderProps {
  user: {
    nickname: string;
    avatarUrl: string | null;
  };
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-2xl">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-6">
          <NavLinks />
          <UserMenu user={{ nickname: 'John Doe', avatarUrl: null }} />
        </div>
      </Container>
    </header>
  );
}
