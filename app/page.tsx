import * as React from 'react';
import { MentorshipCarousel } from '@/components/MentorshipCarousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppointmentScheduler from '@/components/AppointmentScheduler';
import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';

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

          {/* Destaque: Correção de Redação (tema escuro, um único vermelho de destaque) */}
          <div className="mx-auto w-full max-w-3xl">
            <Link href="/redacao" className="block">
              <div className="rounded-2xl border border-border bg-card shadow-md transition-colors">
                <div className="flex flex-col gap-4 p-6 md:p-8 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-xl bg-muted text-foreground/90">
                      <FileText className="h-7 w-7" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                        Correção de Redação
                      </h2>
                      <p className="text-sm md:text-base text-muted-foreground">
                        Envie sua redação e receba feedback detalhado de um mentor.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm md:text-base font-medium text-white transition-colors hover:bg-red-700">
                      Começar agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <AppointmentScheduler />
        </div>
      </main>
    </div>
  );
}
