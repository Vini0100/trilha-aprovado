import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEssayPayment,
  finalizeEssay,
  getEssayDetails,
  getEssayStatus,
  getMentorEssays,
  getStudentEssays,
} from '@/services/essayService';

export function useEssaySubmission() {
  const [essayId, setEssayId] = useState<number | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: createEssayPayment,
    onSuccess: data => {
      if (data.qrCode) {
        setQrCode(`data:image/png;base64,${data.qrCode}`);
        setEssayId(data.essayId);
        setPaymentAmount(data.amount);
        setShowSuccess(false);
      } else {
        setQrCode(null);
        setEssayId(null);
        setPaymentAmount(null);
      }
    },
  });

  const statusQuery = useQuery({
    queryKey: ['essay-status', essayId],
    queryFn: () => (essayId ? getEssayStatus(essayId) : Promise.resolve(null)),
    enabled: !!essayId && !!qrCode && !showSuccess,
    refetchInterval: !!essayId && !!qrCode && !showSuccess ? 4000 : false,
  });

  useEffect(() => {
    if (statusQuery.data && statusQuery.data.status === 'aguardando_revisao') {
      setShowSuccess(true);
    }
  }, [statusQuery.data]);

  const reset = () => {
    setShowSuccess(false);
    setQrCode(null);
    setEssayId(null);
    setPaymentAmount(null);
  };

  return {
    submit: mutation.mutate,
    isSubmitting: mutation.isPending,
    qrCode,
    paymentAmount,
    essayId,
    showSuccess,
    reset,
    statusQuery,
  };
}

export function useStudentEssays(studentId: number | undefined) {
  return useQuery({
    queryKey: ['student-essays', studentId],
    queryFn: () => (studentId ? getStudentEssays(studentId) : Promise.resolve([])),
    enabled: !!studentId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useMentorEssays(mentorId: number | undefined) {
  return useQuery({
    queryKey: ['mentor-essays', mentorId],
    queryFn: () => (mentorId ? getMentorEssays(mentorId) : Promise.resolve([])),
    enabled: !!mentorId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useEssayDetails(id: number | undefined) {
  return useQuery({
    queryKey: ['essay', id],
    queryFn: () => (id ? getEssayDetails(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}

export function useFinalizeEssay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, grade, feedback }: { id: number; grade: number; feedback: string }) =>
      finalizeEssay(id, { grade, feedback }),
    onSuccess: (_, { id }) => {
      // Refresh the specific essay details
      queryClient.invalidateQueries({ queryKey: ['essay', id] });
      // Also refresh any mentor and student listings to avoid stale "Corrigir" actions
      queryClient.invalidateQueries({ queryKey: ['mentor-essays'] });
      queryClient.invalidateQueries({ queryKey: ['student-essays'] });
    },
  });
}
