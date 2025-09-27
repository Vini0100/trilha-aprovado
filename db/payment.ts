export async function updatePaymentStatusByProviderId(providerId: string, status: string) {
  return prisma.payment.updateMany({
    where: { providerId },
    data: { status },
  });
}

export async function findAppointmentByProviderId(providerId: string) {
  return prisma.appointment.findFirst({
    where: { payment: { providerId } },
    include: { schedule: true },
  });
}

export async function updateAppointmentStatus(appointmentId: number, status: string) {
  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });
}

export async function updateScheduleStatus(scheduleId: number, status: string) {
  return prisma.schedule.update({
    where: { id: scheduleId },
    data: { status },
  });
}
import { prisma } from '@/lib/prisma';

export async function findOrCreatePayment({
  appointmentId,
  amount,
}: {
  appointmentId: number;
  amount: number;
}) {
  let payment = await prisma.payment.findUnique({
    where: { appointmentId },
  });

  if (!payment) {
    payment = await prisma.payment.create({
      data: {
        appointmentId,
        provider: 'mercadopago',
        providerId: `temp-${Date.now()}`,
        status: 'pending',
        amount,
      },
    });
  }

  return payment;
}

export async function updatePaymentProviderId({
  paymentId,
  providerId,
}: {
  paymentId: number;
  providerId: string;
}) {
  return prisma.payment.update({
    where: { id: paymentId },
    data: { providerId },
  });
}
