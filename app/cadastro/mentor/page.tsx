'use client';

import { useForm, Controller, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCadastrarMentor } from '@/hooks/useMentor';
import { useSubjects } from '@/hooks/useSubject';
import { Loader2 } from 'lucide-react';

// Validação do formulário
const cadastroMentorSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha muito curta'),
  phone: z.string().optional(),
  bio: z.string().min(10, 'A bio precisa ter pelo menos 10 caracteres'),
  subjects: z.array(z.number()).min(1, 'Selecione pelo menos uma matéria'),
});

// Tipagem do formulário
export type CadastroMentorForm = z.infer<typeof cadastroMentorSchema>;

export default function MentorRegisterPage() {
  const cadastrarMentor = useCadastrarMentor();
  const { data: subjects = [], isLoading } = useSubjects();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  }: UseFormReturn<CadastroMentorForm> = useForm<CadastroMentorForm>({
    resolver: zodResolver(cadastroMentorSchema),
  });

  const onSubmit = (data: CadastroMentorForm) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      bio: data.bio,
      phone: data.phone,
      subjectsIds: data.subjects,
      acceptsEssays: (data as any).acceptsEssays ?? false,
    };

    cadastrarMentor.mutate(payload, {
      onSuccess: () => {
        toast.success('Mentor cadastrado com sucesso!');
        reset();
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error('Erro ao cadastrar mentor');
        }
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Cadastro de Mentor</h1>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('name')} placeholder="Nome completo" />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}

        <Input {...register('email')} type="email" placeholder="E-mail" />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}

        <Input {...register('password')} type="password" placeholder="Senha" />
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}

        <Input {...register('phone')} type="tel" placeholder="Telefone (opcional)" />

        <Input {...register('bio')} placeholder="Uma breve descrição sobre você" />
        {errors.bio && <span className="text-red-500">{errors.bio.message}</span>}

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : (
          <Controller
            control={control}
            name="subjects"
            defaultValue={[]}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                {subjects.map(m => (
                  <label key={m.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={m.id}
                      checked={field.value.includes(m.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          field.onChange([...field.value, m.id]);
                        } else {
                          field.onChange(field.value.filter(v => v !== m.id));
                        }
                      }}
                    />
                    <span>{m.name}</span>
                  </label>
                ))}
              </div>
            )}
          />
        )}

        {errors.subjects && <span className="text-red-500">{errors.subjects.message}</span>}

        <label className="flex items-center gap-2 mt-2">
          <input type="checkbox" {...register('acceptsEssays' as any)} />
          <span>Aceito corrigir redações</span>
        </label>

        <Button type="submit" className="w-full" disabled={cadastrarMentor.isPending}>
          {cadastrarMentor.isPending ? 'Cadastrando...' : 'Cadastrar Mentor'}
        </Button>
      </form>
    </div>
  );
}
