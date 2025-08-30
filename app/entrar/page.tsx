'use client';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';

export default function EntrarPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/', // redireciona após login
    });
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-md mx-auto mt-20">
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="p-3 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="p-3 border rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
        Entrar
      </button>
    </form>
  );
}
