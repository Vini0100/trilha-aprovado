export async function removeMentorSchedulesService(
  mentorId: number,
  schedules: { day: string; startTime: string; endTime: string }[],
) {
  const res = await fetch('/api/schedule', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mentorId, schedules }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'Erro ao remover horários');
  }

  return res.json();
}
export async function createMentorSchedulesService(
  mentorId: number,
  schedules: { day: string; startTime: string; endTime: string }[],
) {
  const res = await fetch('/api/schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mentorId, schedules }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'Erro ao criar horários');
  }

  return res.json();
}

export async function getMentorSchedulesService(mentorId: number) {
  const res = await fetch(`/api/schedule?mentorId=${mentorId}`);
  if (!res.ok) throw new Error('Erro ao buscar horários');
  return res.json();
}

export async function changeScheduleStatusService(
  scheduleId: number,
  status: 'available' | 'blocked' | 'removed',
) {
  const res = await fetch('/api/schedule', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheduleId, status }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'Erro ao atualizar status do horário');
  }

  return res.json();
}
