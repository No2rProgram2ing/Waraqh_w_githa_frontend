import { useState } from "react";
import type { FormEvent } from "react";
import { BrandLogoIcon, MailIcon, PhoneIcon, MapPinIcon, TwitterIcon, InstagramIcon } from "@/components/ui/icons";
import { Toast } from "@/components/ui/Toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setToastVisible(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#f0eee6] border-t border-brand-border/80 text-brand-ink pt-16 pb-8">
      <Toast
        isVisible={toastVisible}
        message="شكرًا لاشتراكك في النشرة البريدية لورقة وجذع!"
        onClose={() => setToastVisible(false)}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-brand-border/60">
          
          {/* Column 1: Brand Story & Logo */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <BrandLogoIcon className="h-10 w-10" />
              <span className="text-xl font-bold font-display text-brand-ink">ورقة وجذع</span>
            </div>
            <p className="text-sm leading-relaxed text-brand-ink/80 mt-2">
              نحن نعيد صياغة التراث اليمني في قوالب مودرن فاخرة، لنحتفي بالحرفة اليدوية في كل زاوية من منزلك.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-brand-cream border border-brand-border text-brand-ink hover:text-brand-olive-700 hover:scale-105 transition-all shadow-2xs"
                title="تويتر"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-brand-cream border border-brand-border text-brand-ink hover:text-brand-olive-700 hover:scale-105 transition-all shadow-2xs"
                title="إنستغرام"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Policies */}
          <div>
            <h4 className="text-base font-bold text-brand-ink font-display mb-4">سياساتنا</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-brand-ink/80">
              <li>
                <a href="#privacy" className="hover:text-brand-olive-700 transition-colors">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-brand-olive-700 transition-colors">
                  الشروط والأحكام
                </a>
              </li>
              <li>
                <a href="#refund" className="hover:text-brand-olive-700 transition-colors">
                  سياسة الاسترجاع
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-brand-olive-700 transition-colors">
                  الأسئلة الشائعة
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-base font-bold text-brand-ink font-display mb-4">تواصل معنا</h4>
            <ul className="flex flex-col gap-3 text-sm text-brand-ink/80">
              <li className="flex items-center gap-3">
                <MailIcon className="h-4 w-4 text-brand-olive-700 shrink-0" />
                <a href="mailto:info@warqahjitha.com" className="hover:text-brand-olive-700 transition-colors">
                  info@warqahjitha.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-4 w-4 text-brand-olive-700 shrink-0" />
                <span dir="ltr">+967 7xx xxx xxx</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPinIcon className="h-4 w-4 text-brand-olive-700 shrink-0" />
                <span>صنعاء، اليمن</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-base font-bold text-brand-ink font-display mb-2">النشرة البريدية</h4>
            <p className="text-xs text-brand-muted mb-4">
              انضم لعالمنا لتصلك آخر أخبار المجموعات الحصرية وقصص الحرفة.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                required
                className="w-full rounded-xl border border-brand-border bg-brand-cream px-4 py-3 text-sm text-right focus:outline-none focus:border-brand-olive-600 shadow-2xs"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-brand-olive-700 text-white font-semibold py-3 text-sm hover:bg-brand-olive-900 transition-colors shadow-xs"
              >
                اشترك الآن
              </button>
            </form>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-8 text-center text-xs text-brand-muted">
          © 2024 ورقة وجذع. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
