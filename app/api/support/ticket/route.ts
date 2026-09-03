import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function GET() {
  try {
    const tickets = db.getTickets();
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

    const ticket = db.addTicket({
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
      message: 'Support ticket submitted successfully. Our team will contact you shortly.',
      ticket
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
