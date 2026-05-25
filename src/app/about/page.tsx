import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Award, Leaf, Heart, Users, ArrowRight, MapPin, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About KANSO | Our Story — Japandi Luxury from Dhaka, Bangladesh',
  description:
    'Learn about KANSO — a Dhaka-based luxury home lifestyle brand founded on Japandi minimalism, slow living, and premium artisanal craftsmanship.',
};

const milestones = [
  { year: '2019', label: 'Founded in Dhaka, Bangladesh', detail: 'Started as a small workshop in Dhanmondi, inspired by Japanese wabi-sabi and Scandinavian simplicity.' },
  { year: '2021', label: 'First nationwide delivery', detail: 'Expanded deliveries across all 64 districts of Bangladesh through partnerships with Pathao and Steadfast.' },
  { year: '2022', label: '10,000 studio members', detail: 'Reached 10,000 happy customers across Dhaka, Chittagong, Sylhet, and Rajshahi.' },
  { year: '2024', label: 'Artisan Workshop opened', detail: 'Launched our signature ceramics and furniture atelier in Uttara, employing 45+ local artisans.' },
];

const values = [
  {
    icon: Leaf,
    title: 'Sustainable Materials',
    description:
      'We source only certified sustainable teak, bamboo, and volcanic clay from ethically managed producers across South and Southeast Asia.',
  },
  {
    icon: Heart,
    title: 'Made in Bangladesh',
    description:
      'Every KANSO piece is hand-crafted by our team of skilled artisans in Dhaka and Chattogram, ensuring jobs, quality, and local pride.',
  },
  {
    icon: Award,
    title: 'Premium Craftsmanship',
    description:
      'Our quality control follows Japanese omotenashi standards — every piece is individually inspected before it reaches your home.',
  },
  {
    icon: Users,
    title: 'Community First',
    description:
      'We invest 5% of profits into artisan welfare funds, skill development workshops, and design education for underprivileged youth in Dhaka.',
  },
];

