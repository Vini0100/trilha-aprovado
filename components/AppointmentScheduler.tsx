'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useMentors } from '@/hooks/useMentor';
import { MentorWithRelations } from '@/services/mentorService';

const AppointmentScheduler: React.FC = () => {
  const { data: mentors, isLoading } = useMentors();
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

  const handleSchedule = async () => {
    if (selectedMentorId && selectedDate && selectedTime) {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: `${selectedMentorId}-${selectedDate}-${selectedTime}`, // mock
        }),
      });

      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point; // redireciona para o checkout
      }
    }
  };

  const mentorSchedulesForDate = (mentor: MentorWithRelations, date: Date) => {
    const dayKey = date.toISOString().split('T')[0]; // "yyyy-MM-dd"
    return mentor.schedules.filter(s => s.day === dayKey && s.status === 'available');
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
          <CardFooter>
            <button
              className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold ${
                selectedMentorId === mentor.id && selectedDate && selectedTime
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleSchedule}
              disabled={!(selectedMentorId === mentor.id && selectedDate && selectedTime)}
            >
              AGENDAR CONSULTA
            </button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AppointmentScheduler;
