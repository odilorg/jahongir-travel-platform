import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Secret token to prevent unauthorized revalidation
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'jahongir-travel-revalidate-2024';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, type, slug, locale } = body;

    // Validate secret token
    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Invalid secret token' },
        { status: 401 }
      );
    }

    // Revalidate based on type
    switch (type) {
      case 'tour':
        // Revalidate specific tour page for all locales
        if (slug) {
          revalidatePath(`/ru/tours/${slug}`);
          revalidatePath(`/en/tours/${slug}`);
          revalidatePath(`/uz/tours/${slug}`);
        }
        // Also revalidate tour listings
        revalidatePath('/ru/tours');
        revalidatePath('/en/tours');
        revalidatePath('/uz/tours');
        // And home page (featured tours)
        revalidatePath('/ru');
        revalidatePath('/en');
        revalidatePath('/uz');
        break;

      case 'category':
        // Revalidate tour listings (categories shown there)
        revalidatePath('/ru/tours');
        revalidatePath('/en/tours');
        revalidatePath('/uz/tours');
        break;

      case 'blog':
        if (slug) {
          revalidatePath(`/ru/blog/${slug}`);
          revalidatePath(`/en/blog/${slug}`);
          revalidatePath(`/uz/blog/${slug}`);
        }
        revalidatePath('/ru/blog');
        revalidatePath('/en/blog');
        revalidatePath('/uz/blog');
        break;

      case 'all':
        // Nuclear option - revalidate everything
        revalidatePath('/', 'layout');
        break;

      default:
        // If specific path provided, revalidate it
        if (slug) {
          revalidatePath(slug);
        } else {
          return NextResponse.json(
            { success: false, message: 'Invalid revalidation type or missing slug' },
            { status: 400 }
          );
        }
    }

    return NextResponse.json({
      success: true,
      message: `Revalidated ${type}${slug ? `: ${slug}` : ''}`,
      revalidatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { success: false, message: 'Revalidation failed', error: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint for simple cache refresh (with query params)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const type = searchParams.get('type') || 'all';
  const slug = searchParams.get('slug');

  // Validate secret token
  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json(
      { success: false, message: 'Invalid secret token' },
      { status: 401 }
    );
  }

  try {
    switch (type) {
      case 'tour':
        if (slug) {
          revalidatePath(`/ru/tours/${slug}`);
          revalidatePath(`/en/tours/${slug}`);
          revalidatePath(`/uz/tours/${slug}`);
        }
        revalidatePath('/ru/tours');
        revalidatePath('/en/tours');
        revalidatePath('/uz/tours');
        break;

      case 'all':
        revalidatePath('/', 'layout');
        break;

      default:
        revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      success: true,
      message: `Cache cleared for ${type}${slug ? `: ${slug}` : ''}`,
      revalidatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Revalidation failed' },
      { status: 500 }
    );
  }
}
