-- Add reset token fields to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP(3);

-- Create unique index on resetToken
CREATE UNIQUE INDEX IF NOT EXISTS "User_resetToken_key" ON "User"("resetToken");

-- Create index on resetToken
CREATE INDEX IF NOT EXISTS "User_resetToken_idx" ON "User"("resetToken");
