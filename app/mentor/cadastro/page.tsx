'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { prisma } from '@/lib/prisma';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Validação do formulário
const cadastroMentorSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha muito curta'),
  phone: z.string().optional(),
  bio: z.string().min(10, 'A bio precisa ter pelo menos 10 caracteres'),
  subjects: z.array(z.number()).min(1, 'Selecione pelo menos uma matéria'),
});

type CadastroMentorForm = z.infer<typeof cadastroMentorSchema>;

export default function CadastroMentor() {
  const [materias, setMaterias] = useState<{ id: number; name: string }[]>([]);

  // Buscar matérias do banco
  useEffect(() => {
    fetch('/api/materias')
      .then(res => res.json())
      .then(data => setMaterias(data))
      .catch(() => toast.error('Erro ao carregar matérias'));
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CadastroMentorForm>({
    resolver: zodResolver(cadastroMentorSchema),
  });

  const onSubmit = async (data: CadastroMentorForm) => {
    try {
      const res = await fetch('/api/cadastro-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Erro ao cadastrar mentor');

      toast.success('Mentor cadastrado com sucesso!');
    } catch (err) {
      toast.error('Erro ao cadastrar mentor');
    }
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

        <Controller
          control={control}
          name="subjects"
          defaultValue={[]}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              {materias.map(m => (
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

        {errors.subjects && <span className="text-red-500">{errors.subjects.message}</span>}

        <Button type="submit" className="w-full">
          Cadastrar Mentor
        </Button>
      </form>
    </div>
  );
}
