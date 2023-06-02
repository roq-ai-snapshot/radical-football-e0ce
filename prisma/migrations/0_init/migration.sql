-- CreateTable
CREATE TABLE "academy" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "academy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "player_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "attended" BOOLEAN NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "team_id" UUID NOT NULL,

    CONSTRAINT "coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "date" DATE NOT NULL,
    "team_id" UUID NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "training_program_id" UUID NOT NULL,

    CONSTRAINT "exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "team_id" UUID NOT NULL,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_training_program" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "player_id" UUID NOT NULL,
    "training_program_id" UUID NOT NULL,

    CONSTRAINT "player_training_program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "academy_id" UUID NOT NULL,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_program" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "coach_id" UUID NOT NULL,

    CONSTRAINT "training_program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "roq_user_id" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "academy" ADD CONSTRAINT "academy_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coach" ADD CONSTRAINT "coach_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coach" ADD CONSTRAINT "coach_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_training_program_id_fkey" FOREIGN KEY ("training_program_id") REFERENCES "training_program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "player_training_program" ADD CONSTRAINT "player_training_program_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "player_training_program" ADD CONSTRAINT "player_training_program_training_program_id_fkey" FOREIGN KEY ("training_program_id") REFERENCES "training_program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "academy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_program" ADD CONSTRAINT "training_program_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coach"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

