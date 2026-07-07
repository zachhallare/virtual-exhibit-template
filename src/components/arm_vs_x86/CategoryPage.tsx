import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SingleFlashcard from "./FlashcardDeck";
import type { FlashCard } from "./FlashcardDeck";
import AnimatedBars from "./AnimatedBars";
import { armData, x86Data } from "./data";

const categories = [
    "Overview",
    "Performance",
    "Use Cases",
    "Key Devices",
    "Pros and Cons",
    "Comparison Table",
];

// ─── Skeleton Helpers ──────────────────────────────────────────────────────────

function SkeletonBlock({ className }: { className?: string }) {
    return <div className={`skeleton ${className ?? ""}`} />;
}

function CategoryPageSkeleton() {
    return (
        <div className="w-full max-w-2xl">
            <SkeletonBlock className="h-4 w-16 mb-6" />
            <div
                className="rounded-xl p-6 mb-8"
                style={{
                    backgroundColor: "#1A1F2B",
                    border: "1px solid rgba(255,255,255,0.05)",
                }}
            >
                <SkeletonBlock className="h-8 w-32 mb-3" />
                <SkeletonBlock className="h-3 w-56 mb-4" />
                <SkeletonBlock className="h-5 w-12 rounded" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl overflow-hidden"
                        style={{
                            border: "1px solid rgba(255,255,255,0.05)",
                            backgroundColor: "#0F1117",
                        }}
                    >
                        <div className="flex gap-[2px] px-3 py-1">
                            {Array.from({ length: 10 }).map((_, j) => (
                                <div
                                    key={j}
                                    className="flex-1 h-[2px] rounded-full skeleton"
                                />
                            ))}
                        </div>
                        <div
                            className="mx-3 rounded-lg"
                            style={{
                                minHeight: 70,
                                backgroundColor: "#0F1117",
                            }}
                        >
                            <SkeletonBlock className="mx-4 my-4 h-3 w-20 mx-auto" />
                        </div>
                        <div className="flex gap-[2px] px-3 py-1">
                            {Array.from({ length: 10 }).map((_, j) => (
                                <div
                                    key={j}
                                    className="flex-1 h-[2px] rounded-full skeleton"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Chip Pins ────────────────────────────────────────────────────────────────

function ChipPins({ accentColor }: { accentColor: string }) {
    return (
        <div className="flex gap-[2px] px-3 py-1">
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className="flex-1 h-[2px] rounded-full"
                    style={{ backgroundColor: `${accentColor}18` }}
                />
            ))}
        </div>
    );
}

// ─── ChipButton ──────────────────────────────────────────────────────────────

function ChipButton({
    label,
    accentColor,
    onClick,
}: {
    label: string;
    accentColor: string;
    onClick: () => void;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            layout
            className="rounded-xl cursor-pointer transition-transform duration-200 relative"
            style={{
                border: `1px solid ${hovered ? accentColor : `${accentColor}25`}`,
                backgroundColor: `${accentColor}06`,
                transform: hovered ? "scale(1.05)" : "scale(1)",
                boxShadow: hovered ? `0 0 35px -10px ${accentColor}88` : "none",
                transition:
                    "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Rotating conic-gradient trace */}
            <div
                className="absolute -inset-px rounded-xl pointer-events-none"
                style={{
                    opacity: hovered ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    zIndex: 2,
                    padding: 1.5,
                    filter: hovered
                        ? `drop-shadow(0 0 3px ${accentColor}) drop-shadow(0 0 8px ${accentColor})`
                        : "none",
                    background: `conic-gradient(from 0deg, transparent 0%, #ffffff 8%, ${accentColor} 16%, transparent 32%)`,
                    animation: hovered
                        ? "spin-border 2s linear infinite"
                        : "none",
                    WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                }}
            />

            <ChipPins accentColor={accentColor} />

            <div
                className="mx-3 rounded-lg overflow-hidden relative"
                style={{
                    backgroundColor: "#0F1117",
                    border: `1px solid ${accentColor}${hovered ? "40" : "12"}`,
                    minHeight: 70,
                    backgroundImage: hovered
                        ? `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`
                        : `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
                    backgroundSize: "16px 16px",
                    transition: "background-image 0s, border-color 0.25s ease",
                }}
            >
                <div className="flex flex-col items-center justify-center h-full px-4 py-4 relative z-10">
                    <div
                        className="w-2 h-2 rounded-full mb-2 shrink-0"
                        style={{
                            backgroundColor: hovered ? "#ffffff" : accentColor,
                            opacity: hovered ? 1 : 0.45,
                            animation: hovered
                                ? "dot-pulse 1.5s ease-in-out infinite"
                                : "none",
                            boxShadow: hovered
                                ? `0 0 4px 1px ${accentColor}, 0 0 12px 3px ${accentColor}`
                                : "none",
                            transition:
                                "opacity 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease",
                        }}
                    />
                    <span
                        className="text-sm font-mono font-bold tracking-wider text-center"
                        style={{
                            color: accentColor,
                            opacity: hovered ? 1 : 0.85,
                            transition: "opacity 0.25s ease",
                        }}
                    >
                        {label}
                    </span>
                </div>
            </div>

            <ChipPins accentColor={accentColor} />
        </motion.div>
    );
}

// ─── Hoverable List Item ──────────────────────────────────────────────────────

function HoverItem({
    accentColor,
    children,
    className = "",
}: {
    accentColor: string;
    children: React.ReactNode;
    className?: string;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className={`rounded-lg transition-colors duration-250 ${className}`}
            style={{
                backgroundColor: hovered
                    ? `${accentColor}0D`
                    : "rgba(15,17,23,0.4)",
                borderLeft: `2px solid ${hovered ? accentColor : "rgba(255,255,255,0.07)"}`,
                borderRight: "1px solid rgba(255,255,255,0.05)",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                boxShadow: hovered ? `0 0 35px -15px ${accentColor}88` : "none",
                transition:
                    "background-color 0.25s ease, border-left-color 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </div>
    );
}

// ─── Pros / Cons ──────────────────────────────────────────────────────────────

function ProsConsItem({
    text,
    icon,
    iconColor,
    accentColor,
}: {
    text: string;
    icon: string;
    iconColor: string;
    accentColor: string;
}) {
    const [hovered, setHovered] = useState(false);
    const [pulseKey, setPulseKey] = useState(0);
    const handleEnter = () => {
        setHovered(true);
        setPulseKey((k) => k + 1);
    };
    return (
        <li
            className="flex gap-2 rounded-lg p-3 relative"
            style={{
                backgroundColor: hovered
                    ? `${accentColor}0D`
                    : "rgba(15,17,23,0.4)",
                borderLeft: `2px solid ${hovered ? accentColor : "rgba(255,255,255,0.07)"}`,
                borderRight: "1px solid rgba(255,255,255,0.05)",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                boxShadow: hovered ? `0 0 35px -15px ${accentColor}88` : "none",
                transition:
                    "background-color 0.25s ease, border-left-color 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={handleEnter}
            onMouseLeave={() => setHovered(false)}
        >
            <span
                key={pulseKey}
                className={`shrink-0 mt-0.5 inline-block ${hovered ? "animate-icon-pulse" : ""}`}
                style={{
                    color: hovered ? "#ffffff" : iconColor,
                    filter: hovered
                        ? `drop-shadow(0 0 3px ${iconColor}) drop-shadow(0 0 8px ${iconColor}) drop-shadow(0 0 15px ${iconColor}AA)`
                        : "none",
                    transition: "filter 0.25s ease, color 0.25s ease",
                }}
            >
                {icon}
            </span>
            <span className="text-gray-300 relative z-10">{text}</span>
        </li>
    );
}

function ProsCons({
    pros,
    cons,
    accentColor,
}: {
    pros: string[];
    cons: string[];
    accentColor: string;
}) {
    return (
        <div className="space-y-5">
            <div>
                <h4
                    className="font-semibold mb-3 flex items-center gap-2"
                    style={{ color: "#00C2D1" }}
                >
                    <span
                        className="w-1 h-4 rounded-full inline-block"
                        style={{
                            backgroundColor: "#00C2D1",
                            boxShadow: "0 0 8px #00C2D1",
                        }}
                    />
                    Pros
                </h4>
                <ul className="space-y-2">
                    {pros.map((p, i) => (
                        <ProsConsItem
                            key={i}
                            text={p}
                            icon="✓"
                            iconColor="#00C2D1"
                            accentColor={accentColor}
                        />
                    ))}
                </ul>
            </div>
            <div>
                <h4
                    className="font-semibold mb-3 flex items-center gap-2"
                    style={{ color: "#FF8C42" }}
                >
                    <span
                        className="w-1 h-4 rounded-full inline-block"
                        style={{
                            backgroundColor: "#FF8C42",
                            boxShadow: "0 0 8px #FF8C42",
                        }}
                    />
                    Cons
                </h4>
                <ul className="space-y-2">
                    {cons.map((c, i) => (
                        <ProsConsItem
                            key={i}
                            text={c}
                            icon="✗"
                            iconColor="#FF8C42"
                            accentColor={accentColor}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

// ─── Comparison Table ─────────────────────────────────────────────────────────

function ComparisonTableRow({
    row,
    accentColor,
}: {
    row: { attribute: string; arm: string; x86: string };
    accentColor: string;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <tr
            className="border-b border-white/5 last:border-0 relative z-10"
            style={{
                backgroundColor: hovered ? `${accentColor}0D` : "transparent",
                boxShadow: hovered
                    ? `inset 0 0 20px -10px ${accentColor}66`
                    : "none",
                transition: "background-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <td
                className="p-3 font-medium"
                style={{
                    color: hovered ? "#ffffff" : "#9ca3af",
                    textShadow: hovered ? `0 0 8px ${accentColor}AA` : "none",
                    transition: "color 0.2s ease, text-shadow 0.2s ease",
                }}
            >
                {row.attribute}
            </td>
            <td className="p-3 text-gray-300">{row.arm}</td>
            <td className="p-3 text-gray-300">{row.x86}</td>
        </tr>
    );
}

function ComparisonTable({
    data,
    accentColor,
}: {
    data: typeof armData;
    accentColor: string;
}) {
    return (
        <div className="overflow-x-auto overflow-hidden rounded-lg border border-white/5">
            <table className="w-full text-xs min-w-[340px]">
                <thead>
                    <tr className="bg-arch-bg/60">
                        <th className="text-left p-3 font-mono text-gray-300 font-medium border-b border-white/5">
                            Attribute
                        </th>
                        <th
                            className="text-left p-3 font-mono font-medium border-b border-white/5"
                            style={{ color: "#00C2D1" }}
                        >
                            ARM
                        </th>
                        <th
                            className="text-left p-3 font-mono font-medium border-b border-white/5"
                            style={{ color: "#FF8C42" }}
                        >
                            x86
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.comparisonTable.map((row, i) => (
                        <ComparisonTableRow
                            key={i}
                            row={row}
                            accentColor={accentColor}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Flashcard Content Generator ─────────────────────────────────────────────

function getFlashcard(
    category: string,
    data: typeof armData,
    accentColor: string,
): FlashCard {
    const baseFront = (
        <div className="flex flex-col items-center justify-center h-full text-center gap-3 select-none">
            <span
                className="text-4xl md:text-5xl font-mono font-black tracking-widest uppercase"
                style={{
                    color: accentColor,
                    textShadow: `0 0 20px ${accentColor}44`,
                }}
            >
                {data.name}
            </span>
        </div>
    );

    switch (category) {
        case "overview":
            return {
                front: baseFront,
                back: (
                    <div className="flex flex-col justify-center h-full px-2">
                        <p className="text-justify text-base md:text-xl leading-relaxed tracking-wide text-gray-300 font-sans antialiased opacity-90">
                            {data.overview}
                        </p>
                    </div>
                ),
            };
        case "performance":
            return {
                front: baseFront,
                back: <AnimatedBars data={data.performance} />,
            };
        case "useCases":
            return {
                front: baseFront,
                back: (
                    <ul className="space-y-2">
                        {data.useCases.map((item, i) => (
                            <HoverItem
                                key={i}
                                accentColor={accentColor}
                                className="p-3"
                            >
                                {item}
                            </HoverItem>
                        ))}
                    </ul>
                ),
            };
        case "keyDevices":
            return {
                front: baseFront,
                back: (
                    <div className="space-y-3">
                        {data.keyDevices.map((device, i) => (
                            <HoverItem
                                key={i}
                                accentColor={accentColor}
                                className="p-4"
                            >
                                <h4 className="text-white font-medium">
                                    {device.name}
                                </h4>
                                <p className="text-gray-400 text-xs mt-1">
                                    {device.description}
                                </p>
                            </HoverItem>
                        ))}
                    </div>
                ),
            };
        case "prosAndCons":
            return {
                front: baseFront,
                back: (
                    <ProsCons
                        pros={data.pros}
                        cons={data.cons}
                        accentColor={accentColor}
                    />
                ),
            };
        case "comparison":
            return {
                front: baseFront,
                back: <ComparisonTable data={data} accentColor={accentColor} />,
            };
        default:
            return { front: null, back: null };
    }
}

// ─── Category Page ────────────────────────────────────────────────────────────

function CategoryPage({
    arch,
    onBack,
}: {
    arch: "arm" | "x86";
    onBack: () => void;
}) {
    const data = arch === "arm" ? armData : x86Data;
    const accentColor = arch === "arm" ? "#00C2D1" : "#FF8C42";

    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 350);
        return () => clearTimeout(timer);
    }, []);

    const categoryLabel =
        selectedCategory === "useCases"
            ? "Use Cases"
            : selectedCategory === "keyDevices"
              ? "Key Devices"
              : selectedCategory === "prosAndCons"
                ? "Pros and Cons"
                : selectedCategory === "comparison"
                  ? "Comparison Table"
                  : selectedCategory
                    ? selectedCategory.charAt(0).toUpperCase() +
                      selectedCategory.slice(1)
                    : "";

    const card = selectedCategory
        ? getFlashcard(selectedCategory, data, accentColor)
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-screen bg-pcb flex flex-col items-center py-10 px-4"
        >
            <style>{`@keyframes spin-border { to { transform: rotate(360deg); } }`}</style>

            <AnimatePresence mode="wait">
                {!mounted ? (
                    <motion.div
                        key="skeleton"
                        className="w-full max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <CategoryPageSkeleton />
                    </motion.div>
                ) : selectedCategory && card ? (
                    <motion.div
                        key="flashcard"
                        className="w-full max-w-xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                    >
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="text-gray-500 hover:text-white transition-colors mb-6 flex items-center gap-1 text-sm font-mono tracking-wide"
                        >
                            ← Categories
                        </button>

                        <SingleFlashcard
                            key={selectedCategory}
                            card={card}
                            initiallyFlipped
                            accentColor={accentColor}
                            categoryLabel={categoryLabel}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        className="w-full max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <button
                            onClick={onBack}
                            className="text-gray-500 hover:text-white transition-colors mb-6 flex items-center gap-1 text-sm font-mono tracking-wide"
                        >
                            ← Back
                        </button>

                        <div
                            className="rounded-xl p-6 mb-8"
                            style={{
                                backgroundColor: `${accentColor}08`,
                                border: `1px solid ${accentColor}25`,
                            }}
                        >
                            <h2 className="text-3xl font-bold text-white">
                                {data.name}
                            </h2>
                            <p className="text-gray-400 text-xs mt-1 font-mono tracking-widest uppercase">
                                {data.tagline}
                            </p>
                            <span
                                className="inline-block mt-3 text-[10px] font-mono px-2 py-0.5 rounded tracking-widest"
                                style={{
                                    border: `1px solid ${accentColor}40`,
                                    color: accentColor,
                                }}
                            >
                                {data.isa}
                            </span>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                        >
                            {categories.map((label) => {
                                const key =
                                    label === "Use Cases"
                                        ? "useCases"
                                        : label === "Key Devices"
                                          ? "keyDevices"
                                          : label === "Pros and Cons"
                                            ? "prosAndCons"
                                            : label === "Comparison Table"
                                              ? "comparison"
                                              : label.toLowerCase();
                                return (
                                    <ChipButton
                                        key={key}
                                        label={label}
                                        accentColor={accentColor}
                                        onClick={() => setSelectedCategory(key)}
                                    />
                                );
                            })}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default CategoryPage;
