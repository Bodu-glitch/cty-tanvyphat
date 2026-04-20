/**
 * upload-and-seed.mjs
 * 1. Walk san-pham/[branch]/[brand]/*.jpg
 * 2. Convert JPG → WebP (sharp, quality=80, max 800px)
 * 3. Upload to Supabase Storage bucket "product-images"
 * 4. Insert products into Supabase DB
 *
 * Run from web-ban-hang/ directory:
 *   node scripts/upload-and-seed.mjs
 */

import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join, basename, extname } from 'path'

const SUPABASE_URL = 'https://dsgvnlyubkohjiojjmrm.supabase.co'
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZ3ZubHl1YmtvaGppb2pqbXJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDkzODU5MCwiZXhwIjoyMDkwNTE0NTkwfQ.PphTAd-vYorBWHk_qwqjM2Fl7KCKakIJzl2-Cr3tZKw'
const BUCKET      = 'product-images'
const SAN_PHAM    = '../san-pham'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ── Folder → category slug mapping ──────────────────────────────────────────
const CATEGORY_MAP = {
  'giay-in/Supreme':          'supreme',
  'giay-in/Idea':             'idea',
  'giay-in/Delight':          'delight',
  'giay-in/Projecta Optima':  'projecta-optima',
  'giay-in/Double':           'double-a',
  'giay-in/Paper One':        'paper-one',
  'giay-in/Quality':          'quality',
  'giay-in/Tổng Hợp':         'giay-in-khac',
  'van-phong-pham/Thiên long': 'thien-long',
  'van-phong-pham/Gold':      'gold',
  'van-phong-pham/Plus':      'plus',
  'van-phong-pham/Double A':  'double-a-vpp',
  'van-phong-pham/Tổng hợp':  'vpp-khac',
  'hang-thai-lan/Bột giặt':   'bot-giat',
  'hang-thai-lan/Nước giặt':  'nuoc-giat',
  'hang-thai-lan/Nước lau sàn': 've-sinh-nha-cua',
  'hang-thai-lan/Nước rửa chén': 'nuoc-rua-chen',
  'hang-thai-lan/Sáp thơm':   'sap-thom',
  'hang-thai-lan/Thức uống':  'thuc-uong',
  'hang-thai-lan/Tổng Hợp':   've-sinh-nha-cua',
}

// ── Vietnamese slug ──────────────────────────────────────────────────────────
function toSlug(str) {
  const map = {
    à:'a',á:'a',ả:'a',ã:'a',ạ:'a',
    ă:'a',ắ:'a',ặ:'a',ằ:'a',ẳ:'a',ẵ:'a',
    â:'a',ấ:'a',ầ:'a',ẩ:'a',ẫ:'a',ậ:'a',
    đ:'d',
    è:'e',é:'e',ẻ:'e',ẽ:'e',ẹ:'e',
    ê:'e',ế:'e',ề:'e',ể:'e',ễ:'e',ệ:'e',
    ì:'i',í:'i',ỉ:'i',ĩ:'i',ị:'i',
    ò:'o',ó:'o',ỏ:'o',õ:'o',ọ:'o',
    ô:'o',ố:'o',ồ:'o',ổ:'o',ỗ:'o',ộ:'o',
    ơ:'o',ớ:'o',ờ:'o',ở:'o',ỡ:'o',ợ:'o',
    ù:'u',ú:'u',ủ:'u',ũ:'u',ụ:'u',
    ư:'u',ứ:'u',ừ:'u',ử:'u',ữ:'u',ự:'u',
    ỳ:'y',ý:'y',ỷ:'y',ỹ:'y',ỵ:'y',
  }
  return str
    .toLowerCase()
    .split('').map(c => map[c] ?? c).join('')
    .replace(/[^a-z0-9\s\-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ── Upload one image, return public URL ──────────────────────────────────────
async function uploadImage(localPath, storagePath) {
  const buf = await sharp(localPath)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buf, {
      contentType: 'image/webp',
      upsert: true,
    })
  if (error) throw new Error(`Upload ${storagePath}: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

// ── Walk folders and collect product groups ──────────────────────────────────
function collectProducts() {
  const products = []
  const branches = readdirSync(SAN_PHAM).filter(
    b => statSync(join(SAN_PHAM, b)).isDirectory()
  )

  for (const branch of branches) {
    const brands = readdirSync(join(SAN_PHAM, branch)).filter(
      d => statSync(join(SAN_PHAM, branch, d)).isDirectory()
    )
    for (const brand of brands) {
      const folderKey = `${branch}/${brand}`
      const category = CATEGORY_MAP[folderKey]
      if (!category) {
        console.warn(`⚠  No category mapping for: ${folderKey}`)
        continue
      }

      const files = readdirSync(join(SAN_PHAM, branch, brand))
        .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
        .sort()

      // Group by base product name (strip _1, _2, _3 suffixes)
      const groups = new Map()
      for (const file of files) {
        const ext  = extname(file)
        const base = basename(file, ext).replace(/_\d+$/, '')
        if (!groups.has(base)) groups.set(base, [])
        groups.get(base).push(join(SAN_PHAM, branch, brand, file))
      }

      for (const [name, paths] of groups) {
        products.push({ branch, brand, category, name, paths, folderKey })
      }
    }
  }
  return products
}

// ── Main ─────────────────────────────────────────────────────────────────────
;(async () => {
  const items = collectProducts()
  console.log(`Found ${items.length} products across all branches\n`)

  const rows = []
  let done = 0

  for (const item of items) {
    const { branch, category, name, paths } = item
    const slug = toSlug(name)

    // Upload all images for this product
    const imageUrls = []
    for (let i = 0; i < paths.length; i++) {
      const storagePath = `${branch}/${category}/${slug}${i === 0 ? '' : `_${i}`}.webp`
      try {
        const url = await uploadImage(paths[i], storagePath)
        imageUrls.push(url)
      } catch (e) {
        console.error(`  ✗ ${e.message}`)
      }
    }

    rows.push({
      slug,
      name,
      category,
      description: '',
      images: imageUrls,
      featured: false,
      price: null,
      stock: 0,
      keyword: null,
      fb_post_url: null,
    })

    done++
    process.stdout.write(`\r[${done}/${items.length}] ${name.slice(0, 50)}...`)
  }

  console.log('\n\nInserting products into DB...')

  // Insert in batches of 50
  const BATCH = 50
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase.from('products').insert(batch)
    if (error) {
      console.error(`Insert error (batch ${i / BATCH + 1}): ${error.message}`)
      // Try inserting one by one to identify duplicates
      for (const row of batch) {
        const { error: e2 } = await supabase.from('products').insert(row)
        if (e2) console.error(`  ✗ ${row.slug}: ${e2.message}`)
        else console.log(`  ✓ ${row.slug}`)
      }
    }
  }

  console.log(`\n✅ Done! Seeded ${rows.length} products.`)
})()
