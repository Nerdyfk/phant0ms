-- CreateTable
CREATE TABLE "Whitelist" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "discord" TEXT,
    "twitter" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Whitelist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_wallet_key" ON "Whitelist"("wallet");
