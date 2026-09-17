import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning existing data...');
  // Since we use Cascade deletes, deleting Users should delete almost everything
  await prisma.user.deleteMany({});
  
  const password = await hash('password123', 10);
  
  console.log('Creating demo accounts...');
  const demoUsers = {
    startup: await prisma.user.create({ data: { name: 'Startup Demo', email: 'startup@demo.starttohkr.com', password, role: 'STARTUP' } }),
    government: await prisma.user.create({ data: { name: 'Gov Demo', email: 'government@demo.starttohkr.com', password, role: 'GOVERNMENT' } }),
    investor: await prisma.user.create({ data: { name: 'Investor Demo', email: 'investor@demo.starttohkr.com', password, role: 'INVESTOR' } }),
    mentor: await prisma.user.create({ data: { name: 'Mentor Demo', email: 'mentor@demo.starttohkr.com', password, role: 'MENTOR' } }),
    industry: await prisma.user.create({ data: { name: 'Industry Demo', email: 'industry@demo.starttohkr.com', password, role: 'INDUSTRY_PARTNER' } }),
    evaluator: await prisma.user.create({ data: { name: 'Evaluator Demo', email: 'evaluator@demo.starttohkr.com', password, role: 'EVALUATOR' } }),
    admin: await prisma.user.create({ data: { name: 'Admin Demo', email: 'admin@demo.starttohkr.com', password, role: 'ADMIN' } }),
  };

  console.log('Creating 15 startup users and profiles...');
  const startups = [];
  const industries = ['Agritech', 'HealthTech', 'Smart Cities', 'WaterTech', 'Clean Energy', 'EdTech', 'Mobility', 'AI', 'Fintech', 'Logistics'];
  const locations = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Ahmedabad'];
  
  for (let i = 1; i <= 15; i++) {
    const industry = industries[i % industries.length];
    const location = locations[i % locations.length];
    
    const user = await prisma.user.create({
      data: {
        name: `Founder ${i}`,
        email: `startup${i}@example.com`,
        password,
        role: 'STARTUP',
        startupProfile: {
          create: {
            name: `Startup ${i} Tech`,
            industry,
            location,
            description: `A promising ${industry} startup solving critical problems in ${location}.`,
            stage: 'MVP',
            technologies: ['React', 'Node.js', 'AI'],
          }
        }
      },
      include: { startupProfile: true }
    });
    startups.push(user);
  }

  // Ensure the demo startup also has a startup profile
  await prisma.startup.create({
    data: {
      ownerId: demoUsers.startup.id,
      name: 'AquaSense AI',
      industry: 'WaterTech',
      location: 'Bangalore',
      description: 'Detecting underground water leaks before millions of liters are wasted.',
      stage: 'PILOT',
      technologies: ['IoT', 'AI', 'Sensors']
    }
  });

  console.log('Creating 20 innovations...');
  const innovations = [];
  const categories = ['Software', 'Hardware', 'IoT', 'Process', 'Material'];
  for (let i = 1; i <= 20; i++) {
    const startup = startups[i % startups.length];
    const innovation = await prisma.innovation.create({
      data: {
        startupId: startup.id,
        title: `Innovation ${i}: Smart ${categories[i % categories.length]} Solution`,
        tagline: `Revolutionizing ${startup.startupProfile?.industry} with cutting edge tech`,
        problem: 'Inefficiency and high costs in traditional methods.',
        solution: 'An AI-driven platform that optimizes resources by 40%.',
        impact: 'Saves 10,000 man-hours annually and reduces carbon footprint.',
        category: categories[i % categories.length],
        stage: 'PROTOTYPE',
        momentumScore: Math.floor(Math.random() * 100),
      }
    });
    innovations.push(innovation);
  }

  console.log('Creating additional roles (10 Investors, Mentors, Evaluators)...');
  const investors = [];
  const evaluators = [];
  for (let i = 1; i <= 10; i++) {
    investors.push(await prisma.user.create({ data: { name: `VC Fund ${i}`, email: `investor${i}@example.com`, password, role: 'INVESTOR' }}));
    evaluators.push(await prisma.user.create({ data: { name: `Prof ${i}`, email: `evaluator${i}@example.com`, password, role: 'EVALUATOR' }}));
    await prisma.user.create({ data: { name: `Expert Mentor ${i}`, email: `mentor${i}@example.com`, password, role: 'MENTOR' }});
  }

  console.log('Creating 10 Government Challenges...');
  const challenges = [];
  const depts = ['Ministry of Jal Shakti', 'Smart City Indore', 'Ministry of Agriculture', 'Department of Health'];
  for (let i = 1; i <= 10; i++) {
    challenges.push(await prisma.challenge.create({
      data: {
        title: `SIH Challenge ${i}: Real-time Monitoring`,
        department: depts[i % depts.length],
        description: 'Looking for a scalable solution for real-time monitoring and analytics in rural areas.',
        category: 'Software',
        budget: '$50,000 Pilot',
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 2)), // 2 months from now
        status: 'OPEN'
      }
    }));
  }

  console.log('Creating Applications and Evaluations...');
  for (let i = 0; i < 5; i++) {
    const app = await prisma.application.create({
      data: {
        challengeId: challenges[i].id,
        startupId: startups[i].startupProfile?.id as string,
        innovationId: innovations[i].id,
        pitch: 'Our AI model perfectly matches this requirement and has been tested in similar environments.',
        status: 'SHORTLISTED'
      }
    });

    await prisma.evaluation.create({
      data: {
        applicationId: app.id,
        evaluatorId: evaluators[i].id,
        scores: { innovation: 8, feasibility: 7, scalability: 9 },
        totalScore: 80,
        feedback: 'Strong technical team but needs clarity on rural deployment logistics.'
      }
    });
  }

  console.log('Creating Pilots...');
  await prisma.pilot.create({
    data: {
      startupId: startups[0].startupProfile?.id as string,
      innovationId: innovations[0].id,
      governmentDept: 'Smart City Indore',
      timeline: '6 Months',
      status: 'ACTIVE',
      tasks: {
        create: [
          { title: 'Site Inspection', status: 'COMPLETED' },
          { title: 'Hardware Installation', status: 'IN_PROGRESS' },
          { title: 'Data Analytics Integration', status: 'TODO' }
        ]
      }
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
