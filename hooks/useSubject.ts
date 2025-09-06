import { useQuery } from '@tanstack/react-query';
import { getSubjectService } from '@/services/subjectService';
import { Subject } from '@/lib/generated/prisma';

export function useSubjects() {
  return useQuery<Subject[], Error>({
    queryKey: ['subjects'],
    queryFn: getSubjectService,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
