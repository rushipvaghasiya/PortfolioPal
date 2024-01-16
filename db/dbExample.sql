CREATE SEQUENCE u_id;

CREATE TABLE users(
    "userId" INT primary KEY default nextval('u_id'),
    "userName" TEXT NOT NULL,
    "userEmail" TEXT UNIQUE NOT NULL,
    "userPassword" TEXT UNIQUE NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpireAt" TIMESTAMP 
);
CREATE INDEX IF NOT EXISTS "userEmail" ON users("userEmail");


CREATE SEQUENCE s_id;
CREATE TABLE stocks(
    "stockId" INT primary KEY default nextval('s_id'),
    "userId" INTEGER NOT NULL,
    symbol TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    price INTEGER NOT NULL,
    open INTEGER NOT NULL,
    high INTEGER NOT NULL,
    low INTEGER NOT NULL,
    "createAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES users("userId")
);
CREATE INDEX IF NOT EXISTS "symbol" ON stocks("symbol");

CREATE SEQUENCE t_id;
CREATE TABLE triggers(
    "triggerId" INT primary KEY default nextval('t_id'),
    "stockId" INTEGER UNIQUE NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "alertPrice" INTEGER NOT NULL,
     FOREIGN KEY ("stockId") REFERENCES stocks("stockId")
);
