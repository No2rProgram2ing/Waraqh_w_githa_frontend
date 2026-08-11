import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/Warqah & Jitha Logo.png";
import loginImg from "../assets/images/LoginImage.png";


const EMAIL_PATTERN = new RegExp("^[^@ ]+@[^@ ]+[.][^@ ]+$");
const PHONE_PATTERN = new RegExp("^[+]?[0-9]{8,14}$");

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedIdentifier = identifier.trim();
    let nextIdentifierError = "";
    let nextPasswordError = "";

    if (!trimmedIdentifier) {
      nextIdentifierError = "هذا الحقل مطلوب";
    } else if (
      !EMAIL_PATTERN.test(trimmedIdentifier) &&
      !PHONE_PATTERN.test(trimmedIdentifier)
    ) {
      nextIdentifierError = "يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح";
    }

    if (!password) {
      nextPasswordError = "هذا الحقل مطلوب";
    } else if (password.length < 6) {
      nextPasswordError = "كلمة المرور يجب أن تتكون من 6 أحرف على الأقل";
    }

    setIdentifierError(nextIdentifierError);
    setPasswordError(nextPasswordError);
  };

  return (
    <div dir="rtl" className="flex h-screen w-full flex-col overflow-hidden bg-brand-cream md:flex-row">
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 md:px-20">
        <div className="flex w-full max-w-110 flex-col items-stretch gap-7.75">
          <div className="flex flex-col items-center">
            <img
              src={logo}
              alt="شعار ورقة وجذع"
              className="h-32 w-32 object-contain"
            />
            <div className="flex flex-col items-center gap-2 pt-4">
              <h1 className="text-center font-serif text-3xl font-bold leading-[1.3] text-brand-green sm:text-4xl">
                أهلاً بعودتك
              </h1>
              <p className="text-center font-serif text-base leading-relaxed text-brand-text">
                سجل دخولك لتجربة استثنائية مع الحرف اليدوية
              </p>
            </div>
          </div>

          <form className="flex flex-col items-stretch gap-6" noValidate onSubmit={handleSubmit}>
            <div className="flex flex-col items-stretch gap-1">
              <label
                htmlFor="identifier"
                className="pb-[2px] text-right font-serif text-[13px] font-medium tracking-[0.26px] text-brand-text"
              >
                البريد الإلكتروني أو رقم الهاتف
              </label>
              <input
                id="identifier"
                type="text"
                placeholder="example@email.com"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (identifierError) setIdentifierError("");
                }}
                aria-invalid={identifierError ? true : undefined}
                aria-describedby={identifierError ? "identifier-error" : undefined}
                className={`h-12 rounded-xl border bg-white px-4 py-3 text-right font-sans text-base text-gray-500 placeholder:text-gray-500 focus:outline-none focus:ring-2 ${identifierError ? "border-red-400 focus:ring-red-300" : "border-brand-border focus:ring-brand-green/40"}`}
              />
              {identifierError && (
                <p id="identifier-error" className="text-right font-serif text-[13px] text-red-600">
                  {identifierError}
                </p>
              )}
            </div>

            <div className="flex flex-col items-stretch gap-1">
              <label
                htmlFor="password"
                className="pb-0.5 text-right font-serif text-[13px] font-medium tracking-[0.26px] text-brand-text"
              >
                كلمة المرور
              </label>
              <div className="relative flex items-stretch">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  aria-invalid={passwordError ? true : undefined}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  className={`h-12 w-full rounded-xl border bg-white py-3 pl-12 pr-4 text-right font-sans text-base text-gray-500 placeholder:text-gray-500 focus:outline-none focus:ring-2 ${passwordError ? "border-red-400 focus:ring-red-300" : "border-brand-border focus:ring-brand-green/40"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="absolute inset-y-0 left-0 flex items-center px-3 text-brand-text"
                >
                  <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 12C12.25 12 13.3125 11.5625 14.1875 10.6875C15.0625 9.8125 15.5 8.75 15.5 7.5C15.5 6.25 15.0625 5.1875 14.1875 4.3125C13.3125 3.4375 12.25 3 11 3C9.75 3 8.6875 3.4375 7.8125 4.3125C6.9375 5.1875 6.5 6.25 6.5 7.5C6.5 8.75 6.9375 9.8125 7.8125 10.6875C8.6875 11.5625 9.75 12 11 12ZM11 10.2C10.25 10.2 9.6125 9.9375 9.0875 9.4125C8.5625 8.8875 8.3 8.25 8.3 7.5C8.3 6.75 8.5625 6.1125 9.0875 5.5875C9.6125 5.0625 10.25 4.8 11 4.8C11.75 4.8 12.3875 5.0625 12.9125 5.5875C13.4375 6.1125 13.7 6.75 13.7 7.5C13.7 8.25 13.4375 8.8875 12.9125 9.4125C12.3875 9.9375 11.75 10.2 11 10.2ZM11 15C8.56667 15 6.35 14.3208 4.35 12.9625C2.35 11.6042 0.9 9.78333 0 7.5C0.9 5.21667 2.35 3.39583 4.35 2.0375C6.35 0.679167 8.56667 0 11 0C13.4333 0 15.65 0.679167 17.65 2.0375C19.65 3.39583 21.1 5.21667 22 7.5C21.1 9.78333 19.65 11.6042 17.65 12.9625C15.65 14.3208 13.4333 15 11 15ZM11 13C12.8833 13 14.6125 12.5042 16.1875 11.5125C17.7625 10.5208 18.9667 9.18333 19.8 7.5C18.9667 5.81667 17.7625 4.47917 16.1875 3.4875C14.6125 2.49583 12.8833 2 11 2C9.11667 2 7.3875 2.49583 5.8125 3.4875C4.2375 4.47917 3.03333 5.81667 2.2 7.5C3.03333 9.18333 4.2375 10.5208 5.8125 11.5125C7.3875 12.5042 9.11667 13 11 13Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="text-right font-serif text-[13px] text-red-600">
                  {passwordError}
                </p>
              )}
              <div className="flex justify-start pt-1">
                <Link
                  to="/forgot-password"
                  className="font-serif text-[13px] font-medium tracking-[0.26px] text-brand-brown underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="flex h-12.25 items-center justify-center rounded-xl bg-brand-green font-serif text-[22px] font-semibold leading-[1.4] text-white shadow-sm transition-colors hover:bg-brand-green/90"
            >
              تسجيل الدخول
            </button>
          </form>

          <div className="flex justify-center gap-2 pt-1">
            <span className="font-serif text-base text-brand-text">
              ليس لديك حساب؟{" "}
            </span>
            <Link
              to="/signup"
              className="font-serif text-base font-bold text-brand-green"
            >
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden min-h-105 flex-1 overflow-hidden md:block">
        <img
          src={loginImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(240,237,233,0.20)_0%,rgba(107,122,79,0.40)_100%)] mix-blend-multiply" />
        <div className="absolute inset-0 bg-[rgba(107,122,79,0.20)]" />
        <div className="absolute bottom-10 left-8 right-8 flex max-w-md flex-col items-end gap-1 text-right opacity-80 lg:bottom-16 lg:left-16">
          <h2 className="font-marhey text-xl font-semibold leading-[1.4] text-white sm:text-2xl">
            حرفة تتوارثها الأجيال
          </h2>
          <p className="font-serif text-base leading-relaxed text-white/70">
            نجمع بين الأصالة والحداثة في كل قطعة نصنعها.
          </p>
        </div>
      </div>
    </div>
  );
}
