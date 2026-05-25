"use client";

import { useToast } from "@/providers/ToastProvider";
import {
  ArrowRight,
  Clock,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Send,
} from "lucide-react";
import React, { useState } from "react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Studio",
    lines: ["House 23, Road 11, Dhanmondi", "Dhaka-1205, Bangladesh"],
  },
  {
    icon: Phone,
    title: "Call or WhatsApp",
    lines: ["+880 1711-234567", "+880 1811-987654"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["hello@kanso.com.bd", "support@kanso.com.bd"],
  },
  {
    icon: Clock,
    title: "Studio Hours",
    lines: ["Saturday – Thursday: 10am – 8pm", "Friday: Closed (Jumu'ah)"],
  },
];

const faqs = [
  {
    q: "Do you deliver across Bangladesh?",
    a: "Yes! We deliver to all 64 districts of Bangladesh. Dhaka deliveries arrive within 24–48 hours via Pathao and Steadfast. Outside Dhaka typically takes 3–5 business days via Sundarban Courier or SA Paribahan.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept bKash, Nagad, Rocket, credit/debit cards (Visa/MasterCard), and cash on delivery (COD) for orders under ৳5,000.",
  },
  {
    q: "Can I visit the showroom in Dhaka?",
    a: "Absolutely! Our Dhanmondi studio is open Saturday to Thursday, 10am to 8pm. We recommend calling ahead for a private consultation appointment.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently we ship within Bangladesh only. International shipping to UK, USA, and Middle East is planned for Q3 2025.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 7-day hassle-free return for all products in original condition. Call or WhatsApp +880 1711-234567 to initiate a return.",
  },
];

const topics = [
  { icon: Package, label: "Order & Delivery" },
  { icon: MessageSquare, label: "Product Question" },
  { icon: Headphones, label: "After-sales Support" },
  { icon: ArrowRight, label: "Bulk / Corporate Order" },
];

