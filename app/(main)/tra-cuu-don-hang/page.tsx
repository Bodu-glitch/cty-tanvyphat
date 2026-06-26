import { Metadata } from "next";
import TraCuuClient from "./TraCuuClient";

// Tối ưu SEO chuẩn Marketing cho Sếp Duck
export const metadata: Metadata = {
  title: "Tra Cứu Đơn Hàng | Tân Vỹ Phát",
  description: "Dễ dàng theo dõi tiến trình và tra cứu trạng thái đơn hàng của bạn mọi lúc, mọi nơi tại hệ thống Tân Vỹ Phát.",
};

export default function TraCuuPage() {
  return <TraCuuClient />;
}