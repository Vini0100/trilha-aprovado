import { useMutation } from '@tanstack/react-query';
import { createMentorService } from '@/services/mentorService';

export function useCadastrarMentor() {
  return useMutation({
    mutationFn: createMentorService,
  });
}
