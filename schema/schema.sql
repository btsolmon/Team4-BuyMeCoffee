CREATE TABLE "Profile" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255),
    "about" TEXT,
    "avatarImage" VARCHAR(255),
    "socialMediaURL" VARCHAR(255),
    "backgroundImage" VARCHAR(255),
    "successMessage" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) UNIQUE NOT NULL,
    "profileId" INT UNIQUE, -- Нэг хэрэглэгч нэг профильтай байна (1:1)
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "fk_user_profile" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL
);
CREATE TABLE "BankCard" (
    "id" SERIAL PRIMARY KEY,
    "country" VARCHAR(100),
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "cardNumber" VARCHAR(50) NOT NULL,
    "expiryDate" DATE NOT NULL,
    "userId" INT UNIQUE, -- Нэг хэрэглэгч нэг карт холбосон байна (1:1 эсвэл 1:M хамаарал)
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "fk_bankcard_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE TABLE "Donation" (
    "id" SERIAL PRIMARY KEY,
    "amount" INT NOT NULL,
    "specialMessage" TEXT,
    "socialURLOrBuyMeACoffee" VARCHAR(255),
    "donorId" INT,      -- Хандив өгөгч (Хэрэглэгч)
    "recipientId" INT,  -- Хандив хүлээн авагч (Хэрэглэгч)
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "fk_donation_donor" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE SET NULL,
    CONSTRAINT "fk_donation_recipient" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL
);