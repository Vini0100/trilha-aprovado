'use client';

import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const mentorshipSubjects = [
  {
    id: 1,
    title: 'OAB - Exame da Ordem',
    description: 'Preparação completa para o Exame da OAB com professores especializados',
    color: 'bg-blue-100 border-blue-200',
  },
  {
    id: 2,
    title: 'TCE - Tribunal de Contas',
    description: 'Mentoria para concursos do Tribunal de Contas do Estado',
    color: 'bg-green-100 border-green-200',
  },
  {
    id: 3,
    title: 'Magistratura',
    description: 'Preparação para carreira na magistratura',
    color: 'bg-purple-100 border-purple-200',
  },
  {
    id: 4,
    title: 'Ministério Público',
    description: 'Mentoria para ingresso no Ministério Público',
    color: 'bg-red-100 border-red-200',
  },
  {
    id: 5,
    title: 'Defensoria Pública',
    description: 'Preparação para defensoria pública',
    color: 'bg-yellow-100 border-yellow-200',
  },
  {
    id: 6,
    title: 'Delegacia de Polícia',
    description: 'Mentoria para carreira policial',
    color: 'bg-orange-100 border-orange-200',
  },
];

export function MentorshipCarousel() {
  const autoplayPlugin = Autoplay({
    delay: 1500,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
  });

  return (
    <Carousel opts={{ loop: true }} plugins={[autoplayPlugin]}>
      <CarouselContent>
        {mentorshipSubjects.map(subject => (
          <CarouselItem key={subject.id} className="md:basis-1/2 lg:basis-1/3">
            <Card className={`h-full ${subject.color} border-2`}>
              <CardHeader>
                <CardTitle className="text-lg text-center">{subject.title}</CardTitle>
                <CardDescription className="text-center text-sm">
                  {subject.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
