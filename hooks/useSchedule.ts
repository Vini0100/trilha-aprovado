import {
  changeScheduleStatusService,
  createMentorSchedulesService,
  getMentorSchedulesService,
} from '@/services/scheduleService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useMentorSchedules(mentorId: number) {
  return useQuery({
    queryKey: ['mentorSchedules', mentorId],
    queryFn: () => getMentorSchedulesService(mentorId),
    enabled: !!mentorId,
  });
}

export function useCreateSchedules(mentorId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schedules: { day: string; startTime: string; endTime: string }[]) =>
      createMentorSchedulesService(mentorId, schedules),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mentorSchedules', mentorId] }),
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      scheduleId,
      status,
    }: {
      scheduleId: number;
      status: 'available' | 'blocked' | 'removed';
    }) => changeScheduleStatusService(scheduleId, status),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({ queryKey: ['mentorSchedules', variables.scheduleId] }),
  });
}
