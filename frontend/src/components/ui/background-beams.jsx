import { motion } from "framer-motion";

export const HeroHighlight = ({
    children,
    className,
    containerClassName,
}) => {
    return (
        <div
            className={`relative w-full h-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden ${containerClassName}`}
        >
            <div className="absolute inset-0 bg-dot-white/[0.2] pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            <div className={className}>{children}</div>
        </div>
    );
};

export const BackgroundBeams = ({ className }) => {
    return (
        <div className={`absolute inset-0 mx-auto w-full h-full pointer-events-none overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950 z-0" />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
            />

            {/* Radial Gradient Mask */}
            <div className="absolute inset-0 bg-slate-950 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,transparent_70%,black)]" />

            {/* Glowing Orbs/Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        </div>
    );
};
