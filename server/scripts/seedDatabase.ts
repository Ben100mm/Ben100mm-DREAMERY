import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding minimal Partner data...');
  // Create a minimal user and partner profile for demo
  // ensure a role exists
  const role = await prisma.userRole.upsert({
    where: { id: 'demo-role' },
    update: {},
    create: {
      id: 'demo-role',
      name: 'Demo Partner',
      category: {
        create: { name: 'Partners', description: 'Demo', isActive: true } as any,
      } as any,
      isActive: true,
    } as any,
  } as any);

  const user = await prisma.user.upsert({
    where: { email: 'partner@example.com' },
    update: {},
    create: {
      email: 'partner@example.com',
      firstName: 'Demo',
      lastName: 'Partner',
      roleId: role.id,
    },
  } as any);

  await prisma.partnerProfile.upsert({
    where: { userId: user.id },
    update: { company: 'Dreamery Demo Co', bio: 'Demo partner profile', services: ['Consulting'], languages: ['English'] },
    create: {
      userId: user.id,
      company: 'Dreamery Demo Co',
      bio: 'Demo partner profile',
      services: ['Consulting'] as any,
      coverageArea: { type: 'FeatureCollection', features: [] } as any,
      languages: ['English'] as any,
      availability: {},
      licenses: [],
    },
  } as any);

  console.log('Partner seed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });


