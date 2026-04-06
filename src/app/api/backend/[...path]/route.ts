import { NextResponse, type NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL ?? "http://localhost:8080";
const MAX_PROXY_BODY_SIZE_BYTES = 1024 * 1024;

async function forwardRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const search = request.nextUrl.search;
  const targetUrl = `${BACKEND_API_BASE_URL}/${path.join("/")}${search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("origin");

  const method = request.method;
  const isBodyMethod = method !== "GET" && method !== "HEAD";
  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (isBodyMethod && contentLength > MAX_PROXY_BODY_SIZE_BYTES) {
    return NextResponse.json(
      {
        statusCode: 413,
        message: "Payload too large.",
      },
      { status: 413 },
    );
  }

  const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.delete("content-length");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      {
        statusCode: 502,
        message: "Could not reach backend service.",
      },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context);
}
