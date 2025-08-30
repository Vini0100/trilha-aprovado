import * as React from 'react';
import { MentorshipCarousel } from '@/components/MentorshipCarousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppointmentScheduler from '@/components/AppointmentScheduler';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Mentoria online</CardTitle>
            </CardHeader>
            <CardContent>
              <MentorshipCarousel />
            </CardContent>
          </Card>

          <AppointmentScheduler />
        </div>
      </main>
    </div>
  );
}
