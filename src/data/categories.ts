export type Branch = 'van-phong-pham' | 'hang-thai-lan'

export type Category = {
  slug: string
  name: string
  description: string
  icon: string
  branch: Branch
}

// ─────────────────────────────────────────────
// NHÁNH 1: VĂN PHÒNG PHẨM
// CT Tân Vy Phát – Chuyên Phân Phối Giấy In & VPP Giá Sỉ
// ─────────────────────────────────────────────
export const categoriesVPP: Category[] = [
  {
    slug: 'giay-in',
    name: 'Giấy In',
    description: 'Giấy in A4 chính hãng, giá sỉ tận kho – Double A, Supreme, Projecta, Idea Max, Paper One',
    icon: '📄',
    branch: 'van-phong-pham',
  },
  {
    slug: 'bia-decal',
    name: 'Bìa & Decal',
    description: 'Bìa Thái các màu, giấy decal xanh/vàng/da bò, bìa lá PP Holder',
    icon: '🗂️',
    branch: 'van-phong-pham',
  },
  {
    slug: 'nhua-ep',
    name: 'Nhựa Ép & Laminating',
    description: 'Nhựa ép dẻo 80 mic A4/A3/A5 – trong suốt, chuẩn kích thước',
    icon: '🗃️',
    branch: 'van-phong-pham',
  },
  {
    slug: 'tap-vo',
    name: 'Tập Vở',
    description: 'Tập vở học sinh các định lượng, giá sỉ cho nhà sách và trường học',
    icon: '📓',
    branch: 'van-phong-pham',
  },
  {
    slug: 'van-phong-pham',
    name: 'Văn Phòng Phẩm',
    description: 'Thiên Long, kẹp bướm Echo, bút bi, ghim bấm – chiết khấu cao, có VAT',
    icon: '✏️',
    branch: 'van-phong-pham',
  },
]

// ─────────────────────────────────────────────
// NHÁNH 2: HÀNG TIÊU DÙNG THÁI LAN
// LanVy Shop – Hàng Nhập Khẩu Chính Ngạch, Thuế VAT Đầy Đủ
// ─────────────────────────────────────────────
export const categoriesThai: Category[] = [
  {
    slug: 'nuoc-giat',
    name: 'Nước Giặt',
    description: 'Hygiene, Haby, Mẹ Chọn, PAO, Essence, FineLine – đậm đặc, thơm lâu',
    icon: '🧺',
    branch: 'hang-thai-lan',
  },
  {
    slug: 'nuoc-xa-vai',
    name: 'Nước Xả Vải',
    description: 'Hygiene, Haby Ultra Wash – đậm đặc, mềm mại, thơm lâu',
    icon: '🫧',
    branch: 'hang-thai-lan',
  },
  {
    slug: 've-sinh-nha-cua',
    name: 'Vệ Sinh Nhà Cửa',
    description: 'Nước lau sàn Hygiene 3D, XCleen – thơm như nước hoa, an toàn cho gia đình',
    icon: '🏠',
    branch: 'hang-thai-lan',
  },
  {
    slug: 'cham-soc-ca-nhan',
    name: 'Chăm Sóc Cá Nhân',
    description: 'Kem đánh răng Fresh & White, sữa tắm Amoré – nhập khẩu Thái Lan',
    icon: '🧴',
    branch: 'hang-thai-lan',
  },
  {
    slug: 'san-pham-cho-be',
    name: 'Sản Phẩm Cho Bé',
    description: 'D-nee Organic, kem đánh răng Kodomo – dịu nhẹ, an toàn cho bé',
    icon: '👶',
    branch: 'hang-thai-lan',
  },
  {
    slug: 'huong-thom',
    name: 'Hương Thơm',
    description: 'Túi thơm Hygiene, xịt phòng & sáp thơm Aumira – thơm dịu kéo dài',
    icon: '🌸',
    branch: 'hang-thai-lan',
  },
  {
    slug: 'thuc-pham-do-uong',
    name: 'Thực Phẩm & Đồ Uống',
    description: 'Sương sáo lon và thực phẩm nhập khẩu Thái Lan chính ngạch',
    icon: '🥤',
    branch: 'hang-thai-lan',
  },
]

// Tất cả categories gộp lại
export const categories: Category[] = [...categoriesVPP, ...categoriesThai]
