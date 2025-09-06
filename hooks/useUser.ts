import { createUserService } from '@/services/userService';
import { useMutation } from '@tanstack/react-query';

export function useCadastrarUser() {
  return useMutation({
    mutationFn: createUserService,
  });
}
