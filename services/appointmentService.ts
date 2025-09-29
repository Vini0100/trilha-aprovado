// Service para agendamento e status do appointment

export async function createAppointment({ studentId, mentorId, subjectId, scheduleId }: { studentId: number; mentorId: number; subjectId: number; scheduleId: number }) {
  const res = await fetch('/api/mercado-pago', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, mentorId, subjectId, scheduleId }),
  });
  if (!res.ok) throw new Error('Erro ao criar agendamento');
  return res.json();
}

export async function getAppointmentStatus(appointmentId: number) {
  const res = await fetch(`/api/appointment-status?appointmentId=${appointmentId}`);
  if (!res.ok) throw new Error('Erro ao buscar status do agendamento');
  return res.json();
}
