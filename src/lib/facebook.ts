import { createHmac } from 'crypto'

const GRAPH_URL = 'https://graph.facebook.com/v21.0'

function getToken() {
  const token = process.env.FB_PAGE_ACCESS_TOKEN
  if (!token) throw new Error('Missing FB_PAGE_ACCESS_TOKEN')
  return token
}

export function verifySignature(rawBody: string, signatureHeader: string): boolean {
  const secret = process.env.FB_APP_SECRET
  if (!secret) return false
  const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex')
  return expected === signatureHeader
}

export async function sendPrivateReply(commentId: string, message: object): Promise<void> {
  const res = await fetch(`${GRAPH_URL}/${commentId}/private_replies?access_token=${getToken()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error('sendPrivateReply error:', err)
  }
}

export async function sendMessage(psid: string, message: object): Promise<void> {
  const res = await fetch(`${GRAPH_URL}/me/messages?access_token=${getToken()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient: { id: psid }, ...message }),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error('sendMessage error:', err)
  }
}

export function buildProductReplyMessage(product: {
  id: number
  name: string
  price: number | null
  stock: number
}) {
  const price = product.price ? product.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'
  return {
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: `🛍️ ${product.name}\n💰 Giá: ${price}\n📦 Còn hàng: ${product.stock} sản phẩm\n\nNhấn để thêm vào giỏ hàng:`,
          buttons: [
            {
              type: 'postback',
              title: 'Thêm vào giỏ hàng',
              payload: `ADD_TO_CART:${product.id}`,
            },
          ],
        },
      },
    },
  }
}

export function buildCheckoutLinkMessage(
  product: { name: string; price: number | null },
  token: string,
  quantity: number = 1
) {
  const price = product.price ? product.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'
  const total = product.price ? (product.price * quantity).toLocaleString('vi-VN') + 'đ' : 'Liên hệ'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tanvyphat.com'
  return {
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: `✅ Đã thêm vào giỏ hàng!\n\n🛍️ ${product.name} x ${quantity}\n💰 Giá: ${price}\n💵 Tổng: ${total}\n\nNhấn để điền thông tin giao hàng:`,
          buttons: [
            {
              type: 'web_url',
              url: `${siteUrl}/dat-hang/${token}`,
              title: 'Đặt hàng ngay',
              webview_height_ratio: 'full',
            },
          ],
        },
      },
    },
  }
}
