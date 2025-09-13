export async function getSubjectService() {
  const res = await fetch('/api/subject');
  if (!res.ok) throw new Error('Erro ao buscar matérias');
  return res.json();
}
