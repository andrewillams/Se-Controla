const { PrismaClient } = require('@prisma/client');

const DATABASE_URL = "postgresql://postgres.pguajzqzdlapiqpanlwm:TkoQgCneOcDN87kQ@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function migrate() {
  try {
    console.log('🔄 Connecting to database...');

    // Test connection
    await prisma.$connect();
    console.log('✅ Connected successfully!');

    // Execute raw SQL to create tables
    console.log('🔄 Creating tables...');

    await prisma.$executeRawUnsafe(`
      -- Create enums
      CREATE TYPE IF NOT EXISTS "HouseholdRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
      CREATE TYPE IF NOT EXISTS "TransactionType" AS ENUM ('INCOME', 'EXPENSE');
      CREATE TYPE IF NOT EXISTS "FrequencyType" AS ENUM ('FIXED', 'VARIABLE', 'SPORADIC');
      CREATE TYPE IF NOT EXISTS "RecurrenceRule" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
    `);

    console.log('✅ Enums created');

    await prisma.$executeRawUnsafe(`
      -- Account table
      CREATE TABLE IF NOT EXISTS "Account" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
      CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");
    `);

    console.log('✅ Account table created');

    await prisma.$executeRawUnsafe(`
      -- Session table
      CREATE TABLE IF NOT EXISTS "Session" (
        "id" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
      CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
    `);

    console.log('✅ Session table created');

    await prisma.$executeRawUnsafe(`
      -- User table
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
    `);

    console.log('✅ User table created');

    await prisma.$executeRawUnsafe(`
      -- VerificationToken table
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
      CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
    `);

    console.log('✅ VerificationToken table created');

    await prisma.$executeRawUnsafe(`
      -- Household table
      CREATE TABLE IF NOT EXISTS "Household" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Household_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log('✅ Household table created');

    await prisma.$executeRawUnsafe(`
      -- HouseholdMember table
      CREATE TABLE IF NOT EXISTS "HouseholdMember" (
        "id" TEXT NOT NULL,
        "householdId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "role" "HouseholdRole" NOT NULL DEFAULT 'MEMBER',
        "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "HouseholdMember_pkey" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "HouseholdMember_householdId_userId_key" ON "HouseholdMember"("householdId", "userId");
      CREATE INDEX IF NOT EXISTS "HouseholdMember_userId_idx" ON "HouseholdMember"("userId");
      CREATE INDEX IF NOT EXISTS "HouseholdMember_householdId_idx" ON "HouseholdMember"("householdId");
    `);

    console.log('✅ HouseholdMember table created');

    await prisma.$executeRawUnsafe(`
      -- Category table
      CREATE TABLE IF NOT EXISTS "Category" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "color" TEXT NOT NULL DEFAULT '#6366f1',
        "icon" TEXT,
        "type" "TransactionType" NOT NULL,
        "householdId" TEXT,
        "userId" TEXT,
        "isDefault" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "Category_householdId_idx" ON "Category"("householdId");
      CREATE INDEX IF NOT EXISTS "Category_userId_idx" ON "Category"("userId");
    `);

    console.log('✅ Category table created');

    await prisma.$executeRawUnsafe(`
      -- Transaction table
      CREATE TABLE IF NOT EXISTS "Transaction" (
        "id" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "amount" DECIMAL(12,2) NOT NULL,
        "type" "TransactionType" NOT NULL,
        "frequency" "FrequencyType" NOT NULL,
        "date" TIMESTAMP(3) NOT NULL,
        "isPaid" BOOLEAN NOT NULL DEFAULT false,
        "notes" TEXT,
        "categoryId" TEXT NOT NULL,
        "householdId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "calendarEventId" TEXT,
        "recurringTransactionId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "Transaction_householdId_idx" ON "Transaction"("householdId");
      CREATE INDEX IF NOT EXISTS "Transaction_userId_idx" ON "Transaction"("userId");
      CREATE INDEX IF NOT EXISTS "Transaction_categoryId_idx" ON "Transaction"("categoryId");
      CREATE INDEX IF NOT EXISTS "Transaction_date_idx" ON "Transaction"("date");
      CREATE INDEX IF NOT EXISTS "Transaction_type_idx" ON "Transaction"("type");
      CREATE INDEX IF NOT EXISTS "Transaction_isPaid_idx" ON "Transaction"("isPaid");
      CREATE INDEX IF NOT EXISTS "Transaction_recurringTransactionId_idx" ON "Transaction"("recurringTransactionId");
    `);

    console.log('✅ Transaction table created');

    await prisma.$executeRawUnsafe(`
      -- RecurringTransaction table
      CREATE TABLE IF NOT EXISTS "RecurringTransaction" (
        "id" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "amount" DECIMAL(12,2) NOT NULL,
        "type" "TransactionType" NOT NULL,
        "frequency" "FrequencyType" NOT NULL DEFAULT 'FIXED',
        "recurrenceRule" "RecurrenceRule" NOT NULL,
        "interval" INTEGER NOT NULL DEFAULT 1,
        "dayOfMonth" INTEGER,
        "dayOfWeek" INTEGER,
        "startDate" TIMESTAMP(3) NOT NULL,
        "endDate" TIMESTAMP(3),
        "categoryId" TEXT NOT NULL,
        "householdId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "lastGenerated" TIMESTAMP(3),
        CONSTRAINT "RecurringTransaction_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "RecurringTransaction_householdId_idx" ON "RecurringTransaction"("householdId");
      CREATE INDEX IF NOT EXISTS "RecurringTransaction_userId_idx" ON "RecurringTransaction"("userId");
      CREATE INDEX IF NOT EXISTS "RecurringTransaction_categoryId_idx" ON "RecurringTransaction"("categoryId");
      CREATE INDEX IF NOT EXISTS "RecurringTransaction_isActive_idx" ON "RecurringTransaction"("isActive");
      CREATE INDEX IF NOT EXISTS "RecurringTransaction_startDate_idx" ON "RecurringTransaction"("startDate");
    `);

    console.log('✅ RecurringTransaction table created');

    console.log('\n🎉 All tables created successfully!');
    console.log('🚀 Your database is ready to use!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
