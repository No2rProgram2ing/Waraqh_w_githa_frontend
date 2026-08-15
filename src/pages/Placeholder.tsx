import { Link } from "react-router-dom";

interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-cream px-6 text-center"
    >
      <h1 className="font-serif text-3xl font-bold text-brand-green">
        {title}
      </h1>
      <p className="max-w-md font-serif text-base text-brand-text">
        هذه الصفحة قيد الإنشاء. أخبرنا بمزيد من التفاصيل حتى نكملها لك.
      </p>
      <Link
        to="/"
        className="font-serif text-sm font-medium text-brand-brown underline"
      >
        العودة إلى صفحة تسجيل الدخول
      </Link>
    </div>
  );
}
