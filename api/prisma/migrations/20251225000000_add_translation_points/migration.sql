-- CreateTable
CREATE TABLE IF NOT EXISTS "ChapterTranslation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterSlug" TEXT NOT NULL,
    "translatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pointsEarned" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "ChapterTranslation_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "translationPoints" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ChapterTranslation_userId_idx" ON "ChapterTranslation"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ChapterTranslation_translatedAt_idx" ON "ChapterTranslation"("translatedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ChapterTranslation_userId_chapterSlug_key" ON "ChapterTranslation"("userId", "chapterSlug");

-- AddForeignKey
ALTER TABLE "ChapterTranslation" ADD CONSTRAINT IF NOT EXISTS "ChapterTranslation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