export default function ContactPage() {
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast("Please fill in your name and message", "error");
      return;
    }
    setIsSubmitting(true);
    // Simulate API submission
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    toast("Thank you! We will reply within 24 hours.", "success");
    setForm({ name: "", email: "", phone: "", topic: "", message: "" });
  };

  return (
    <div className="flex flex-col gap-20 font-sans animate-fade-up pb-16">
      {/* 1. Hero */}
      <section className="pt-16 text-center flex flex-col items-center gap-4">
        <span className="text-[10px] tracking-[0.3em] font-bold text-stone-400 uppercase">
          Get In Touch
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal">
          We'd Love to Hear
          <br />
          From You
        </h1>
        <p className="text-stone-500 text-sm font-light leading-relaxed max-w-md">
          Whether you have a product question, need delivery support, or want to
          plan a studio visit in Dhaka — our team is here for you.
        </p>
      </section>

      {/* 2. Contact Info Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {contactInfo.map((info) => {
          const Icon = info.icon;
          return (
            <div
              key={info.title}
              className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border border-charcoal/5 hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-sand flex items-center justify-center text-charcoal">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  {info.title}
                </span>
                {info.lines.map((line) => (
                  <span
                    key={line}
                    className="text-xs font-semibold text-charcoal"
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Main layout: Form + FAQ */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Contact Form (3/5 col) */}
        <div className="lg:col-span-3 glass-panel rounded-3xl p-8 md:p-10 border border-charcoal/5 flex flex-col gap-7">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-serif text-2xl font-light text-charcoal">
              Send Us a Message
            </h2>
            <p className="text-xs text-stone-400 font-light">
              Average reply time: under 2 hours during studio hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Topic selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                Reason for Contact
              </label>
              <div className="grid grid-cols-2 gap-2">
                {topics.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, topic: t.label }))}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        form.topic === t.label
                          ? "border-charcoal bg-charcoal text-sand"
                          : "border-charcoal/10 text-stone-600 hover:border-charcoal/30"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahim Uddin"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  className="bg-sand/40 border border-charcoal/8 rounded-lg px-4 py-3 text-xs font-semibold text-charcoal placeholder-stone-400 focus:outline-none focus:border-charcoal/30 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+880 17XX-XXXXXX"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="bg-sand/40 border border-charcoal/8 rounded-lg px-4 py-3 text-xs font-semibold text-charcoal placeholder-stone-400 focus:outline-none focus:border-charcoal/30 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
                className="bg-sand/40 border border-charcoal/8 rounded-lg px-4 py-3 text-xs font-semibold text-charcoal placeholder-stone-400 focus:outline-none focus:border-charcoal/30 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                Your Message *
              </label>
              <textarea
                rows={5}
                placeholder="Tell us how we can help you..."
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                required
                className="bg-sand/40 border border-charcoal/8 rounded-lg px-4 py-3 text-xs font-semibold text-charcoal placeholder-stone-400 focus:outline-none focus:border-charcoal/30 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-charcoal text-sand px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-60 cursor-pointer active:scale-[0.99] group w-full md:w-auto md:self-start"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>

        {/* FAQs (2/5 col) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Quick Answers
            </span>
            <h2 className="font-serif text-2xl font-light text-charcoal">
              FAQ
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass-panel rounded-xl border border-charcoal/5 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-xs font-bold text-charcoal cursor-pointer hover:bg-sand/30 transition-colors"
                >
                  <span className="pr-4 leading-snug">{faq.q}</span>
                  <span
                    className={`shrink-0 text-lg font-light transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-xs text-stone-500 font-light leading-relaxed border-t border-charcoal/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
                W
              </div>
              <span className="text-xs font-bold text-charcoal uppercase tracking-widest">
                WhatsApp Us
              </span>
            </div>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              For fastest replies, message us directly on WhatsApp — we
              typically respond within 30 minutes during studio hours.
            </p>
            <a
              href="https://wa.me/8801711234567?text=Hello+KANSO%2C+I+have+a+question+about+your+products."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors w-fit"
            >
              Open WhatsApp →
            </a>
          </div>

          {/* Map placeholder */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col gap-3 border border-charcoal/5">
            <div className="flex items-center gap-2 text-charcoal">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Studio Location
              </span>
            </div>
            <div className="w-full h-40 rounded-xl bg-stone-100 overflow-hidden relative">
              <iframe
                title="KANSO Dhaka Studio Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2817!2d90.3742!3d23.7461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDhanmondi%2C+Dhaka!5e0!3m2!1sen!2sbd!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <span className="text-[10px] text-stone-400 font-semibold">
              House 23, Road 11, Dhanmondi, Dhaka-1205
            </span>
          </div>
        </div>
      </section>

      {/* 4. Payment Methods (Bangladesh-specific) */}
      <section className="glass-panel rounded-3xl p-10 flex flex-col gap-6 border border-charcoal/5">
        <div className="text-center flex flex-col gap-2">
          <span className="text-[10px] tracking-[0.25em] font-bold text-stone-400 uppercase">
            Payment & Delivery
          </span>
          <h2 className="font-serif text-2xl font-light text-charcoal">
            We Make It Easy for You
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            {
              name: "bKash",
              color: "bg-pink-50 text-pink-600",
              detail: "Pay via bKash\ninstantly",
            },
            {
              name: "Nagad",
              color: "bg-orange-50 text-orange-600",
              detail: "Nagad wallet\naccepted",
            },
            {
              name: "Cash on\nDelivery",
              color: "bg-emerald-50 text-emerald-600",
              detail: "COD available\nunder ৳5,000",
            },
            {
              name: "Card\nPayment",
              color: "bg-blue-50 text-blue-600",
              detail: "Visa / MasterCard\nsecure checkout",
            },
          ].map((m) => (
            <div
              key={m.name}
              className={`${m.color} rounded-2xl p-5 flex flex-col gap-2 text-center`}
            >
              <span className="font-bold text-sm whitespace-pre-line">
                {m.name}
              </span>
              <span className="text-[10px] font-light whitespace-pre-line opacity-80">
                {m.detail}
              </span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-stone-400 font-light">
          Nationwide delivery via Pathao, Steadfast, Sundarban Courier & SA
          Paribahan. Free delivery on orders above ৳5,000.
        </p>
      </section>
    </div>
  );
}
