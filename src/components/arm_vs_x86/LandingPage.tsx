import { useState } from "react";

// ─── Chip Pin ─────────────────────────────────────────────────────────────────
function ChipPin({
    cx,
    cy,
    color,
    horizontal,
}: {
    cx: number;
    cy: number;
    color: string;
    horizontal: boolean;
}) {
    if (horizontal) {
        return (
            <line
                x1={cx}
                y1={cy}
                x2={cx + 5}
                y2={cy}
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.5"
            />
        );
    }
    return (
        <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy + 5}
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
        />
    );
}

// ─── CPU Chip SVG ─────────────────────────────────────────────────────────────
function CpuChip({ color, label }: { color: string; label: string }) {
    const pins = [18, 28, 38, 48, 58, 68, 78];
    return (
        <svg
            viewBox="0 0 100 100"
            className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-2xl"
        >
            {pins.map((px) => (
                <g key={`t${px}`}>
                    <ChipPin cx={px} cy={6} color={color} horizontal={false} />
                    <ChipPin cx={px} cy={88} color={color} horizontal={false} />
                    <ChipPin cx={6} cy={px} color={color} horizontal={true} />
                    <ChipPin cx={88} cy={px} color={color} horizontal={true} />
                </g>
            ))}
            <rect
                x="10"
                y="10"
                width="80"
                height="80"
                rx="6"
                fill="#1A1F2B"
                stroke={color}
                strokeWidth="1.5"
                opacity="0.92"
            />
            <circle cx="16" cy="16" r="3" fill={color} opacity="0.35" />
            <rect
                x="20"
                y="20"
                width="60"
                height="60"
                rx="3"
                fill="#0F1117"
                stroke={color}
                strokeWidth="0.5"
                opacity="0.5"
            />
            {[33, 46, 59].map((v) => (
                <g key={`grid-${v}`}>
                    <line
                        x1={v}
                        y1="20"
                        x2={v}
                        y2="80"
                        stroke={color}
                        strokeWidth="0.4"
                        opacity="0.12"
                    />
                    <line
                        x1="20"
                        y1={v}
                        x2="80"
                        y2={v}
                        stroke={color}
                        strokeWidth="0.4"
                        opacity="0.12"
                    />
                </g>
            ))}
            <rect
                x="30"
                y="40"
                width="40"
                height="22"
                rx="3"
                fill={color}
                opacity="0.1"
            />
            <text
                x="50"
                y="55"
                textAnchor="middle"
                fill={color}
                fontFamily="JetBrains Mono, monospace"
                fontWeight="700"
                fontSize="14"
                letterSpacing="2"
            >
                {label}
            </text>
        </svg>
    );
}

// ─── VS Badge ────────────────────────────────────────────────────────────────
function VsBadge() {
    return (
        <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
            <div className="absolute inset-0 rounded-full border border-white/15 animate-pulse-glow" />
            <div className="absolute inset-2 rounded-full bg-arch-panel flex items-center justify-center border border-white/10">
                <span className="font-mono text-xs font-bold text-white/70">
                    VS
                </span>
            </div>
        </div>
    );
}

// ─── Chip-to-chip circuit line decorators ─────────────────────────────────────
function CircuitLine({
    side,
    width,
    color,
    delay,
}: {
    side: "left" | "right";
    width: number;
    color: string;
    delay: number;
}) {
    const x1 = side === "left" ? 0 : width;
    const x2 = side === "left" ? width - 40 : 40;
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        >
            <line
                x1={x1}
                y1="50"
                x2={x2}
                y2="50"
                stroke={color}
                strokeWidth="1"
                opacity="0.25"
                strokeDasharray="6 6"
                className="animate-circuit"
            />
            <line
                x1={x1}
                y1="51"
                x2={x2}
                y2="51"
                stroke={color}
                strokeWidth="0.5"
                opacity="0.1"
                strokeDasharray="3 8"
                className="animate-circuit"
                style={{ animationDelay: `${delay}s` }}
            />
        </svg>
    );
}

// ─── Interactive Circuit Board Background ─────────────────────────────────────
const ARM_COLOR = "#00C2D1";
const X86_COLOR = "#FF8C42";
const IDLE_COLOR = "#1A1F2B"; // panel colour — faint traces when not hovered
const C = 12; // chamfer size (px) for 45° PCB corners

