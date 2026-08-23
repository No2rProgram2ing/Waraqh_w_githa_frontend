import { useState } from "react";
import type { FormEvent } from "react";
import { MailIcon, PhoneIcon, MapPinIcon, TwitterIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Toast } from "@/components/ui/Toast";
import logo from "@/assets/images/Warqah & Jitha Logo.png";

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
    <footer className="border-t border-[#CFC6B7] bg-[#E9E5DC] pb-8 pt-16 text-[#25291F]">
      <Toast
        isVisible={toastVisible}
        message="شكرًا لاشتراكك في النشرة البريدية لورقة وجذع!"
        onClose={() => setToastVisible(false)}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-[#CFC6B7] pb-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          
          {/* Column 1: Brand Story & Logo */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="شعار ورقة وجذع" className="h-12 w-12 object-contain" />
              <span className="font-display text-2xl font-extrabold text-[#20251B]">ورقة وجذع</span>
            </div>
            <p className="mt-2 text-[15px] leading-8 text-[#3E4338]">
              نحن نعيد صياغة التراث اليمني في قوالب مودرن فاخرة، لنحتفي بالحرفة اليدوية في كل زاوية من منزلك.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#C9BEAD] bg-[#F8F5EE] p-3 text-[#25291F] shadow-sm transition-all hover:scale-105 hover:text-[#536A3A]"
                title="تويتر"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#C9BEAD] bg-[#F8F5EE] p-3 text-[#25291F] shadow-sm transition-all hover:scale-105 hover:text-[#536A3A]"
                title="إنستغرام"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Policies */}
            <div>
            <h4 className="mb-4 font-display text-lg font-extrabold text-[#20251B]">سياساتنا</h4>
            <ul className="flex flex-col gap-3 text-[15px] text-[#3E4338]">
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
            <h4 className="mb-4 font-display text-lg font-extrabold text-[#20251B]">تواصل معنا</h4>
            <ul className="flex flex-col gap-3 text-[15px] text-[#3E4338]">
              <li className="flex items-center gap-3">
                <MailIcon className="h-5 w-5 shrink-0 text-[#536A3A]" />
                <a href="mailto:info@warqahjitha.com" className="hover:text-brand-olive-700 transition-colors">
                  info@warqahjitha.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 shrink-0 text-[#536A3A]" />
                <span dir="ltr">+967 7xx xxx xxx</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPinIcon className="h-5 w-5 shrink-0 text-[#536A3A]" />
                <span>صنعاء، اليمن</span>
              </li>
              <li className="flex items-center gap-3">
                <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#218B54]" />
                <a href="https://wa.me/967700000000" target="_blank" rel="noreferrer" className="hover:text-[#218B54] transition-colors">
                  واتساب: +967 700 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <InstagramIcon className="h-5 w-5 shrink-0 text-[#A34D64]" />
                <a href="https://instagram.com/warqahjitha" target="_blank" rel="noreferrer" className="hover:text-[#A34D64] transition-colors">
                  @warqahjitha
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="mb-2 font-display text-lg font-extrabold text-[#20251B]">النشرة البريدية</h4>
            <p className="mb-4 text-sm leading-7 text-[#3E4338]">
              انضم لعالمنا لتصلك آخر أخبار المجموعات الحصرية وقصص الحرفة.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                required
                className="w-full rounded-lg border border-[#C9BEAD] bg-[#F8F5EE] px-4 py-3 text-right text-sm text-[#25291F] shadow-sm focus:border-[#536A3A] focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-[#536A3A] py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#3E522C]"
              >
                اشترك الآن
              </button>
            </form>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-8 text-center text-sm text-[#5B5E54]">
          © 2024 ورقة وجذع. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
