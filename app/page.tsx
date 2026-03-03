import Image from "next/image";
import Link from 'next/link';
import { ArrowUpRight, Calendar, Users, Utensils, MapPin, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7] text-[#1c1c1c] font-sans pb-4 selection:bg-[#1c1c1c] selection:text-white">
      <nav className="flex-shrink-0 flex items-center justify-between px-6 lg:px-12 max-w-[1600px] w-full mx-auto">
        {/* Generated Vennly Logo */}
        <div className="flex-shrink-0 flex items-center justify-center gap-2 cursor-pointer group">
          <Image
            src="/vennly_logo.png"
            alt="Vennly Logo"
            width={200}
            height={200}
            className="w-20 h-20 object-contain mix-blend-multiply group-hover:opacity-80 transition-opacity"
            priority
          />
        </div>

        <div className="hidden md:flex gap-12 text-[12px] font-bold tracking-[0.1em] text-[#808080]">
          <Link href="/" className="text-[#1c1c1c] transition-colors">HJEM</Link>
          <Link href="/calendar" className="hover:text-[#1c1c1c] transition-colors">KALENDER</Link>
        </div>
      </nav>

      <main className="my-auto max-w-[1600px] w-full mx-auto px-6 lg:px-12 py-8 lg:py-4 grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-x-12 xl:gap-x-24 gap-y-12 lg:gap-y-4">
        {/* Left Column */}
        <div className="flex flex-col justify-start h-full lg:pr-4">

          {/* Quick social proof / stats */}
          <div className="flex pt-2 items-center gap-6 pb-6 hidden lg:flex">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-[#faf9f7] object-cover" alt="User" />
              <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-2 border-[#faf9f7] object-cover" alt="User" />
              <img src="https://i.pravatar.cc/100?img=3" className="w-10 h-10 rounded-full border-2 border-[#faf9f7] object-cover" alt="User" />
              <div className="w-10 h-10 rounded-full border-2 border-[#faf9f7] bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                +40
              </div>
            </div>
            <div className="text-sm">
              <span className="font-bold flex items-center gap-1">5.0 <Sparkles size={14} className="text-amber-500 fill-amber-500" /></span>
              <span className="text-gray-500">fra tidligere gjester</span>
            </div>
          </div>

          <h1 className="text-[4.5rem] sm:text-[6rem] lg:text-[4.5rem] lg:leading-[0.95] xl:text-[4.5rem] font-bold leading-[0.92] tracking-[-0.04em] text-[#1c1c1c]">
            Vennly.<br />
            Finn ditt<br />
            vennlige ly
          </h1>

          <p className="mt-4 xl:mt-6 text-[1.05rem] xl:text-[1.1rem] text-gray-500 font-medium max-w-[28rem] leading-relaxed">
            Vi skaper de perfekte rammene for ditt neste store øyeblikk. Et sjarmerende og fullt utstyrt lokale som gir deg friheten til å skreddersy drømmefesten.
          </p>

          <div className="mt-8 xl:mt-8 flex flex-col sm:flex-row items-center gap-4 w-full">
            <Link href="/calendar" className="w-full sm:w-auto bg-[#1c1c1c] text-white px-8 py-4 rounded-full text-[15px] font-semibold hover:bg-black transition-transform active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-black/5">
              Sjekk tilgjengelighet <Calendar size={18} />
            </Link>
            <button className="w-full sm:w-auto bg-white text-[#1c1c1c] border border-gray-200 px-8 py-4 rounded-full text-[15px] font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center">
              Se priser
            </button>
          </div>


        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 h-full">
          {/* Main Hero Card */}
          <div className="relative w-full h-full flex-1 rounded-[2.5rem] overflow-hidden group min-h-[400px] lg:min-h-0 shadow-sm border border-black/5">
            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
              alt="Bryllupsbord"
              className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60"></div>

            <div className="absolute top-10 left-10 flex flex-wrap gap-2 max-w-[80%]">
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-5 py-2 rounded-full text-[13px] font-semibold tracking-wide">
                BRYLLUP
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-5 py-2 rounded-full text-[13px] font-semibold tracking-wide">
                KONFIRMASJON
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-5 py-2 rounded-full text-[13px] font-semibold tracking-wide">
                DÅP
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-5 py-2 rounded-full text-[13px] font-semibold tracking-wide">
                KONFERANSE
              </span>
            </div>

            <h2 className="absolute bottom-10 left-10 text-white text-3xl sm:text-4xl lg:text-[2.0rem] xl:text-[2.5rem] font-semibold leading-[1.1] tracking-tight max-w-[24rem]">
              Det perfekte valget for selskaper og events
            </h2>

            <button className="absolute bottom-10 right-10 bg-white text-[#1c1c1c] w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
              <ArrowUpRight size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