type HoveredArch = "arm" | "x86" | null;

function CircuitBoard({ hoveredArch }: { hoveredArch: HoveredArch }) {
    const armActive = hoveredArch === "arm";
    const x86Active = hoveredArch === "x86";

    // Colours: White-hot core when active, subtle panel color when idle
    const armStroke = armActive ? "#FFFFFF" : IDLE_COLOR;
    const x86Stroke = x86Active ? "#FFFFFF" : IDLE_COLOR;

    // Opacity: active side = full, opposite = dimmed, neither hovered = subtle
    const armOpacity = x86Active ? 0.15 : armActive ? 1 : 0.65;
    const x86Opacity = armActive ? 0.15 : x86Active ? 1 : 0.65;

    // Bloom (tight glow) + Baked light (wide ambient back-glow) using the arch's accent color
    const armFilter = armActive
        ? `drop-shadow(0 0 3px ${ARM_COLOR}) drop-shadow(0 0 8px ${ARM_COLOR}) drop-shadow(0 0 25px ${ARM_COLOR}88)`
        : "none";
    const x86Filter = x86Active
        ? `drop-shadow(0 0 3px ${X86_COLOR}) drop-shadow(0 0 8px ${X86_COLOR}) drop-shadow(0 0 25px ${X86_COLOR}88)`
        : "none";

    // CSS transition applied to each <g> — animates stroke, opacity, filter,
    // and `color` (used by via circles via `fill: currentColor`)
    const tx: React.CSSProperties = {
        transition:
            "stroke 0.5s ease, opacity 0.5s ease, filter 0.5s ease, color 0.5s ease",
    };

    // Shared via style: fill inherits the group's `color` property so it
    // animates in sync; stroke suppressed so no ring appears.
    const viaStyle: React.CSSProperties = {
        fill: "currentColor",
        stroke: "none",
    };

    return (
        <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "none", zIndex: 0 }}
            aria-hidden="true"
        >
            {/* ── ARM traces — left cluster ────────────────────────────────────────── */}
            <g
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    stroke: armStroke,
                    color: armStroke,
                    opacity: armOpacity,
                    filter: armFilter,
                    ...tx,
                }}
            >
                {/* Rail 1: horizontal at y=110, turns up-right at x=280 */}
                <path d={`M 0 110 H 280 L ${280 + C} ${110 - C} H 465`} />

                {/* Branch off rail 1 at x=200: goes up then right */}
                <path d={`M 200 110 V 55 L ${200 + C} ${55 - C} H 400`} />

                {/* Left-edge vertical: comes from top, two turns, ends mid-screen */}
                <path
                    d={`M 55 0 V 210 L ${55 + C} ${210 + C} H 195 L ${195 + C} ${210 + 2 * C} V 370`}
                />

                {/* Mid-region loop: left → up-turn → right → down-turn → down → down-turn → right */}
                <path
                    d={`M 0 315 H 132 L ${132 + C} ${315 - C} H 335 L ${335 + C} ${315 + C} V 435 L ${335} ${435 + C} H 142 L ${142 - C} ${435 + 2 * C} V 530`}
                />

                {/* Lower trace: left → down-turn → drop → right-turn → right → up-turn */}
                <path
                    d={`M 0 540 H 112 L ${112 + C} ${540 + C} V 648 L ${112 + 2 * C} ${648 + C} H 295 L ${295 + C} ${648 - C} H 460`}
                />

                {/* Bottom trace: left → up-turn → right → down-turn → drop → down-turn → right */}
                <path
                    d={`M 0 735 H 188 L ${188 + C} ${735 - C} H 405 L ${405 + C} ${735 + C} V 840 L ${405} ${840 + C} H 218`}
                />

                {/* Far-left stub: short vertical then right to connect rail zones */}
                <path d={`M 18 315 V 540 L ${18 + C} ${540 + C} H 75`} />

                {/* Stub perpendicular from rail 1: down then right */}
                <path d={`M 280 110 V 198 L ${280 + C} ${198 + C} H 430`} />

                {/* Small connector: left edge stub at y=435 */}
                <path d={`M 0 435 H 50`} />

                {/* Connector: from left edge down to lower trace area */}
                <path d={`M 0 658 H 98 L ${98 + C} ${658 - C} V ${540 + C}`} />

                {/* Via dots at every junction (fill=currentColor animates with group) */}
                <circle cx={200} cy={110} r={3} style={viaStyle} />
                <circle cx={280} cy={110} r={3} style={viaStyle} />
                <circle cx={55} cy={210} r={3} style={viaStyle} />
                <circle cx={207} cy={222} r={2.5} style={viaStyle} />
                <circle cx={132} cy={315} r={3} style={viaStyle} />
                <circle cx={335} cy={303} r={2.5} style={viaStyle} />
                <circle cx={347} cy={435} r={3} style={viaStyle} />
                <circle cx={130} cy={447} r={2.5} style={viaStyle} />
                <circle cx={112} cy={540} r={3} style={viaStyle} />
                <circle cx={124} cy={648} r={3} style={viaStyle} />
                <circle cx={295} cy={636} r={2.5} style={viaStyle} />
                <circle cx={188} cy={735} r={3} style={viaStyle} />
                <circle cx={405} cy={735} r={3} style={viaStyle} />
                <circle cx={98} cy={658} r={2.5} style={viaStyle} />
            </g>

            {/* ── x86 traces — right cluster (mirror of ARM across x=720) ─────────── */}
            <g
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    stroke: x86Stroke,
                    color: x86Stroke,
                    opacity: x86Opacity,
                    filter: x86Filter,
                    ...tx,
                }}
            >
                {/* Mirror of ARM rail 1 */}
                <path d={`M 1440 110 H 1160 L ${1160 - C} ${110 - C} H 975`} />

                {/* Mirror of ARM branch */}
                <path d={`M 1240 110 V 55 L ${1240 - C} ${55 - C} H 1040`} />

                {/* Mirror of ARM left-edge vertical */}
                <path
                    d={`M 1385 0 V 210 L ${1385 - C} ${210 + C} H 1245 L ${1245 - C} ${210 + 2 * C} V 370`}
                />

                {/* Mirror of ARM mid-region loop */}
                <path
                    d={`M 1440 315 H 1308 L ${1308 - C} ${315 - C} H 1105 L ${1105 - C} ${315 + C} V 435 L ${1105} ${435 + C} H 1298 L ${1298 + C} ${435 + 2 * C} V 530`}
                />

                {/* Mirror of ARM lower trace */}
                <path
                    d={`M 1440 540 H 1328 L ${1328 - C} ${540 + C} V 648 L ${1328 - 2 * C} ${648 + C} H 1145 L ${1145 - C} ${648 - C} H 980`}
                />

                {/* Mirror of ARM bottom trace */}
                <path
                    d={`M 1440 735 H 1252 L ${1252 - C} ${735 - C} H 1035 L ${1035 - C} ${735 + C} V 840 L ${1035} ${840 + C} H 1222`}
                />

                {/* Mirror of ARM far-left stub */}
                <path d={`M 1422 315 V 540 L ${1422 - C} ${540 + C} H 1365`} />

                {/* Mirror of ARM perpendicular stub */}
                <path d={`M 1160 110 V 198 L ${1160 - C} ${198 + C} H 1010`} />

                {/* Mirror of ARM left-edge stub */}
                <path d={`M 1440 435 H 1390`} />

                {/* Mirror of ARM lower connector */}
                <path
                    d={`M 1440 658 H 1342 L ${1342 - C} ${658 - C} V ${540 + C}`}
                />

                {/* Via dots */}
                <circle cx={1240} cy={110} r={3} style={viaStyle} />
                <circle cx={1160} cy={110} r={3} style={viaStyle} />
                <circle cx={1385} cy={210} r={3} style={viaStyle} />
                <circle cx={1233} cy={222} r={2.5} style={viaStyle} />
                <circle cx={1308} cy={315} r={3} style={viaStyle} />
                <circle cx={1105} cy={303} r={2.5} style={viaStyle} />
                <circle cx={1093} cy={435} r={3} style={viaStyle} />
                <circle cx={1310} cy={447} r={2.5} style={viaStyle} />
                <circle cx={1328} cy={540} r={3} style={viaStyle} />
                <circle cx={1316} cy={648} r={3} style={viaStyle} />
                <circle cx={1145} cy={636} r={2.5} style={viaStyle} />
                <circle cx={1252} cy={735} r={3} style={viaStyle} />
                <circle cx={1035} cy={735} r={3} style={viaStyle} />
                <circle cx={1342} cy={658} r={2.5} style={viaStyle} />
            </g>

            {/* ── Center neutral traces — always faint, never glow ─────────────────── */}
            <g
                fill="none"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke={IDLE_COLOR}
                opacity="0.4"
            >
                {/* Top center arch */}
                <path
                    d={`M 685 0 V 160 L ${685 + C} ${160 + C} H ${755 - C} L 755 ${160} V 0`}
                />
                {/* Bottom center arch */}
                <path
                    d={`M 685 900 V 740 L ${685 + C} ${740 - C} H ${755 - C} L 755 ${740} V 900`}
                />
                {/* Center dashed spine */}
                <line
                    x1="720"
                    y1="172"
                    x2="720"
                    y2="728"
                    strokeDasharray="5 10"
                />
                {/* Via dots at arch junctions */}
                <circle cx={697} cy={172} r={2.5} fill={IDLE_COLOR} />
                <circle cx={743} cy={172} r={2.5} fill={IDLE_COLOR} />
                <circle cx={697} cy={728} r={2.5} fill={IDLE_COLOR} />
                <circle cx={743} cy={728} r={2.5} fill={IDLE_COLOR} />
            </g>
        </svg>
    );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({
    onSelect,
}: {
    onSelect: (arch: "arm" | "x86") => void;
}) {
    const [hoveredArch, setHoveredArch] = useState<HoveredArch>(null);

    return (
        <div className="min-h-screen bg-pcb flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Interactive circuit board — rendered behind all content (z-0) */}
            <CircuitBoard hoveredArch={hoveredArch} />

            {/* Page heading */}
            <div className="text-center mb-10 relative z-10">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-3">
                    ARM{" "}
                    <span className="text-white/30 mx-2 font-light">vs</span>{" "}
                    x86
                </h1>
                <p className="text-gray-500 text-base md:text-lg max-w-2xl font-light tracking-wide">
                    Computer Architecture Comparison — Interactive Engineering
                    Analysis
                </p>
            </div>

            {/* Chip selector */}
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 relative z-10">
                {/* ARM chip — triggers teal glow on hover */}
                <div
                    className="relative"
                    onClick={() => onSelect("arm")}
                    onMouseEnter={() => setHoveredArch("arm")}
                    onMouseLeave={() => setHoveredArch(null)}
                >
                    <div className="cursor-pointer hover:scale-105 transition-transform duration-300 flex flex-col items-center gap-3 group">
                        <CpuChip color="#00C2D1" label="ARM" />
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-mono text-arm tracking-widest">
                                ARM
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-wider">
                                RISC · Power Efficient
                            </span>
                        </div>
                        <div className="w-24 h-[2px] bg-arm/20 rounded-full group-hover:bg-arm/40 transition-colors" />
                    </div>
                </div>

                {/* VS badge with animated connecting lines */}
                <div className="flex items-center justify-center relative">
                    <CircuitLine
                        side="left"
                        width={100}
                        color="#00C2D1"
                        delay={0}
                    />
                    <CircuitLine
                        side="right"
                        width={100}
                        color="#FF8C42"
                        delay={0.15}
                    />
                    <VsBadge />
                </div>

                {/* x86 chip — triggers orange glow on hover */}
                <div
                    className="relative"
                    onClick={() => onSelect("x86")}
                    onMouseEnter={() => setHoveredArch("x86")}
                    onMouseLeave={() => setHoveredArch(null)}
                >
                    <div className="cursor-pointer hover:scale-105 transition-transform duration-300 flex flex-col items-center gap-3 group">
                        <CpuChip color="#FF8C42" label="x86" />
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-mono text-x86 tracking-widest">
                                x86
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-wider">
                                CISC · High Performance
                            </span>
                        </div>
                        <div className="w-24 h-[2px] bg-x86/20 rounded-full group-hover:bg-x86/40 transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
