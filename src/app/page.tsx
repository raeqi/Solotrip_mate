import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, MapPin, Users, Wallet } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center space-y-8 bg-gradient-to-b from-background to-muted/50 overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-20 dark:bg-black dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Travel Solo, <br className="hidden sm:inline" />
          But Never Alone.
        </h1>

        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Find your perfect travel companion, join ad-hoc meals, and split expenses seamlessly.
          The ultimate toolkit for the modern solo traveler.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/explore">
            <Button size="lg" className="h-12 px-8 text-lg gap-2">
              Find a Companion <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
              Create Profile
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto py-24 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything you need for your trip
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            From planning to settlement, we've got you covered.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-muted/50 hover:bg-muted/80 transition-colors">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Find Companions</h3>
            <p className="text-muted-foreground">
              Match with travelers who share your vibe, budget, and interests.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-muted/50 hover:bg-muted/80 transition-colors">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Interactive Maps</h3>
            <p className="text-muted-foreground">
              Discover solo-friendly spots and see where others are hanging out.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-muted/50 hover:bg-muted/80 transition-colors">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <Wallet className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Expense Splitting</h3>
            <p className="text-muted-foreground">
              Easily split bills and settle up after the trip without the awkwardness.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
