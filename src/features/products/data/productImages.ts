import image1 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.18.57 AM.jpeg";
import image2 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.15 AM.jpeg";
import image3 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.16 AM.jpeg";
import image4 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.16 AM (1).jpeg";
import image5 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.17 AM.jpeg";
import image6 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.18 AM.jpeg";
import image7 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.18 AM (1).jpeg";
import image8 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.19 AM.jpeg";
import image9 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.20 AM.jpeg";
import image10 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.21 AM.jpeg";
import image11 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.22 AM.jpeg";
import image12 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.24 AM.jpeg";
import image13 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.24 AM (1).jpeg";

const productImages = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
  image12,
  image13,
];

export function getProductImage(productId: string | number): string {
  const numericId = Number(String(productId).replace(/\D/g, ""));
  const index = Number.isFinite(numericId) && numericId > 0 ? numericId - 1 : 0;
  return productImages[index % productImages.length];
}

export function getProductImageByIndex(index: number): string {
  return productImages[Math.abs(index) % productImages.length];
}
