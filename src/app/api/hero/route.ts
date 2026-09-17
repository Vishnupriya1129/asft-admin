import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const hero = await prisma.hero.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        imageUrl: body.imageUrl,
        isActive: body.isActive,
      }
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Hero',
        entityId: hero.id,
        userId: session.user.id,
        details: `Created hero: ${hero.title}`
      }
    });

    return NextResponse.json(hero, { status: 201 });
  } catch (error) {
    console.error('Error creating hero:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const heroes = await prisma.hero.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(heroes);
  } catch (error) {
    console.error('Error fetching heroes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}