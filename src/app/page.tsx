import Link from "next/link";
import { ArrowRight, CalendarDays, Map, MessageCircle, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDestinationImage } from "@/lib/travel-images";

const stages = [
  { number: "01", label: "Before", title: "Shape the trip", text: "Build a flexible day-by-day plan, map every stop, and decide which moments you might want to share.", icon: CalendarDays },
  { number: "02", label: "During", title: "Travel your way", text: "Stay solo when you want, meet for one activity, and keep the route and conversation in one place.", icon: MessageCircle },
  { number: "03", label: "After", title: "Close the loop", text: "Settle shared costs and carry trusted travel connections into whatever comes next.", icon: Receipt },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
        <div className="relative min-h-[690px] overflow-hidden rounded-[2rem] bg-slate-900">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getDestinationImage("Kyoto, Japan")})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent" />
          <div className="relative flex min-h-[690px] max-w-3xl flex-col justify-end p-7 text-white sm:p-12 lg:p-16">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-200">Solo first · Social when it fits</p>
            <h1 className="font-display mt-5 text-6xl leading-[0.9] sm:text-8xl">Your trip is already worth taking.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/75">Plan the whole journey for yourself. Open a dinner, hike, or travel day to compatible people whenever company would make it better.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link href="/trips/create"><Button size="lg" className="bg-white text-slate-950 shadow-none hover:bg-white/90">Plan a trip<ArrowRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/explore"><Button size="lg" variant="outline" className="border-white/30 bg-black/10 text-white hover:bg-white/15 hover:text-white"><Map className="mr-2 h-4 w-4" />Explore journeys</Button></Link></div>
            <div className="mt-12 flex gap-10 border-t border-white/20 pt-7 text-sm"><div><strong className="font-display block text-3xl">08</strong><span className="text-white/60">journeys</span></div><div><strong className="font-display block text-3xl">09</strong><span className="text-white/60">travelers</span></div><div><strong className="font-display block text-3xl">03</strong><span className="text-white/60">travel stages</span></div></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="grid gap-10 border-b pb-14 lg:grid-cols-[1fr_440px] lg:items-end"><div><p className="eyebrow">One journey, every stage</p><h2 className="font-display mt-3 max-w-3xl text-5xl leading-none sm:text-6xl">A calmer, more human way to travel solo.</h2></div><p className="text-base leading-7 text-muted-foreground">Every social feature stays optional. The itinerary remains useful whether someone joins for an hour, for three days, or not at all.</p></div>
        <div className="grid md:grid-cols-3">
          {stages.map((stage, index) => <article key={stage.label} className={`py-10 md:px-8 ${index > 0 ? "border-t md:border-l md:border-t-0" : ""}`}><div className="flex items-center justify-between"><span className="font-display text-4xl text-teal-800/35">{stage.number}</span><stage.icon className="h-5 w-5 text-teal-700" /></div><p className="eyebrow mt-12">{stage.label}</p><h3 className="font-display mt-2 text-3xl">{stage.title}</h3><p className="mt-4 leading-7 text-muted-foreground">{stage.text}</p></article>)}
        </div>
      </section>
    </div>
  );
}
