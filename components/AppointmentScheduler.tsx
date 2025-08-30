'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

const AppointmentScheduler = () => {
  // Criar lista de datas antes
  const today = new Date();
  const dates: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  const [selectedDate, setSelectedDate] = useState<Date | null>(dates[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Horários disponíveis (exemplo)
  const availableTimes: Record<string, string[]> = {
    '02/09': ['07:00', '08:00', '10:00', '11:00', '13:00'],
    '03/09': ['09:00', '11:00', '13:00'],
    '04/09': ['15:00', '19:00'],
    '05/09': ['07:00', '10:00', '11:00', '13:00'],
    '08/09': ['07:00', '08:00', '09:00', '10:00', '11:00'],
    '09/09': ['09:00', '11:00', '13:00'],
    '11/09': ['15:00', '19:00'],
    '12/09': ['07:00', '10:00', '11:00', '13:00'],
  };

  // Funções de formatação
  const formatDate = (date: Date) =>
    date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  const formatWeekday = (date: Date) =>
    date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();

  // Verificar se um horário está disponível
  const isTimeAvailable = (date: Date | null, time: string) => {
    if (!date) return false;
    const dateStr = formatDate(date);
    return availableTimes[dateStr]?.includes(time);
  };

  // Todos os horários possíveis
  const allTimes = Array.from({ length: 12 }, (_, i) => i + 8) // [8..19]
    .filter(hour => hour !== 12) // remove 12h
    .map(hour => `${hour.toString().padStart(2, '0')}:00`);

  // Seleção de horário
  const handleTimeSelect = (time: string) => {
    if (isTimeAvailable(selectedDate, time)) {
      setSelectedTime(time);
    }
  };

  // Agendamento
  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      alert(`Consulta agendada para ${formatDate(selectedDate)} às ${selectedTime}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendar consulta com Mateus Andrade Gonzato</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="text-sm text-gray-500">* Horários de Brasil/Brasília</div>

          {/* Datas */}
          <div className="overflow-x-auto">
            <div className="flex space-x-1 min-w-max">
              {dates.map((date, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg cursor-pointer ${
                    selectedDate && selectedDate.getDate() === date.getDate()
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-100'
                  }`}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                >
                  <div className="text-xs font-semibold">{formatWeekday(date)}</div>
                  <div className="text-sm">{formatDate(date)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabela de horários */}
          {selectedDate ? (
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold">
                Horários disponíveis para {formatDate(selectedDate)}
              </h3>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-6 gap-2 min-w-max">
                  {allTimes.map(time => (
                    <button
                      key={time}
                      className={`p-3 rounded-lg text-center whitespace-nowrap ${
                        isTimeAvailable(selectedDate, time)
                          ? selectedTime === time
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => handleTimeSelect(time)}
                      disabled={!isTimeAvailable(selectedDate, time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Selecione uma data para ver os horários disponíveis
            </div>
          )}

          {/* Info seleção */}
          {selectedDate && selectedTime && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold">Você selecionou:</p>
              <p>
                {formatDate(selectedDate)} às {selectedTime}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="text-sm text-blue-600">
            <a href="#" className="hover:underline">
              <svg
                className="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Como funciona?
            </a>
          </div>
          <button
            className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold ${
              selectedDate && selectedTime
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime}
          >
            AGENDAR CONSULTA
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AppointmentScheduler;
