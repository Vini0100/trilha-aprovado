'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CadastrarPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/cadastrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });

    if (res.ok) {
      router.push('/entrar'); // redireciona para login
    } else {
      const data = await res.json();
      setError(data.error || 'Erro ao cadastrar');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4 max-w-md mx-auto mt-20">
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
        className="p-3 border rounded"
        required
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="p-3 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Celular"
        value={phone}
        onChange={e => setPhone(e.target.value)}
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
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
      >
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
}
