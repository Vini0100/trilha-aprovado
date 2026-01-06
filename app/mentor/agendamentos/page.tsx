'use client';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Clock } from 'lucide-react';
import { useMentorAppointments } from '@/hooks/useAppointment';
import { useMentorProfile } from '@/hooks/useMentor';

export default function MentorAppointmentsPage() {
  const { data: session } = useSession();
  const userId = session?.user.id ? Number(session.user.id) : null;

  const { data: profile, isLoading: isLoadingProfile } = useMentorProfile(userId);
  const mentorId = profile?.id;

  const { data: appointments, isLoading: isLoadingAppointments } = useMentorAppointments(mentorId);

  if (!userId) {
    return (
      <div className="p-8 text-center">
        Faça login como mentor para ver seus agendamentos pagos.
      </div>
    );
  }

  if (isLoadingProfile || isLoadingAppointments) {
    return <div className="p-8 text-center">Carregando agendamentos...</div>;
  }

  if (!mentorId) {
    return <div className="p-8 text-center">Perfil de mentor não encontrado.</div>;
  }
  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <CalendarCheck className="w-16 h-16 text-gray-300 mb-4" />
        <div className="text-lg text-gray-500">Nenhum agendamento pago encontrado.</div>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto p-4 w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">Agendamentos Pagos</h1>
      <div className="flex flex-col gap-4">
        {appointments.map((appt: any) => (
          <Card key={appt.id} className="w-full">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <CalendarCheck className="text-green-600 w-6 h-6" />
              <CardTitle className="text-lg font-semibold">{appt.studentName}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">{appt.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{appt.time}</span>
              </div>
              {appt.contactMethod && appt.contactValue && (
                <div className="mt-2 text-sm text-gray-600 sm:ml-auto">
                  <div className="font-medium">Contato ({appt.contactMethod})</div>
                  <div>{appt.contactValue}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
