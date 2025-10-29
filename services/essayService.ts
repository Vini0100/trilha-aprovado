export async function createEssayPayment({
  studentId,
  mentorId,
  title,
  text,
}: {
  studentId: number;
  mentorId: number;
  title: string;
  text: string;
}) {
  const res = await fetch('/api/essays', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, mentorId, title, text }),
  });
  if (!res.ok) throw new Error('Erro ao criar pagamento da redação');
  return res.json();
}

export async function getEssayStatus(essayId: number) {
  const res = await fetch(`/api/essays/status?essayId=${essayId}`);
  if (!res.ok) throw new Error('Erro ao buscar status da redação');
  return res.json();
}

export async function getStudentEssays(studentId: number) {
  const res = await fetch(`/api/essays?studentId=${studentId}`);
  if (!res.ok) throw new Error('Erro ao buscar redações do aluno');
  return res.json();
}

export async function getMentorEssays(mentorId: number) {
  const res = await fetch(`/api/essays?mentorId=${mentorId}`);
  if (!res.ok) throw new Error('Erro ao buscar redações para corrigir');
  return res.json();
}

export async function getEssayDetails(id: number) {
  const res = await fetch(`/api/essays/${id}`);
  if (!res.ok) throw new Error('Erro ao buscar detalhes da redação');
  return res.json();
}

export async function finalizeEssay(
  id: number,
  { grade, feedback }: { grade: number; feedback: string },
) {
  const res = await fetch(`/api/essays/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grade, feedback }),
  });
  if (!res.ok) throw new Error('Erro ao finalizar correção');
  return res.json();
}