const team = [
  { name: 'Farrukh Rahman', role: 'Founder & Creative Director', initials: 'FR', description: 'Studied design in Kyoto. Returned to Dhaka to bring the philosophy of kanso (simplicity) to Bangladeshi homes.' },
  { name: 'Nadia Islam', role: 'Head of Artisan Relations', initials: 'NI', description: 'Leads our 45-person ceramics and woodwork atelier in Uttara. Advocates for fair wages and artisan welfare.' },
  { name: 'Tanvir Hossain', role: 'Lead Product Designer', initials: 'TH', description: 'Formerly with a Stockholm furniture studio. Merges Nordic minimalism with Bangladeshi materiality.' },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-24 font-sans animate-fade-up pb-16">

      {/* 1. Hero Section */}
      <section className="relative pt-16 pb-20 flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
        <span className="text-[10px] tracking-[0.3em] font-bold text-stone-400 uppercase">Our Story</span>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal leading-tight">
          Simplicity, Crafted in<br />
          <span className="text-primary">Dhaka.</span>
        </h1>
        <p className="text-stone-500 text-sm leading-relaxed font-light max-w-xl">
          KANSO was born in a small Dhanmondi workshop in 2019 with one mission: to bring the philosophy of Japanese minimalism and Scandinavian function into everyday Bangladeshi homes. We believe beautiful spaces should not be reserved for the privileged few.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-charcoal text-sand px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors mt-2 group"
        >
          Explore Collection
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>

      {/* 2. Stats band */}
      <section className="glass-panel rounded-3xl py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { value: '10,000+', label: 'Happy Customers' },
          { value: '45+', label: 'Local Artisans Employed' },
          { value: '64', label: 'Districts Delivered To' },
          { value: '5 ★', label: 'Average Review Rating' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1.5">
            <span className="font-serif text-3xl font-light text-charcoal">{stat.value}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* 3. Our Philosophy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-5">
          <span className="text-[10px] tracking-[0.25em] font-bold text-stone-400 uppercase">Philosophy</span>
          <h2 className="font-serif text-3xl font-light text-charcoal leading-snug">
            Wabi-Sabi in Every<br />Corner of Your Home
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed font-light">
            The Japanese concept of <em>kanso</em> — the art of eliminating clutter — is at the heart of everything we design. We believe a space that breathes is a space that heals. Each KANSO piece is designed to introduce stillness, intention, and beauty without excess.
          </p>
          <p className="text-stone-500 text-sm leading-relaxed font-light">
            From our Dhaka atelier to homes across Sylhet, Rajshahi, and Khulna, we are building a community of mindful living in Bangladesh — one considered piece at a time.
          </p>
        </div>
        <div className="glass-panel rounded-3xl p-10 flex flex-col gap-6 border border-charcoal/5">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Star className="w-7 h-7 text-primary" />
          </div>
          <blockquote className="font-serif text-xl font-light text-charcoal leading-relaxed">
            "Kanso is not about having less. It is about making space for what truly matters."
          </blockquote>
          <cite className="text-xs font-bold text-stone-400 uppercase tracking-widest not-italic">
            — Farrukh Rahman, Founder
          </cite>
        </div>
      </section>

      {/* 4. Values Grid */}
      <section className="flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2">
          <span className="text-[10px] tracking-[0.25em] font-bold text-stone-400 uppercase">What Drives Us</span>
          <h2 className="font-serif text-3xl font-light text-charcoal">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div key={val.title} className="glass-panel p-7 rounded-2xl flex flex-col gap-4 border border-charcoal/5 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sand flex items-center justify-center text-charcoal">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">{val.title}</h3>
                <p className="text-xs text-stone-500 font-light leading-relaxed">{val.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Timeline */}
      <section className="flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2">
          <span className="text-[10px] tracking-[0.25em] font-bold text-stone-400 uppercase">Journey</span>
          <h2 className="font-serif text-3xl font-light text-charcoal">How We Grew</h2>
        </div>
        <div className="flex flex-col gap-0">
          {milestones.map((m, i) => (
            <div key={m.year} className={`flex gap-8 items-start ${i < milestones.length - 1 ? 'pb-10 border-l border-charcoal/10 ml-6 pl-8' : 'ml-6 pl-8'}`}>
              <div className="shrink-0 -ml-[calc(2rem+1px)] w-3 h-3 rounded-full bg-primary border-2 border-background mt-1.5" />
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{m.year}</span>
                <h3 className="font-serif text-base font-semibold text-charcoal">{m.label}</h3>
                <p className="text-xs text-stone-500 font-light leading-relaxed">{m.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Team */}
      <section className="flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2">
          <span className="text-[10px] tracking-[0.25em] font-bold text-stone-400 uppercase">The Studio</span>
          <h2 className="font-serif text-3xl font-light text-charcoal">Meet the Team</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.name} className="glass-panel rounded-2xl p-7 flex flex-col gap-4 border border-charcoal/5 text-center items-center">
              <div className="w-16 h-16 rounded-full bg-charcoal text-sand flex items-center justify-center font-bold font-serif text-xl">
                {member.initials}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-serif text-base font-semibold text-charcoal">{member.name}</h3>
                <span className="text-[9px] uppercase tracking-widest font-bold text-primary">{member.role}</span>
              </div>
              <p className="text-xs text-stone-500 font-light leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CTA */}
      <section className="bg-charcoal text-sand rounded-3xl p-12 flex flex-col items-center text-center gap-5">
        <span className="text-[10px] tracking-[0.3em] font-bold text-primary uppercase">Start Your Journey</span>
        <h2 className="font-serif text-3xl font-light">Ready to Transform Your Space?</h2>
        <p className="text-stone-400 text-sm leading-relaxed font-light max-w-md">
          Browse our curated collection of Japandi furniture, ceramics, and lighting — delivered across all of Bangladesh.
        </p>
        <div className="flex gap-3 flex-wrap justify-center mt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary text-charcoal px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition-colors group"
          >
            Shop Now
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-stone-600 text-stone-300 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:border-sand hover:text-sand transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>

    </div>
  );
}
