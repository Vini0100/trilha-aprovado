import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createAppointment,
  getAppointmentStatus,
  getUserAppointments,
  getMentorAppointments,
} from '@/services/appointmentService';

export function useUserAppointments(userId: number | undefined) {
  return useQuery({
    queryKey: ['user-appointments', userId],
    queryFn: () => (userId ? getUserAppointments(userId) : Promise.resolve([])),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useMentorAppointments(mentorId: number | undefined) {
  return useQuery({
    queryKey: ['mentor-appointments', mentorId],
    queryFn: () => (mentorId ? getMentorAppointments(mentorId) : Promise.resolve([])),
    enabled: !!mentorId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAppointment() {
  const [appointmentId, setAppointmentId] = useState<number | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ date: string; time: string } | null>(null);

  // Mutation para criar agendamento
  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: data => {
      if (data.qrCode) {
        setQrCode(`data:image/png;base64,${data.qrCode}`);
        setAppointmentId(data.appointmentId);
        setShowSuccess(false);
      } else {
        setQrCode(null);
        setAppointmentId(null);
      }
    },
  });

  // Query para status do agendamento
  const statusQuery = useQuery({
    queryKey: ['appointment-status', appointmentId],
    queryFn: () => (appointmentId ? getAppointmentStatus(appointmentId) : Promise.resolve(null)),
    enabled: !!appointmentId && !!qrCode && !showSuccess,
    refetchInterval: !!appointmentId && !!qrCode && !showSuccess ? 4000 : false,
  });

  useEffect(() => {
    if (
      statusQuery.data &&
      (statusQuery.data.status === 'confirmed' || statusQuery.data.status === 'approved')
    ) {
      setShowSuccess(true);
      setSuccessInfo({ date: statusQuery.data.date, time: statusQuery.data.time });
    }
  }, [statusQuery.data]);

  const reset = () => {
    setShowSuccess(false);
    setQrCode(null);
    setAppointmentId(null);
    setSuccessInfo(null);
  };

  return {
    create: mutation.mutate,
    isCreating: mutation.isPending,
    qrCode,
    appointmentId,
    showSuccess,
    successInfo,
    reset,
    statusQuery,
  };
}
