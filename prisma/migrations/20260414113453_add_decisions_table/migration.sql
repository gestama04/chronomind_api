-- CreateTable
CREATE TABLE "decisions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemText" TEXT NOT NULL,
    "aiResponse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
