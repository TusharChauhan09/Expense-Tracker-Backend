import { PrismaClient } from '@prisma/client';
export const client = new PrismaClient();

async function main() {
  await client.$connect();
  console.log("Connected successfully!");
}

main().catch((e) => {
  console.error(e);
});
