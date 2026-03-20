export type Category = {
  slug: string
  name: string
  description: string
  icon: string
}

export const categories: Category[] = [
  {
    slug: 'giay-in',
    name: 'Giấy In',
    description: 'Giấy in A4 các loại, chính hãng, giá sỉ',
    icon: '📄',
  },
  {
    slug: 'bia-decal',
    name: 'Bìa & Decal',
    description: 'Bìa Thái, giấy decal các màu',
    icon: '🗂️',
  },
  {
    slug: 'tap-vo',
    name: 'Tập Vở',
    description: 'Tập vở học sinh các định lượng',
    icon: '📓',
  },
  {
    slug: 'nhua-ep',
    name: 'Nhựa Ép & Laminating',
    description: 'Nhựa ép dẻo 80 mic A4/A3/A5',
    icon: '🗃️',
  },
  {
    slug: 'van-phong-pham',
    name: 'Văn Phòng Phẩm',
    description: 'Thiên Long, kẹp bướm, bút bi',
    icon: '✏️',
  },
]
