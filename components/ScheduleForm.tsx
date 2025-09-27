'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { toast } from 'sonner';
import { useCreateSchedules, useMentorSchedules, useRemoveSchedules } from '@/hooks/useSchedule';

interface ScheduleFormProps {
  mentorId: number;
}

interface HourBlock {
  startTime: string;
  endTime: string;
}

export default function ScheduleForm({ mentorId }: ScheduleFormProps) {
  const createSchedules = useCreateSchedules(mentorId);
  const removeSchedules = useRemoveSchedules(mentorId);
  const { data: existingSchedules, isLoading } = useMentorSchedules(mentorId);

  const dates = useMemo(() => {
    const today = new Date();
    const arr: Date[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date | null>(dates[0]);
  const [selectedHours, setSelectedHours] = useState<Record<string, HourBlock[]>>({});

  const allTimes = Array.from({ length: 12 }, (_, i) => i + 8)
    .filter(h => h !== 12)
    .map(hour => `${hour.toString().padStart(2, '0')}:00`);

  const toggleHour = (time: string) => {
    if (!selectedDate) return;
    const dayKey = selectedDate.toISOString().split('T')[0];
    const existing = selectedHours[dayKey] || [];
    const idx = existing.findIndex(h => h.startTime === time);
    if (idx >= 0) {
      existing.splice(idx, 1);
    } else {
      existing.push({ startTime: time, endTime: `${parseInt(time.split(':')[0]) + 1}:00` });
    }
    setSelectedHours({ ...selectedHours, [dayKey]: existing });
  };

  const removeHour = (dayKey: string, startTime: string) => {
    const updated = (selectedHours[dayKey] || []).filter(h => h.startTime !== startTime);
    setSelectedHours({ ...selectedHours, [dayKey]: updated });
  };

  const handleSubmit = () => {
    // Monta todos os horários atualmente selecionados
    const selected = Object.entries(selectedHours).flatMap(([day, hours]) =>
      hours.map(h => ({ day, startTime: h.startTime, endTime: h.endTime })),
    );
    // Monta todos os horários existentes
    const existing =
      (existingSchedules as { day: string; startTime: string; endTime: string }[]) || [];
    // Horários a remover: estão em existingSchedules mas não em selectedHours
    const toRemove = existing.filter(
      e =>
        !selected.some(
          s => s.day === e.day && s.startTime === e.startTime && s.endTime === e.endTime,
        ),
    );
    // Horários a adicionar: estão em selectedHours mas não em existingSchedules
    const toAdd = selected.filter(
      s =>
        !existing.some(
          e => e.day === s.day && e.startTime === s.startTime && e.endTime === s.endTime,
        ),
    );
    if (toAdd.length === 0 && toRemove.length === 0) {
      toast.error('Nenhuma alteração nos horários!');
      return;
    }
    if (toRemove.length > 0) {
      removeSchedules.mutate(toRemove, {
        onSuccess: () => toast.success('Horários removidos!'),
        onError: (err: any) => toast.error(err.message || 'Erro ao remover horários'),
      });
    }
    if (toAdd.length > 0) {
      createSchedules.mutate(toAdd, {
        onSuccess: () => toast.success('Horários salvos!'),
        onError: (err: any) => toast.error(err.message || 'Erro ao salvar horários'),
      });
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const formatWeekday = (date: Date) =>
    date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();

  useEffect(() => {
    if (existingSchedules) {
      const preloaded: Record<string, HourBlock[]> = {};
      existingSchedules.forEach((s: { day: string; startTime: string; endTime: string }) => {
        if (!preloaded[s.day]) preloaded[s.day] = [];
        preloaded[s.day].push({ startTime: s.startTime, endTime: s.endTime });
      });
      setSelectedHours(preloaded);
    }
  }, [existingSchedules]);

  if (isLoading) {
    return <div>Carregando horários...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecionar horários para os próximos 30 dias</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Grid de datas */}
        <div className="overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {dates.map((d, idx) => {
              const dayKey = d.toISOString().split('T')[0];
              const isSelected = selectedDate?.toDateString() === d.toDateString();
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg cursor-pointer border ${
                    isSelected ? 'bg-blue-100 border-blue-500' : 'bg-gray-100'
                  }`}
                  onClick={() => setSelectedDate(d)}
                >
                  <div className="text-xs font-semibold">{formatWeekday(d)}</div>
                  <div className="text-sm">{formatDate(d)}</div>
                  {selectedHours[dayKey]?.length ? (
                    <div className="text-xs text-green-700">{selectedHours[dayKey].length}h</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid de horários do dia selecionado */}
        {selectedDate && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Horários para {formatDate(selectedDate)}</h4>
            <div className="grid grid-cols-6 gap-2">
              {allTimes.map(time => {
                const dayKey = selectedDate.toISOString().split('T')[0];
                const selected = selectedHours[dayKey]?.some(h => h.startTime === time);
                return (
                  <button
                    key={time}
                    type="button"
                    className={`p-2 rounded text-sm ${
                      selected
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                    onClick={() => toggleHour(time)}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Horários selecionados em cards */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Horários selecionados:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedHours).flatMap(([day, hours]) =>
              hours.map((h, idx) => (
                <div
                  key={`${day}-${h.startTime}-${idx}`}
                  className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 gap-2"
                >
                  <span>
                    {day} - {h.startTime} às {h.endTime}
                  </span>
                  <button
                    type="button"
                    className="text-red-500 font-bold hover:text-red-700"
                    onClick={() => removeHour(day, h.startTime)}
                  >
                    ×
                  </button>
                </div>
              )),
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <button
          className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Confirmar horários
        </button>
      </CardFooter>
    </Card>
  );
}
