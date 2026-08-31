import productImage1 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.18.57 AM.jpeg";
import productImage2 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.15 AM.jpeg";
import productImage3 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.16 AM.jpeg";
import productImage4 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.16 AM (1).jpeg";
import productImage5 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.17 AM.jpeg";
import productImage6 from "@/assets/images/WhatsApp Image 2026-08-31 at 6.19.18 AM.jpeg";

export interface CatalogProduct {
  id: string;
  name: string;
  type: string;
  subtitle: string;
  description: string;
  image: string;
  price: number;
}

export const catalogProducts: CatalogProduct[] = [
  { id: "p-1", name: "مصباح السعف الطبيعي", type: "إضاءة يدوية", subtitle: "إضاءة دافئة صنعت من خامات طبيعية", description: "مصباح يدوي من السعف الطبيعي، يضيف ضوءًا دافئًا وتفاصيل تراثية هادئة إلى أي مساحة.", image: productImage1, price: 390 },
  { id: "p-2", name: "طقم سلال ورقصة", type: "حرفة منزلية", subtitle: "تفاصيل عملية بروح يدوية", description: "طقم سلال طبيعي متعدد الاستخدامات، يجمع بين التنظيم وجمال الحرفة اليمنية.", image: productImage2, price: 520 },
  { id: "p-3", name: "أريكة الخيزران", type: "أثاث طبيعي", subtitle: "راحة هادئة بخامة طبيعية", description: "أريكة من الخيزران بتصميم مريح، تمنح منزلك دفء المواد الطبيعية ولمسة معاصرة.", image: productImage3, price: 480 },
  { id: "p-4", name: "سلال من سعف النخيل", type: "حرفة منزلية", subtitle: "من الطبيعة إلى تفاصيل بيتك", description: "سلال من سعف النخيل الطبيعي، مصنوعة يدويًا لتخزين أغراضك وإثراء ديكور منزلك.", image: productImage4, price: 180 },
  { id: "p-5", name: "ألوان من جبالنا", type: "إضاءة يدوية", subtitle: "طبيعة يمنية تلهم المكان", description: "تفاصيل مستوحاة من ألوان الجبال والطبيعة اليمنية لتمنح بيتك إحساسًا أصيلًا.", image: productImage5, price: 260 },
  { id: "p-6", name: "دفء الخشب", type: "أثاث طبيعي", subtitle: "خامة دافئة تعيش طويلًا", description: "قطعة خشبية طبيعية بتصميم هادئ، صنعت لتنسجم مع تفاصيل منزلك اليومية.", image: productImage6, price: 320 },
];