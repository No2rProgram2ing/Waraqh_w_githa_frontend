import { motion } from "framer-motion";
import { ArrowLeft, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { ROUTES } from "@/routes/paths";

const values = [
  {
    title: "الأصالة المستدامة",
    text: "نستخدم خامات طبيعية ونحتفي بالحرفة المحلية لنحافظ على أثر الأرض.",
    icon: Leaf,
  },
  {
    title: "الإبداع اليدوي",
    text: "كل قطعة تحمل لمسة صانعها وتجمع بين التراث وروح البيت المعاصر.",
    icon: Sparkles,
  },
  {
    title: "الجودة الفاخرة",
    text: "نختار التفاصيل بعناية لتصل إليك قطعة جميلة، متينة، ومليئة بالمعنى.",
    icon: ShieldCheck,
  },
];

const craftSteps = [
  {
    number: "01",
    title: "الحصاد والتهيئة",
    text: "نبدأ من خامات طبيعية مختارة ونجهزها لتصبح قابلة للحياة من جديد.",
    image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=900&q=85",
  },
  {
    number: "02",
    title: "الغزل والنسج",
    text: "تتحول الخامة بين يدي الحرفي إلى نقش متوازن يحفظ روح المكان.",
    image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=900&q=85",
  },
  {
    number: "03",
    title: "التشكيل الخشبي",
    text: "نصقل كل حافة ونراجع كل تفصيلة حتى تصل القطعة بالشكل الذي تستحقه.",
    image: "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=900&q=85",
  },
];

const artisans = [
  { name: "أحمد اليماني", role: "صانع الخشب", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85" },
  { name: "فاطمة جابر", role: "حارفة النسيج", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=85" },
  { name: "يحيى صالح", role: "صانع السلال", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=85" },
  { name: "سعيد المطري", role: "حرفي الأثاث", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=85" },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8 text-center">
      <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-[#8b7652]">{eyebrow}</p>
      <h2 className="text-2xl font-bold text-[#52663c] sm:text-3xl">{title}</h2>
      <span className="mx-auto mt-3 block h-0.5 w-10 bg-[#c79645]" />
    </div>
  );
}

function AboutPage() {
  return (
    <CatalogLayout>
      <main dir="rtl" className="overflow-hidden bg-[#fbf8f2] text-[#26291f]">
        <section className="relative flex min-h-[500px] items-center justify-center px-5 py-24 text-center text-white sm:min-h-[600px]">
          <img src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=2000&q=88" alt="حرفي يعمل على قطعة يدوية" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#251f17]/55" />
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-2xl">
            <p className="mb-4 text-xs font-bold tracking-[0.2em] text-[#e7ce9e]">حكاية تشبهنا</p>
            <h1 className="text-4xl font-bold leading-[1.35] sm:text-6xl">حكاية تُنسج بصبر... ورقة وجذع</h1>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-white/85 sm:text-base">نحن لا نصنع مجرد أثاث، نحن نعيد صياغة العلاقة بين الأرض والإنسان من خلال فن الخوص والحرفة الأصيلة.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to={ROUTES.products} className="inline-flex items-center gap-2 rounded-sm bg-[#52663c] px-6 py-3 text-sm font-bold transition hover:bg-[#667d4d]">اكتشف مجموعتنا <ArrowLeft className="size-4" /></Link>
              <a href="#story" className="rounded-sm border border-white/70 px-6 py-3 text-sm font-bold transition hover:bg-white/10">تعرف علينا</a>
            </div>
          </motion.div>
          <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] text-white/75"><span className="h-8 w-px bg-white/60" />اكتشف الحكاية</div>
        </section>

        <motion.section id="story" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div className="relative mx-auto max-w-md">
            <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85" alt="كرسي من الخوص في ورشة حرفية" loading="lazy" className="aspect-[0.82] w-full rounded-[18px] object-cover" />
            <span className="absolute -bottom-4 -right-4 -z-0 h-24 w-24 rounded-br-[18px] border-b-8 border-r-8 border-[#d9c59d]" />
          </div>
          <div className="relative z-10">
            <p className="mb-3 text-xs font-bold text-[#8b7652]">البداية</p>
            <h2 className="text-3xl font-bold leading-relaxed text-[#52663c] sm:text-4xl">جذور ممتدة في تراب اليمن</h2>
            <p className="mt-5 text-sm leading-8 text-[#5e6258]">بدأت حكايتنا من إيمان بسيط: كل بيت يستحق قطعة تحمل روحاً. جمعنا بين جمال الخامة الطبيعية ودقة التصميم لنقدم أثاثاً وقطعاً منزلية تحترم الذاكرة وتناسب الحياة اليومية.</p>
            <p className="mt-4 text-sm leading-8 text-[#5e6258]">نحن نعمل مع حرفيين يعرفون قيمة الوقت والصبر، ونمنح أعمالهم مساحة تصل منها الحكاية إلى منزلك بكل دفئها.</p>
            <blockquote className="mt-6 border-r-4 border-[#c79645] pr-4 text-base font-bold leading-8 text-[#52663c]">نؤمن أن الجمال يكمن في القصة المعمّقة، وفي أثر اليد لا في تفاصيلها فقط.</blockquote>
          </div>
        </motion.section>

        <section className="bg-[#f1ede5] px-5 py-16"><div className="mx-auto max-w-6xl"><SectionTitle eyebrow="ما نؤمن به" title="قيمنا الجوهرية" /><div className="grid gap-4 md:grid-cols-3">{values.map(({ title, text, icon: Icon }) => <motion.article key={title} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ y: -4 }} className="border border-[#e3ddd3] bg-[#fbf9f5] p-7 text-center"><span className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-[#e6eddc] text-[#52663c]"><Icon className="size-5" /></span><h3 className="text-lg font-bold text-[#4f613b]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#77766d]">{text}</p></motion.article>)}</div></div></section>

        <motion.section variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mx-auto max-w-7xl px-5 py-20 lg:px-10"><div className="flex items-end justify-between border-b border-[#e5dfd4] pb-4"><div><p className="mb-1 text-[10px] font-bold tracking-[0.16em] text-[#8b7652]">من الخامة إلى البيت</p><h2 className="text-2xl font-bold text-[#52663c]">رحلة الصناعة</h2></div><div className="hidden gap-2 text-[#52663c] sm:flex"><span className="flex size-8 items-center justify-center rounded-full border border-[#d9d1c4]">‹</span><span className="flex size-8 items-center justify-center rounded-full border border-[#d9d1c4]">›</span></div></div><div className="mt-8 grid gap-5 md:grid-cols-3">{craftSteps.map((step) => <article key={step.number} className="group"><div className="relative overflow-hidden rounded-[12px]"><img src={step.image} alt={step.title} loading="lazy" className="aspect-[1.35] w-full object-cover transition duration-700 group-hover:scale-105" /><span className="absolute right-3 top-3 rounded-full bg-[#f8f3e8]/90 px-3 py-1 text-xs font-bold text-[#52663c]">{step.number}</span></div><h3 className="mt-4 text-lg font-bold text-[#52663c]">{step.title}</h3><p className="mt-2 text-sm leading-7 text-[#77766d]">{step.text}</p></article>)}</div></motion.section>

        <section className="bg-[#52663c] px-5 py-20 text-center text-white"><Leaf className="mx-auto mb-4 size-8" /><h2 className="text-3xl font-bold sm:text-4xl">جذورنا في الأرض، وفلسفتنا في الاستدامة</h2><span className="mx-auto mt-7 block h-px w-14 bg-[#d9c59d]" /><p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-white/80">نصنع بمسؤولية، نختار خاماتنا بعناية، ونعمل على إبقاء الحرفة حية لتستمر قصصها مع الأجيال القادمة.</p></section>

        <motion.section variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mx-auto max-w-7xl px-5 py-20 lg:px-10"><div className="flex items-end justify-between"><div><p className="mb-2 text-[10px] font-bold tracking-[0.16em] text-[#8b7652]">من يصنع الجمال</p><h2 className="text-2xl font-bold text-[#52663c] sm:text-3xl">نخبة الحرفيين</h2></div><span className="hidden border-b border-[#52663c] pb-1 text-xs font-bold text-[#52663c] sm:block">تعرف على جميع القصص</span></div><div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">{artisans.map((artisan) => <article key={artisan.name} className="group"><div className="overflow-hidden rounded-[8px]"><img src={artisan.image} alt={artisan.name} loading="lazy" className="aspect-[0.82] w-full object-cover grayscale-[15%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0" /></div><h3 className="mt-3 font-bold text-[#52663c]">{artisan.name}</h3><p className="mt-1 text-xs text-[#77766d]">{artisan.role}</p></article>)}</div></motion.section>

        <section className="bg-[#f1e5d7] px-5 py-12 text-center"><h2 className="text-2xl font-bold text-[#52663c]">قطعة تحمل حكاية؟</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#77766d]">ابدأ قصتك معنا واكتشف تفاصيل صنعت لتبقى.</p><Link to={ROUTES.customRequests} className="mt-6 inline-flex items-center gap-2 rounded-sm bg-[#795238] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#5f3e2b]">اطلب تصميمك الخاص <ArrowLeft className="size-4" /></Link></section>
      </main>
    </CatalogLayout>
  );
}

export { AboutPage };
