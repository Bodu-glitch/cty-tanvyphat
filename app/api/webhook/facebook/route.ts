import { NextRequest } from 'next/server'
import {
  verifySignature,
  sendPrivateReply,
  sendMessage,
  buildProductReplyMessage,
  buildCheckoutLinkMessage,
} from '@/src/lib/facebook'
import { getAdminClient } from '@/src/lib/supabase/admin'

// GET: Facebook webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.FB_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

// POST: Handle Facebook webhook events
export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-hub-signature-256') ?? ''

  if (!verifySignature(rawBody, signature)) {
    return new Response('Invalid signature', { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = JSON.parse(rawBody)
  } catch {
    return new Response('Bad Request', { status: 400 })
  }

  // Process asynchronously but respond immediately (Facebook requires < 20s)
  void processWebhookEvent(body)

  return new Response('EVENT_RECEIVED', { status: 200 })
}

async function processWebhookEvent(body: Record<string, unknown>) {
  try {
    const entries = (body.entry as Array<Record<string, unknown>>) ?? []

    for (const entry of entries) {
      // Handle feed changes (comments on posts)
      const changes = (entry.changes as Array<Record<string, unknown>>) ?? []
      for (const change of changes) {
        if (change.field === 'feed') {
          const value = change.value as Record<string, unknown>
          console.log('[webhook] feed value:', JSON.stringify(value))
          if (value.item === 'comment' && value.verb === 'add') {
            await handleCommentEvent(value)
          }
        }
      }

      // Handle messaging events (postbacks)
      const messaging = (entry.messaging as Array<Record<string, unknown>>) ?? []
      for (const event of messaging) {
        const postback = event.postback as Record<string, unknown> | undefined
        if (postback?.payload && typeof postback.payload === 'string') {
          if (postback.payload.startsWith('ADD_TO_CART:')) {
            const sender = event.sender as Record<string, unknown>
            await handlePostbackEvent(sender.id as string, postback.payload)
          }
        }
      }
    }
  } catch (err) {
    console.error('processWebhookEvent error:', err)
  }
}

async function handleCommentEvent(value: Record<string, unknown>) {
  const commentId = value.comment_id as string
  const commentText = ((value.message as string) ?? '').trim().toUpperCase()

  if (!commentText || !commentId) return

  const db = getAdminClient()
  const { data: product } = await db
    .from('products')
    .select('id, name, price, stock')
    .eq('keyword', commentText)
    .gt('stock', 0)
    .single()

  if (!product) return

  await sendPrivateReply(commentId, buildProductReplyMessage(product))
}

async function handlePostbackEvent(psid: string, payload: string) {
  const productId = parseInt(payload.replace('ADD_TO_CART:', ''), 10)
  if (isNaN(productId)) return

  const db = getAdminClient()
  const { data: product } = await db
    .from('products')
    .select('id, name, price, stock')
    .eq('id', productId)
    .single()

  if (!product) return

  if (product.stock <= 0) {
    await sendMessage(psid, {
      message: { text: 'Rất tiếc, sản phẩm này đã hết hàng. Vui lòng liên hệ shop để được hỗ trợ.' },
    })
    return
  }

  // Create cart session
  const { data: session, error } = await db
    .from('cart_sessions')
    .insert({ fb_user_id: psid, product_id: productId, quantity: 1 })
    .select('token')
    .single()

  if (error || !session) {
    console.error('Failed to create cart session:', error)
    return
  }

  await sendMessage(psid, buildCheckoutLinkMessage(product, session.token, 1))
}
