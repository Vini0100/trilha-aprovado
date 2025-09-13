'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { UseMutationResult } from '@tanstack/react-query';
import { User } from '@/lib/generated/prisma';

interface MentorProfile {
  user: User;
  bio?: string;
}

interface MentorProfileFormProps {
  profile: MentorProfile;
  updateProfile: UseMutationResult<void, Error, { name?: string; phone?: string; bio?: string }>;
}

export default function MentorProfileForm({ profile, updateProfile }: MentorProfileFormProps) {
  const [name, setName] = useState(profile.user.name || '');
  const [phone, setPhone] = useState(profile.user.phone || '');
  const [bio, setBio] = useState(profile.bio || '');

  useEffect(() => {
    setName(profile.user.name || '');
    setPhone(profile.user.phone || '');
    setBio(profile.bio || '');
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(
      { name, phone, bio },
      {
        onSuccess: () => toast.success('Perfil atualizado!'),
        onError: err => toast.error(err.message || 'Erro ao atualizar perfil'),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nome"
        className="p-3 border rounded"
      />
      <input
        type="text"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="Telefone"
        className="p-3 border rounded"
      />
      <textarea
        value={bio}
        onChange={e => setBio(e.target.value)}
        placeholder="Sobre você"
        className="p-3 border rounded"
      />

      <button
        type="submit"
        disabled={updateProfile.isPending}
        className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
      >
        {updateProfile.isPending ? 'Atualizando...' : 'Atualizar Perfil'}
      </button>
    </form>
  );
}
