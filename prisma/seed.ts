/*
const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

function generateGradient(): string {
    const generateHexColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const color1 = generateHexColor();
    const color2 = generateHexColor();
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  }
  
  async function main() {
    // Array of users to seed
    const users = [
      {
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'admin123',
        role: 'ADMIN'
      },
      {
        email: 'manager@example.com',
        name: 'Manager User',
        password: 'manager123',
        role: 'MANAGER'
      },
      {
        email: 'user@example.com',
        name: 'Regular User',
        password: 'user123',
        role: 'USER'
      }
    ];
  
    console.log('Starting seed...');
  
    // Create users
    for (const userData of users) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });
  
      if (!existingUser) {
        const hashedPassword = await hash(userData.password, 10);
        
        const user = await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            password: hashedPassword,
            role: userData.role,
            profileColor: generateGradient()
          }
        });
  
        console.log(`Created user: ${user.email} (${user.role})`);
      } else {
        // Update existing user with profile color if they don't have one
        if (!existingUser.profileColor) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { profileColor: generateGradient() }
          });
          console.log(`Updated existing user: ${existingUser.email} with profile color`);
        } else {
          console.log(`User already exists: ${existingUser.email}`);
        }
      }
    }
  
    console.log('Seed completed successfully!');
  }
  
  main()
    .catch((e) => {
      console.error('Error during seed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
*/