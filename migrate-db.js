const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.pguajzqzdlapiqpanlwm:TkoQgCneOcDN87kQ@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  try {
    console.log('🔄 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Create enums
    console.log('🔄 Creating enums...');
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "HouseholdRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "FrequencyType" AS ENUM ('FIXED', 'VARIABLE', 'SPORADIC');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "RecurrenceRule" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✅ Enums created\n');

    // Create Account table
    console.log('🔄 Creating Account table...');
    await client.query(`
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

    // Create Session table
    console.log('🔄 Creating Session table...');
    await client.query(`
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

    // Create User table
    console.log('🔄 Creating User table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
    `);
    console.log('✅ User table created');

    // Create VerificationToken table
    console.log('🔄 Creating VerificationToken table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
      CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
    `);
    console.log('✅ VerificationToken table created');

    // Create Household table
    console.log('🔄 Creating Household table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Household" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Household_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ Household table created');

    // Create HouseholdMember table
    console.log('🔄 Creating HouseholdMember table...');
    await client.query(`
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

    // Create Category table
    console.log('🔄 Creating Category table...');
    await client.query(`
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
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "Category_householdId_idx" ON "Category"("householdId");
      CREATE INDEX IF NOT EXISTS "Category_userId_idx" ON "Category"("userId");
    `);
    console.log('✅ Category table created');

    // Create Transaction table
    console.log('🔄 Creating Transaction table...');
    await client.query(`
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
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

    // Create RecurringTransaction table
    console.log('🔄 Creating RecurringTransaction table...');
    await client.query(`
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
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    console.log('\n📊 Total tables created: 9');
    console.log('  - Account');
    console.log('  - Session');
    console.log('  - User');
    console.log('  - VerificationToken');
    console.log('  - Household');
    console.log('  - HouseholdMember');
    console.log('  - Category');
    console.log('  - Transaction');
    console.log('  - RecurringTransaction');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) console.error('Error code:', error.code);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✅ Database connection closed');
  }
}

migrate();
