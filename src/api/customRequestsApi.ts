export type RequestStatus = "completed" | "in_progress" | "pending_review";

export interface CustomRequestItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status: RequestStatus;
  statusText: string;
  imageUrl?: string;
  artisanName?: string;
  artisanInitials?: string;
  artisanAvatar?: string;
  detailsStatusText?: string;
}

export interface CreateCustomRequestInput {
  title: string;
  description: string;
  woodType?: string;
  dimensions?: string;
  budget?: string;
}

// Initial mock data matching Figma Screen 2
const mockCustomRequests: CustomRequestItem[] = [
  {
    id: "req-1",
    title: 'لوحة جدارية "جذع"',
    description: "عمل فني جداري ضخم مكون من ثلاث قطع يعبر عن تداخل الطبيعة والحرفية.",
    date: "28 أبريل 2024",
    status: "completed",
    statusText: "مكتمل",
    detailsStatusText: "تم التسليم بنجاح عرض التفاصيل",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "req-2",
    title: "طاولة قهوة بنقوش يمنية",
    description: "خشب السدر الطبيعي مع تطعيم بالراتان | القطر 80 سم مع قواعد منحوتة.",
    date: "12 مايو 2024",
    status: "in_progress",
    statusText: "قيد التنفيذ",
    detailsStatusText: "عرض التفاصيل",
    imageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80",
    artisanName: "عبدالله العبدلي",
    artisanInitials: "ع",
  },
  {
    id: "req-3",
    title: "صندوق مجوهرات ملكي",
    description: "مواصفات خاصة: خشب جوز مع قفل نحاسي عتيق وبطانة مخملية زيتية.",
    date: "05 يونيو 2024",
    status: "pending_review",
    statusText: "بانتظار المراجعة",
    detailsStatusText: "بانتظار المراجعة عرض التفاصيل",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
  },
];

export const customRequestsApi = {
  getCustomRequests: async (): Promise<CustomRequestItem[]> => {
    await new Promise((res) => setTimeout(res, 350));
    return [...mockCustomRequests];
  },

  createCustomRequest: async (input: CreateCustomRequestInput): Promise<CustomRequestItem> => {
    await new Promise((res) => setTimeout(res, 650));
    
    const todayFormatted = new Date().toLocaleDateString("ar-EG", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const newRequest: CustomRequestItem = {
      id: `req-${Date.now()}`,
      title: input.title,
      description: input.description,
      date: todayFormatted,
      status: "pending_review",
      statusText: "بانتظار المراجعة",
      detailsStatusText: "بانتظار المراجعة عرض التفاصيل",
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    };

    mockCustomRequests.unshift(newRequest);
    return newRequest;
  },
};
