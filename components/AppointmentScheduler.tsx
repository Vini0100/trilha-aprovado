'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useMentors } from '@/hooks/useMentor';
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

    create({
      studentId: Number(session?.user.id),
      mentorId,
      subjectId: 1,
      scheduleId: schedule.id,
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
                      onClick={() => isAvailable && setSelectedTime(time)}
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
          <CardFooter className="flex flex-col gap-4 items-center">
            <button
              className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold ${
                selectedMentorId === mentor.id && selectedDate && selectedTime
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!(selectedMentorId === mentor.id && selectedDate && selectedTime)}
              onClick={() => handleSchedule(mentor.id)}
            >
              AGENDAR CONSULTA
            </button>

            {qrCode && !showSuccess && (
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
