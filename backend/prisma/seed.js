import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(' Starting database seed...');

  try {
    // Create categories first
    console.log(' Creating categories...');
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Pizza' },
        update: {},
        create: { 
          name: 'Pizza', 
          description: 'Delicious wood-fired pizzas' 
        }
      }),
      prisma.category.upsert({
        where: { name: 'Pasta' },
        update: {},
        create: { 
          name: 'Pasta', 
          description: 'Fresh homemade pasta dishes' 
        }
      }),
      prisma.category.upsert({
        where: { name: 'Salads' },
        update: {},
        create: { 
          name: 'Salads', 
          description: 'Fresh and healthy salads' 
        }
      }),
      prisma.category.upsert({
        where: { name: 'Beverages' },
        update: {},
        create: { 
          name: 'Beverages', 
          description: 'Refreshing drinks and beverages' 
        }
      }),
      prisma.category.upsert({
        where: { name: 'Desserts' },
        update: {},
        create: { 
          name: 'Desserts', 
          description: 'Sweet treats and desserts' 
        }
      })
    ]);

    console.log(` Created ${categories.length} categories`);

    // Create users
    console.log(' Creating users...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 12);
    const hashedManagerPassword = await bcrypt.hash('manager123', 12);
    const hashedStaffPassword = await bcrypt.hash('staff123', 12);

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@restaurant.com' },
      update: {},
      create: {
        name: 'Restaurant Admin',
        email: 'admin@restaurant.com',
        password: hashedAdminPassword,
        role: 'ADMIN'
      }
    });

    const managerUser = await prisma.user.upsert({
      where: { email: 'manager@restaurant.com' },
      update: {},
      create: {
        name: 'Restaurant Manager',
        email: 'manager@restaurant.com',
        password: hashedManagerPassword,
        role: 'MANAGER'
      }
    });

    const staffUser = await prisma.user.upsert({
      where: { email: 'staff@restaurant.com' },
      update: {},
      create: {
        name: 'Restaurant Staff',
        email: 'staff@restaurant.com',
        password: hashedStaffPassword,
        role: 'STAFF'
      }
    });

    console.log(' Created 3 users (Admin, Manager, Staff)');

    // Create menu items - Using findFirst and create instead of upsert
    console.log(' Creating menu items...');
    
    const menuItems = [
      {
        name: 'Margherita Pizza',
        description: 'Fresh tomatoes, mozzarella, basil, olive oil',
        price: 12.99,
        categoryId: categories.find(c => c.name === 'Pizza').id,
        available: true
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Pepperoni, mozzarella, tomato sauce',
        price: 15.99,
        categoryId: categories.find(c => c.name === 'Pizza').id,
        available: true
      },
      {
        name: 'Supreme Pizza',
        description: 'Pepperoni, sausage, peppers, onions, mushrooms',
        price: 18.99,
        categoryId: categories.find(c => c.name === 'Pizza').id,
        available: true
      },
      {
        name: 'Spaghetti Carbonara',
        description: 'Eggs, cheese, pancetta, black pepper',
        price: 14.99,
        categoryId: categories.find(c => c.name === 'Pasta').id,
        available: true
      },
      {
        name: 'Fettuccine Alfredo',
        description: 'Creamy parmesan sauce with fettuccine pasta',
        price: 13.99,
        categoryId: categories.find(c => c.name === 'Pasta').id,
        available: true
      },
      {
        name: 'Penne Arrabbiata',
        description: 'Spicy tomato sauce with garlic and chili',
        price: 12.99,
        categoryId: categories.find(c => c.name === 'Pasta').id,
        available: true
      },
      {
        name: 'Caesar Salad',
        description: 'Romaine lettuce, croutons, parmesan, caesar dressing',
        price: 9.99,
        categoryId: categories.find(c => c.name === 'Salads').id,
        available: true
      },
      {
        name: 'Greek Salad',
        description: 'Mixed greens, feta, olives, tomatoes, cucumber',
        price: 11.99,
        categoryId: categories.find(c => c.name === 'Salads').id,
        available: true
      },
      {
        name: 'Coca Cola',
        description: 'Classic refreshing cola',
        price: 2.99,
        categoryId: categories.find(c => c.name === 'Beverages').id,
        available: true
      },
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        price: 4.99,
        categoryId: categories.find(c => c.name === 'Beverages').id,
        available: true
      },
      {
        name: 'Sparkling Water',
        description: 'Refreshing sparkling mineral water',
        price: 3.99,
        categoryId: categories.find(c => c.name === 'Beverages').id,
        available: true
      },
      {
        name: 'Tiramisu',
        description: 'Classic Italian coffee-flavored dessert',
        price: 7.99,
        categoryId: categories.find(c => c.name === 'Desserts').id,
        available: true
      },
      {
        name: 'Chocolate Brownie',
        description: 'Rich chocolate brownie with vanilla ice cream',
        price: 6.99,
        categoryId: categories.find(c => c.name === 'Desserts').id,
        available: true
      }
    ];

    // Create menu items one by one with error handling
    let createdMenuItems = 0;
    for (const item of menuItems) {
      try {
        // Check if item already exists
        const existingItem = await prisma.menuItem.findFirst({
          where: { 
            name: item.name,
            categoryId: item.categoryId 
          }
        });

        if (!existingItem) {
          await prisma.menuItem.create({
            data: item
          });
          createdMenuItems++;
        }
      } catch (error) {
        console.log(`  Skipped menu item: ${item.name} (already exists or error)`);
      }
    }

    console.log(` Created ${createdMenuItems} menu items`);

    // Create tables
    console.log('🪑 Creating tables...');
    const tables = [
      { number: 1, seats: 2, status: 'Free' },
      { number: 2, seats: 4, status: 'Free' },
      { number: 3, seats: 6, status: 'Free' },
      { number: 4, seats: 2, status: 'Free' },
      { number: 5, seats: 8, status: 'Free' },
      { number: 6, seats: 4, status: 'Free' },
      { number: 7, seats: 4, status: 'Free' },
      { number: 8, seats: 6, status: 'Free' },
      { number: 9, seats: 2, status: 'Free' },
      { number: 10, seats: 10, status: 'Free' }
    ];

    let createdTables = 0;
    for (const table of tables) {
      try {
        const existingTable = await prisma.table.findFirst({
          where: { number: table.number }
        });

        if (!existingTable) {
          await prisma.table.create({
            data: table
          });
          createdTables++;
        }
      } catch (error) {
        console.log(`  Skipped table: ${table.number} (already exists)`);
      }
    }

    console.log(` Created ${createdTables} tables`);

    // Create a sample order (optional)
    console.log(' Creating sample order...');
    try {
      const sampleMenuItem = await prisma.menuItem.findFirst({
        where: { available: true }
      });
      
      const sampleTable = await prisma.table.findFirst({
        where: { status: 'Free' }
      });

      if (sampleMenuItem && sampleTable) {
        const existingOrder = await prisma.order.findFirst({
          where: { 
            userId: staffUser.id,
            tableId: sampleTable.id 
          }
        });

        if (!existingOrder) {
          const sampleOrder = await prisma.order.create({
            data: {
              userId: staffUser.id,
              tableId: sampleTable.id,
              total: sampleMenuItem.price * 2,
              status: 'pending',
              orderType: 'PLACE'
            }
          });

          // Create order items
          await prisma.orderItem.create({
            data: {
              orderId: sampleOrder.id,
              menuItemId: sampleMenuItem.id,
              quantity: 2,
              price: sampleMenuItem.price
            }
          });

          console.log(' Created sample order with order items');
        }
      }
    } catch (error) {
      console.log('  Sample order creation skipped (data may already exist)');
    }

    console.log('\n Database seeded successfully!');
    console.log('\n Test Users Created:');
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│ Role    │ Email                    │ Password    │');
    console.log('├─────────────────────────────────────────────────────┤');
    console.log('│ Admin   │ admin@restaurant.com     │ admin123    │');
    console.log('│ Manager │ manager@restaurant.com   │ manager123  │');
    console.log('│ Staff   │ staff@restaurant.com     │ staff123    │');
    console.log('└─────────────────────────────────────────────────────┘');
    console.log('\n You can now start the server with: npm run dev');
    console.log(' API Documentation: http://localhost:3000/api-docs');

  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });