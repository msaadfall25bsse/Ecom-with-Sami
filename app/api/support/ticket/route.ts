import { NextRequest, NextResponse } from 'next/server';
import { dbGetTickets, dbAddTicket } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tickets = dbGetTickets();
    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, topic, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'Please fill all required fields' }, { status: 400 });
    }

    const ticket = dbAddTicket({
      id: `tkt_${Date.now()}`,
      name,
      email,
      phone: phone || '',
      topic: topic || 'General Inquiry',
      message,
      status: 'open',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Support ticket submitted successfully to database.',
      ticket
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
