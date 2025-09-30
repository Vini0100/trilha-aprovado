import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserAppointments from '@/components/UserAppointments';
import { redirect } from 'next/navigation';

export default async function MeusAgendamentosPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/entrar');
  }
  return <UserAppointments />;
}
