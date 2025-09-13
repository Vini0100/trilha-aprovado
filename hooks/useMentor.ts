import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createMentorService,
  getMentorProfileService,
  updateMentorProfileService,
} from '@/services/mentorService';

export function useCadastrarMentor() {
  return useMutation({
    mutationFn: createMentorService,
  });
}

export function useMentorProfile(userId: number | null) {
  return useQuery({
    queryKey: ['mentor', userId],
    queryFn: () => userId && getMentorProfileService(userId),
    enabled: !!userId,
  });
}

export function useUpdateMentorProfile(userId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name?: string; phone?: string; bio?: string }) => {
      if (!userId) throw new Error('Usuário não identificado');
      return updateMentorProfileService(userId, data);
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['mentor', userId] });
      }
    },
  });
}
