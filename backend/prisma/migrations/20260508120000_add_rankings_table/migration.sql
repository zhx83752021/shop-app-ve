-- CreateEnum
CREATE TYPE "RankingType" AS ENUM ('HOT', 'RATING', 'NEW', 'FAVORITE');

-- CreateEnum
CREATE TYPE "TrendType" AS ENUM ('UP', 'DOWN', 'UNCHANGED');

-- CreateTable
CREATE TABLE "rankings" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "RankingType" NOT NULL,
    "rank" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "trend" "TrendType" NOT NULL DEFAULT 'UNCHANGED',
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rankings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rankings_productId_type_key" ON "rankings"("productId", "type");

-- CreateIndex
CREATE INDEX "rankings_type_rank_idx" ON "rankings"("type", "rank");

-- AddForeignKey
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
