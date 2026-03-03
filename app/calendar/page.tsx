'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Info, Check, Sparkles, CreditCard, CalendarDays } from "lucide-react";

// ─── Konfigurasjon ────────────────────────────────────────────────────────────
const BOOKED_DATES = new Set([
    '2026-03-20', '2026-03-21', '2026-03-22',
    '2026-04-10', '2026-04-11',
    '2026-04-25', '2026-04-26',
    '2026-05-15', '2026-05-16', '2026-05-17',
]);

const PRICE_WEEKDAY = 8_500;
const PRICE_WEEKEND = 12_500;
const CLEANING_FEE = 1_500;

const MONTHS_NO = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember',
];
const DOW_LONG = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
const DAY_LABELS = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'];

// ─── Hjelpe­funksjoner ────────────────────────────────────────────────────────
function ymd(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function addDays(s: string, n: number): string {
    const [y, m, d] = s.split('-').map(Number);
    const date = new Date(y, m - 1, d + n);
    return ymd(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(a: string, b: string): number {
    const [ay, am, ad] = a.split('-').map(Number);
    const [by, bm, bd] = b.split('-').map(Number);
    return Math.round(
        (new Date(by, bm - 1, bd).getTime() - new Date(ay, am - 1, ad).getTime()) / 86_400_000
    );
}

function isWeekend(s: string): boolean {
    const [y, m, d] = s.split('-').map(Number);
    const dow = (new Date(y, m - 1, d).getDay() + 6) % 7; // 0=man…6=søn
    return dow >= 5; // lør=5, søn=6
}

function formatDateNO(s: string): string {
    const [y, m, d] = s.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dow = (date.getDay() + 6) % 7;
    return `${DOW_LONG[dow]} ${d}. ${MONTHS_NO[m - 1]}`;
}

function formatNum(n: number): string {
    return n.toLocaleString('nb-NO');
}

function getStartOffset(year: number, month: number): number {
    return (new Date(year, month, 1).getDay() + 6) % 7;
}

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function rangeHasBooked(from: string, to: string): boolean {
    for (let s = from; s <= to; s = addDays(s, 1)) {
        if (BOOKED_DATES.has(s)) return true;
    }
    return false;
}

// ─── Komponent ────────────────────────────────────────────────────────────────
export default function CalendarPage() {
    const now = new Date();
    const todayStr = ymd(now.getFullYear(), now.getMonth(), now.getDate());

    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [hoverDate, setHoverDate] = useState<string | null>(null);
    const [agreed, setAgreed] = useState(false);

    // Månedsnavigasjon
    function prevMonth() {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    }
    function nextMonth() {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    }

    // Klikk-logikk
    function handleDayClick(dateStr: string) {
        if (!startDate || endDate) {
            setStartDate(dateStr);
            setEndDate(null);
        } else if (dateStr < startDate) {
            setStartDate(dateStr);
            setEndDate(null);
        } else if (dateStr === startDate) {
            // Enkeltdagsbestilling
            setEndDate(dateStr);
        } else {
            if (rangeHasBooked(startDate, dateStr)) {
                // Perioden inneholder opptatte dager – start på nytt
                setStartDate(dateStr);
                setEndDate(null);
            } else {
                setEndDate(dateStr);
            }
        }
    }

    function resetSelection() {
        setStartDate(null);
        setEndDate(null);
    }

    // Effektivt sluttdato for visning (hover-forhåndsvisning eller bekreftet)
    const displayEnd = endDate ?? (
        startDate && hoverDate && hoverDate > startDate && !rangeHasBooked(startDate, hoverDate)
            ? hoverDate : null
    );

    // Prisberegning
    const summary = useMemo(() => {
        if (!startDate || !endDate) return null;
        let weekday = 0, weekend = 0;
        for (let s = startDate; s <= endDate; s = addDays(s, 1)) {
            isWeekend(s) ? weekend++ : weekday++;
        }
        const days = weekday + weekend;
        const rental = weekday * PRICE_WEEKDAY + weekend * PRICE_WEEKEND;
        const total = rental + CLEANING_FEE;
        return { days, weekday, weekend, rental, total };
    }, [startDate, endDate]);

    const startOffset = getStartOffset(viewYear, viewMonth);
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);

    const selectionLabel =
        startDate && endDate
            ? `${daysBetween(startDate, endDate) === 0
                ? '1 dag valgt'
                : `${daysBetween(startDate, endDate) + 1} dager valgt`}`
            : startDate
                ? 'Velg sluttdato'
                : 'Klikk for å velge innsjekk';

    return (
        <div className="min-h-screen flex flex-col bg-[#faf9f7] text-[#1c1c1c] font-sans pb-4 selection:bg-[#1c1c1c] selection:text-white">

            {/* Navigasjon */}
            <nav className="flex-shrink-0 flex items-center justify-between px-6 lg:px-12 py-4 max-w-[1600px] w-full mx-auto">
                <Link href="/" className="flex items-center gap-2 group">
                    <Image
                        src="/vennly_logo.png"
                        alt="Vennly Logo"
                        width={200} height={200}
                        className="w-20 h-20 object-contain mix-blend-multiply group-hover:opacity-80 transition-opacity"
                        priority
                    />
                </Link>
                <div className="hidden md:flex gap-12 text-[12px] font-bold tracking-[0.1em] text-[#808080]">
                    <Link href="/" className="hover:text-[#1c1c1c] transition-colors">HJEM</Link>
                    <span className="text-[#1c1c1c]">KALENDER</span>
                </div>
            </nav>

            {/* Hoved­innhold */}
            <main className="my-auto max-w-[1300px] w-full mx-auto px-6 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-x-12 xl:gap-x-20 gap-y-12">

                {/* Venstre – Kalender */}
                <div className="flex flex-col bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-black/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 flex flex-col gap-5">

                        {/* Overskrift + månedsnavigasjon */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Velg periode</h1>
                                <p className="text-gray-500 text-sm mt-0.5">{selectionLabel}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={prevMonth}
                                    className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft size={18} className="text-gray-600" />
                                </button>
                                <span className="text-sm font-semibold w-36 text-center select-none">
                                    {MONTHS_NO[viewMonth]} {viewYear}
                                </span>
                                <button
                                    onClick={nextMonth}
                                    className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronRight size={18} className="text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Ukedags­etiketter */}
                        <div className="grid grid-cols-7 text-center">
                            {DAY_LABELS.map(d => (
                                <div key={d} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider py-1">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Kalender­rutenett */}
                        <div
                            className="grid grid-cols-7 gap-y-0.5"
                            onMouseLeave={() => setHoverDate(null)}
                        >
                            {/* Tomme offset-celler */}
                            {Array.from({ length: startOffset }).map((_, i) => (
                                <div key={`e${i}`} className="h-10" />
                            ))}

                            {/* Dager */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = ymd(viewYear, viewMonth, day);
                                const isPast = dateStr < todayStr;
                                const isBooked = BOOKED_DATES.has(dateStr);
                                const disabled = isPast || isBooked;

                                const isStart = dateStr === startDate;
                                const isRangeEnd =
                                    dateStr === endDate ||
                                    (!endDate && displayEnd !== null && dateStr === displayEnd);
                                const isInRange =
                                    !!(startDate && displayEnd && dateStr > startDate && dateStr < displayEnd);
                                const isToday = dateStr === todayStr;
                                const weekend = isWeekend(dateStr);

                                // Bakgrunn for range-stripe
                                const cellBg =
                                    isStart && displayEnd ? 'bg-gradient-to-r from-transparent to-amber-50/80' :
                                        isRangeEnd ? 'bg-gradient-to-l from-transparent to-amber-50/80' :
                                            isInRange ? 'bg-amber-50/80' : '';

                                // Knapp­stil
                                const btnCls = [
                                    'relative z-10 w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-150 select-none',
                                    isStart || isRangeEnd
                                        ? 'bg-[#1c1c1c] text-white shadow-md scale-105'
                                        : isInRange
                                            ? 'text-[#1c1c1c]'
                                            : isPast
                                                ? 'text-gray-300 cursor-not-allowed'
                                                : isBooked
                                                    ? 'text-gray-300 cursor-not-allowed line-through decoration-gray-200'
                                                    : 'text-[#1c1c1c] hover:bg-gray-100 cursor-pointer',
                                ].join(' ');

                                return (
                                    <div
                                        key={dateStr}
                                        className={`h-10 flex items-center justify-center ${cellBg}`}
                                    >
                                        <button
                                            disabled={disabled}
                                            onClick={() => handleDayClick(dateStr)}
                                            onMouseEnter={() => !disabled && setHoverDate(dateStr)}
                                            className={btnCls}
                                            aria-label={dateStr}
                                            title={isBooked ? 'Opptatt' : undefined}
                                        >
                                            {day}

                                            {/* I-dag-ring */}
                                            {isToday && !isStart && !isRangeEnd && (
                                                <span className="absolute inset-0 rounded-full border-2 border-[#1c1c1c]/30 pointer-events-none" />
                                            )}

                                            {/* Helge­prikk */}
                                            {!disabled && weekend && !isStart && !isRangeEnd && (
                                                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Forklaring */}
                        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full border border-gray-300" />
                                <span className="text-gray-500">Ledig</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <span className="text-gray-500">Helgepris</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-gray-200" />
                                <span className="text-gray-500">Utleid</span>
                            </div>
                            {(startDate) && (
                                <button
                                    onClick={resetSelection}
                                    className="ml-auto text-xs text-gray-400 hover:text-gray-700 underline transition-colors"
                                >
                                    Nullstill valg
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Høyre – Oppsummering */}
                <div className="flex flex-col gap-6 justify-center">

                    {/* Bilde */}
                    <div className="relative w-full h-48 rounded-[2rem] overflow-hidden group">
                        <Image
                            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Lokale"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-semibold">
                            <Sparkles size={12} /> Selskapslokale
                        </div>
                    </div>

                    {/* Overskrift */}
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Din Reservasjon</h2>
                        {startDate && endDate ? (
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-gray-500 font-medium mt-1 text-sm">
                                <span>{formatDateNO(startDate)}</span>
                                <span className="text-gray-300">→</span>
                                <span>{formatDateNO(endDate)}</span>
                                <span className="text-gray-400">
                                    · {daysBetween(startDate, endDate) === 0
                                        ? '1 dag'
                                        : `${daysBetween(startDate, endDate) + 1} dager`}
                                </span>
                            </div>
                        ) : startDate ? (
                            <p className="text-gray-400 mt-1 text-sm">Velg sluttdato i kalenderen</p>
                        ) : (
                            <p className="text-gray-400 mt-1 text-sm">Ingen datoer valgt ennå</p>
                        )}
                    </div>

                    {/* Prisoversikt – vises kun når begge datoer er valgt */}
                    {summary ? (
                        <>
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-3">
                                {summary.weekday > 0 && (
                                    <div className="flex justify-between items-center text-[15px]">
                                        <span className="text-gray-600">
                                            Hverdag ({summary.weekday} {summary.weekday === 1 ? 'dag' : 'dager'} × kr {formatNum(PRICE_WEEKDAY)})
                                        </span>
                                        <span className="font-semibold">kr {formatNum(summary.weekday * PRICE_WEEKDAY)}</span>
                                    </div>
                                )}
                                {summary.weekend > 0 && (
                                    <div className="flex justify-between items-center text-[15px]">
                                        <span className="text-gray-600">
                                            Helg ({summary.weekend} {summary.weekend === 1 ? 'dag' : 'dager'} × kr {formatNum(PRICE_WEEKEND)})
                                        </span>
                                        <span className="font-semibold">kr {formatNum(summary.weekend * PRICE_WEEKEND)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-[15px]">
                                    <span className="text-gray-600">Utvask</span>
                                    <span className="font-semibold">kr {formatNum(CLEANING_FEE)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[15px]">
                                    <span className="text-gray-600 flex items-center gap-1">
                                        Depositum <Info size={14} className="text-gray-400" />
                                    </span>
                                    <span className="font-semibold text-gray-500">kr {formatNum(1_000)}</span>
                                </div>
                                <div className="w-full h-px bg-gray-100 my-1" />
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total</span>
                                    <span className="text-3xl font-bold tracking-tight">kr {formatNum(summary.total)}</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 text-blue-900 border border-blue-100 rounded-2xl p-4 text-[13px] leading-relaxed flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <p>
                                    <strong>Ved reservasjon betales 1 000 kr i depositum.</strong>{' '}
                                    Dette er ikke refunderbart ved kansellering, men trekkes fra totalbeløpet ved bekreftet arrangement.
                                </p>
                            </div>

                            <label className="flex items-start gap-3 cursor-pointer group px-2">
                                <div className="relative flex items-center justify-center w-5 h-5 rounded-md border-2 border-gray-300 group-hover:border-[#1c1c1c] transition-colors mt-0.5 shrink-0 bg-white">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={e => setAgreed(e.target.checked)}
                                        className="absolute opacity-0 w-full h-full cursor-pointer peer"
                                    />
                                    <div className="w-full h-full bg-[#1c1c1c] rounded-[4px] opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center">
                                        <Check size={12} strokeWidth={4} className="text-white" />
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-gray-600 group-hover:text-[#1c1c1c] transition-colors select-none leading-snug">
                                    Jeg forstår og godtar betalingsbetingelsene
                                </span>
                            </label>

                            <button
                                disabled={!agreed}
                                className="w-full bg-[#1c1c1c] text-white py-4 rounded-full text-[15px] font-semibold hover:bg-black transition-all active:scale-95 shadow-xl shadow-black/5 mt-2 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                            >
                                Fortsett til betaling <CreditCard size={18} />
                            </button>

                            <p className="text-[13px] text-center text-gray-400 font-medium pb-2">
                                Betaling via Vipps eller kort
                            </p>
                        </>
                    ) : (
                        /* Tom tilstand */
                        <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                <CalendarDays size={28} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium max-w-[220px] leading-snug">
                                {startDate
                                    ? 'Klikk på en sluttdato for å se prisoppsummering'
                                    : 'Velg en startdato i kalenderen for å begynne bookingen'}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
