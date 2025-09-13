'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCadastrarUser } from '@/hooks/useUser';

// Validação com Zod
const cadastroUserSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  password: z.string().min(6, 'Senha muito curta'),
});

// Tipagem do formulário
type CadastroUserForm = z.infer<typeof cadastroUserSchema>;

export default function UserRegisterPage() {
  const cadastrarUser = useCadastrarUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CadastroUserForm>({
    resolver: zodResolver(cadastroUserSchema),
  });

  const onSubmit: SubmitHandler<CadastroUserForm> = data => {
    cadastrarUser.mutate(data, {
      onSuccess: () => {
        toast.success('Usuário cadastrado com sucesso!');
        reset();
      },
      onError: (err: unknown) => {
        if (err instanceof Error) toast.error(err.message);
        else toast.error('Erro ao cadastrar usuário');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md mx-auto mt-20">
      <Input {...register('name')} placeholder="Nome" />
      {errors.name && <span className="text-red-500">{errors.name.message}</span>}

      <Input {...register('email')} type="email" placeholder="E-mail" />
      {errors.email && <span className="text-red-500">{errors.email.message}</span>}

      <Input {...register('phone')} placeholder="Telefone" />
      {errors.phone && <span className="text-red-500">{errors.phone.message}</span>}

      <Input {...register('password')} type="password" placeholder="Senha" />
      {errors.password && <span className="text-red-500">{errors.password.message}</span>}

      <Button type="submit" className="w-full" disabled={cadastrarUser.isPending}>
        {cadastrarUser.isPending ? 'Cadastrando...' : 'Cadastrar'}
      </Button>
    </form>
  );
}
