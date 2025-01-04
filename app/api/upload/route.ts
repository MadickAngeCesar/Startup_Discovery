import { writeClient } from '@/sanity/lib/write-client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create a unique asset document in Sanity
    const asset = await writeClient.assets.upload('image', file);

    return NextResponse.json({ 
      url: asset.url,
      assetId: asset._id 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}
