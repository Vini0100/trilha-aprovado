'use client';

import { useSession } from 'next-auth/react';
import { useMentorProfile, useUpdateMentorProfile } from '@/hooks/useMentor';
import MentorProfileForm from '@/components/MentorProfileForm';
import ScheduleForm from '@/components/ScheduleForm';

export default function MentorDashboardPage() {
  const { data: session } = useSession();
  const userId = session?.user.id ? Number(session.user.id) : null;

  const { data: profile, isLoading } = useMentorProfile(userId);
  const updateProfile = useUpdateMentorProfile(userId);

  if (!session) return <p>Carregando...</p>;
  if (!userId) return <p>Erro ao identificar usuário</p>;
  if (isLoading || !profile) return <p>Carregando perfil...</p>;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Painel do Mentor</h1>
        <MentorProfileForm profile={profile} updateProfile={updateProfile} />
        <ScheduleForm mentorId={userId} />
      </main>
    </div>
  );
}
