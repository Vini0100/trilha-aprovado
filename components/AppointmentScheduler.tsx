'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useMentors } from '@/hooks/useMentor';
// subjects are loaded per-mentor via the mentors API (mentor.subjects)
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Input } from './ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { MentorWithRelations } from '@/services/mentorService';
import { useSession } from 'next-auth/react';
import { useAppointment } from '@/hooks/useAppointment';

const AppointmentScheduler: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: mentors, isLoading } = useMentors();
  const { data: session } = useSession();

  const today = new Date();
  const dates: Date[] = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const allTimes = Array.from({ length: 12 }, (_, i) => i + 8)
    .filter(h => h !== 12)
    .map(h => `${h.toString().padStart(2, '0')}:00`);

  const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(dates[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedContactMethod, setSelectedContactMethod] = useState<'whatsapp' | 'email' | null>(null);
  const [selectedContactValue, setSelectedContactValue] = useState<string>('');

  const formatDate = (date: Date) =>
    date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const formatWeekday = (date: Date) =>
    date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();

  const mentorSchedulesForDate = (mentor: MentorWithRelations, date: Date) => {
    const dayKey = date.toISOString().split('T')[0]; // "yyyy-MM-dd"
    return mentor.schedules.filter(s => s.day === dayKey && s.status === 'available');
  };

  const { create, qrCode, paymentAmount, showSuccess, successInfo, reset } = useAppointment();

  const handleSchedule = (mentorId: number) => {
    if (!selectedDate || !selectedTime) return;

    const mentor = mentors?.find(m => m.id === mentorId);
    const availableSchedules = mentor?.schedules.filter(
      s => s.day === selectedDate.toISOString().split('T')[0] && s.status === 'available',
    );
    const schedule = availableSchedules?.find(s => s.startTime === selectedTime);
    if (!schedule) {
      console.error('Nenhum schedule correspondente encontrado');
      return;
    }

    if (!selectedSubjectId) {
      console.error('Nenhuma matéria selecionada');
      return;
    }
    if (!selectedContactMethod || !selectedContactValue) {
      console.error('Contato não definido');
      return;
    }

    create({
      studentId: Number(session?.user.id),
      mentorId,
      subjectId: selectedSubjectId,
      scheduleId: schedule.id,
      contactMethod: selectedContactMethod,
      contactValue: selectedContactValue,
    });
  };

  if (isLoading) return <p>Carregando mentores...</p>;
  if (!mentors || mentors.length === 0) return <p>Nenhum mentor encontrado.</p>;

  return (
    <div className="flex flex-col gap-6">
      {mentors.map((mentor: MentorWithRelations) => (
        <Card key={mentor.id}>
          <CardHeader>
            <CardTitle>Agendar consulta com {mentor.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex space-x-1 min-w-max">
                {dates.map((date, idx) => {
                  const isSelected =
                    selectedDate?.toDateString() === date.toDateString() &&
                    selectedMentorId === mentor.id;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg cursor-pointer border ${
                        isSelected ? 'bg-blue-100 border-blue-500' : 'bg-gray-100'
                      }`}
                      onClick={() => {
                          setSelectedDate(date);
                          setSelectedMentorId(mentor.id);
                          setSelectedTime(null);
                          setSelectedSubjectId(null);
                          setSelectedContactMethod(null);
                          setSelectedContactValue('');
                        }}
                    >
                      <div className="text-xs font-semibold">{formatWeekday(date)}</div>
                      <div className="text-sm">{formatDate(date)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedDate && selectedMentorId === mentor.id ? (
              <div className="grid grid-cols-6 gap-2 mt-4">
                {allTimes.map(time => {
                  const availableTimes = mentorSchedulesForDate(mentor, selectedDate);
                  const isAvailable = availableTimes.some(s => s.startTime === time);

                  return (
                    <button
                      key={time}
                      className={`p-3 rounded-lg text-center whitespace-nowrap ${
                        isAvailable
                          ? selectedTime === time
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (!isAvailable) return;
                        setSelectedTime(time);
                        // reset subject and contact inputs when changing time
                        setSelectedSubjectId(null);
                        setSelectedContactMethod(null);
                        setSelectedContactValue('');
                      }}
                      disabled={!isAvailable}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Selecione uma data para ver os horários disponíveis
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 items-center md:items-start">
            <div className="w-full md:w-auto flex flex-col items-center md:items-start gap-3">
              <div className="w-full md:w-64">
                {selectedMentorId === mentor.id && selectedTime ? (
                  (() => {
                    const mentorSubjects = mentor.subjects ?? [];
                    return mentorSubjects.length > 0 ? (
                      <div className="text-sm">
                        <span className="mb-1 font-medium block">Matéria</span>
                        <Select value={selectedSubjectId ? String(selectedSubjectId) : ''} onValueChange={val => setSelectedSubjectId(val ? Number(val) : null)}>
                          <SelectTrigger>
                            <SelectValue>{selectedSubjectId ? mentorSubjects.find(s => s.id === selectedSubjectId)?.name : 'Selecione a matéria'}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {mentorSubjects.map(s => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Nenhuma matéria disponível para este mentor.</div>
                    );
                  })()
                ) : (
                  selectedMentorId === mentor.id ? (
                    <div className="text-sm text-gray-500">Selecione um horário para escolher a matéria</div>
                  ) : null
                )}
              </div>

              {selectedMentorId === mentor.id && selectedTime && (
                <div className="w-full md:w-64 mt-2">
                  <span className="block text-sm font-medium mb-1">Método de contato</span>
                  <RadioGroup
                    value={selectedContactMethod ?? ''}
                    onValueChange={val => setSelectedContactMethod(val ? (val as 'whatsapp' | 'email') : null)}
                    className="flex items-center gap-4 mb-2"
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="whatsapp" />
                      <span>WhatsApp</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="email" />
                      <span>Email</span>
                    </label>
                  </RadioGroup>

                  <label className="block text-sm">
                    <span className="text-sm">Contato (número ou e-mail)</span>
                    <Input
                      value={selectedContactValue}
                      onChange={e => setSelectedContactValue(e.target.value)}
                      placeholder={selectedContactMethod === 'whatsapp' ? 'Digite o número com DDD' : 'Digite o e-mail'}
                      className="mt-1 w-full"
                    />
                  </label>
                </div>
              )}

              <button
                className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold ${
                  selectedMentorId === mentor.id && selectedDate && selectedTime && selectedSubjectId && selectedContactMethod && selectedContactValue
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!(selectedMentorId === mentor.id && selectedDate && selectedTime && selectedSubjectId && selectedContactMethod && selectedContactValue)}
                onClick={() => handleSchedule(mentor.id)}
              >
                AGENDAR CONSULTA
              </button>
            </div>

            {mentor.id === selectedMentorId && qrCode && !showSuccess && (
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm font-medium text-center">Escaneie o QR Code para pagar via PIX:</p>
                  <img src={qrCode} alt="QR Code Pix" className="w-48 h-48 border rounded-lg" />
                </div>
                <div className="flex flex-col items-center lg:items-start gap-2 lg:ml-4">
                  <div className="text-center lg:text-left">
                    <p className="text-lg font-semibold text-gray-700">Valor a pagar:</p>
                    <p className="text-2xl font-bold text-green-600">
                      {paymentAmount ? `R$ ${paymentAmount.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 max-w-xs text-center lg:text-left">
                    <p>• Após o pagamento, seu agendamento será confirmado automaticamente</p>
                    <p>• O pagamento pode levar alguns segundos para ser processado</p>
                  </div>
                </div>
              </div>
            )}
            {showSuccess && successInfo && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center gap-4">
                  <h2 className="text-xl font-bold text-green-700">Pagamento aprovado!</h2>
                  <p className="text-base">Seu agendamento foi confirmado para:</p>
                  <div className="font-semibold text-lg">
                    {successInfo.date} às {successInfo.time}
                  </div>
                  <button
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => {
                      reset();
                      setSelectedMentorId(null);
                      setSelectedDate(dates[0]);
                      setSelectedTime(null);
                      setSelectedSubjectId(null);
                      setSelectedContactMethod(null);
                      setSelectedContactValue('');
                      queryClient.invalidateQueries({ queryKey: ['mentors'] });
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AppointmentScheduler;
