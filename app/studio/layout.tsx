import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import HeaderAdmin from '../components/admin/HeaderAdmin';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'cgaviria930@gmail.com')
  .split(',')
  .map(e => e.trim().toLowerCase());

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in?redirect_url=/studio');
  }

  const user = await currentUser();
  
  // Busca en todos los emails, no solo el primero
  const isAdmin = user?.emailAddresses.some(e =>
    ADMIN_EMAILS.includes(e.emailAddress.toLowerCase())
  );

  if (!isAdmin) {
    redirect('/?error=unauthorized');
  }

  return (
    <>
      <HeaderAdmin />
      <main className="min-h-screen pt-5 bg-danashop-colorMain">
        {children}
      </main>
    </>
  );
}