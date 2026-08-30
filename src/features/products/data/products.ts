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
  { id: "p-1", name: "مصباح السعف الطبيعي", type: "إضاءة يدوية", subtitle: "إضاءة دافئة صنعت من خامات طبيعية", description: "مصباح يدوي من السعف الطبيعي، يضيف ضوءًا دافئًا وتفاصيل تراثية هادئة إلى أي مساحة.", image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=88", price: 390 },
  { id: "p-2", name: "طقم سلال ورقصة", type: "حرفة منزلية", subtitle: "تفاصيل عملية بروح يدوية", description: "طقم سلال طبيعي متعدد الاستخدامات، يجمع بين التنظيم وجمال الحرفة اليمنية.", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=88", price: 520 },
  { id: "p-3", name: "أريكة الخيزران", type: "أثاث طبيعي", subtitle: "راحة هادئة بخامة طبيعية", description: "أريكة من الخيزران بتصميم مريح، تمنح منزلك دفء المواد الطبيعية ولمسة معاصرة.", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=88", price: 480 },
  { id: "p-4", name: "سلال من سعف النخيل", type: "حرفة منزلية", subtitle: "من الطبيعة إلى تفاصيل بيتك", description: "سلال من سعف النخيل الطبيعي، مصنوعة يدويًا لتخزين أغراضك وإثراء ديكور منزلك.", image: "https://images.unsplash.com/photo-1599685315640-7b89c1e9d7b8?auto=format&fit=crop&w=900&q=88", price: 180 },
  { id: "p-5", name: "ألوان من جبالنا", type: "إضاءة يدوية", subtitle: "طبيعة يمنية تلهم المكان", description: "تفاصيل مستوحاة من ألوان الجبال والطبيعة اليمنية لتمنح بيتك إحساسًا أصيلًا.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=88", price: 260 },
  { id: "p-6", name: "دفء الخشب", type: "أثاث طبيعي", subtitle: "خامة دافئة تعيش طويلًا", description: "قطعة خشبية طبيعية بتصميم هادئ، صنعت لتنسجم مع تفاصيل منزلك اليومية.", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=88", price: 320 },
];