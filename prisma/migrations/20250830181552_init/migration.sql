-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mentor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Schedule" (
    "id" SERIAL NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Appointment" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MentorSubjects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MentorSubjects_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_scheduleId_studentId_key" ON "public"."Appointment"("scheduleId", "studentId");

-- CreateIndex
CREATE INDEX "_MentorSubjects_B_index" ON "public"."_MentorSubjects"("B");

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "public"."Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "public"."Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MentorSubjects" ADD CONSTRAINT "_MentorSubjects_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MentorSubjects" ADD CONSTRAINT "_MentorSubjects_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
