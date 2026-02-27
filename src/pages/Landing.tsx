import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Zap, Globe, BarChart3, Users, Receipt, LayoutDashboard, Settings, DollarSign, Search, Package, FileText, Wallet, ArrowUpRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const ScrambleText = ({ text }: { text: string }) => {
    const [display, setDisplay] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let iteration = 0;

        const startScramble = () => {
            clearInterval(interval);
            interval = setInterval(() => {
                setDisplay(
                    text
                        .split("")
                        .map((letter, index) => {
                            if (index < iteration) return text[index];
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join("")
                );

                if (iteration >= text.length) clearInterval(interval);
                iteration += 1 / 3;
            }, 30);
        };

        startScramble();
        return () => clearInterval(interval);
    }, [text]);

    return <span>{display}</span>;
};

const BorderBeam = () => {
    return (
        <motion.div
            style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                borderRadius: "inherit",
                zIndex: -1,
                overflow: "hidden",
            }}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                style={{
                    width: "200%",
                    height: "200%",
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    background: "conic-gradient(from 0deg, transparent 0 340deg, #8b5cf6 360deg)",
                    opacity: 0.5,
                }}
            />
        </motion.div>
    );
};

const SideDecor = () => {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Left Tech Line */}
            <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-purple-500/50 to-transparent">
                <motion.div
                    animate={{ y: [1000, -100] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[100px] bg-gradient-to-t from-transparent via-primary to-transparent blur-[2px]"
                />
                {/* Tech Markers */}
                {[20, 50, 80].map((top) => (
                    <div key={top} className="absolute left-1/2 -translate-x-1/2 w-4 h-4 border border-purple-500/30 flex items-center justify-center" style={{ top: `${top}%` }}>
                        <div className="w-[2px] h-full bg-purple-500/30" />
                        <div className="h-[2px] w-full bg-purple-500/30 absolute" />
                    </div>
                ))}
            </div>

            {/* Right Tech Line */}
            <div className="absolute right-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-purple-500/50 to-transparent">
                <motion.div
                    animate={{ y: [1000, -100] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[100px] bg-gradient-to-b from-transparent via-purple-400 to-transparent blur-[2px]"
                />
                {/* Tech Markers */}
                {[30, 60, 90].map((top) => (
                    <div key={top} className="absolute left-1/2 -translate-x-1/2 w-3 h-3 border border-indigo-500/30 rotate-45" style={{ top: `${top}%` }} />
                ))}
            </div>
        </div>
    );
};

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
            {/* Background Animations */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <SideDecor />
                {/* Tech Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
                </div>

                {/* Animated Glowing Beams (Purple) - Dropping Upwards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-1/4 w-[2px] h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent blur-[2px]"
                />
                <motion.div
                    initial={{ top: "100%" }}
                    animate={{ top: "-100%" }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 1 }}
                    className="absolute left-1/3 w-[1px] h-[500px] bg-gradient-to-t from-transparent via-purple-400 to-transparent opacity-50"
                />
                <motion.div
                    initial={{ top: "100%" }}
                    animate={{ top: "-100%" }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 4 }}
                    className="absolute right-1/4 w-[1px] h-[700px] bg-gradient-to-t from-transparent via-indigo-400 to-transparent opacity-60"
                />
                <motion.div
                    initial={{ top: "100%" }}
                    animate={{ top: "-100%" }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 0 }}
                    className="absolute right-1/3 w-[1px] h-[400px] bg-gradient-to-t from-transparent via-purple-300 to-transparent opacity-40"
                />

                {/* Ambient Orbs - Brighter */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/30 rounded-full blur-[120px] animate-pulse opacity-60" />
                <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-[100px]" />
            </div>

            {/* Navigation */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6"
            >
                <div className="w-full max-w-5xl bg-[#1a0b2e]/60 backdrop-blur-xl border border-white/10 rounded-full pl-6 pr-2 py-2 flex items-center justify-between shadow-2xl shadow-purple-900/20">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                            <Receipt className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-purple-200">
                            Lumina
                        </span>
                    </div>


                    {/* Auth Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/auth")}
                            className="hover:bg-transparent hover:text-white text-gray-400 font-medium px-4"
                        >
                            Log In
                        </Button>
                        <Button
                            onClick={() => navigate("/auth")}
                            className="bg-white hover:bg-gray-200 text-black rounded-full px-6 font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105"
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-32 px-6">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-6">
                            <ScrambleText text="✨ The Future of Invoicing is Here" />
                        </span>
                        <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
                            Invoicing made <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-white text-glow">
                                effortless & beautiful
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Create professional invoices, track payments, and manage clients with
                        an interface designed for the modern web.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Button
                            size="lg"
                            onClick={() => navigate("/auth")}
                            className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white rounded-full shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_-10px_rgba(124,58,237,0.6)] transition-all duration-300 transform hover:scale-105"
                        >
                            Start for free <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-14 px-8 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-sm"
                        >
                            View Demo
                        </Button>
                    </motion.div>

                    {/* Hero Image / Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-20 relative mx-auto max-w-6xl"
                    >
                        {/* Glow Effect behind the card */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 animate-pulse" />

                        <div className="relative rounded-xl border border-white/10 p-2 bg-black/40 backdrop-blur-xl shadow-2xl">
                            <BorderBeam />
                            <div className="rounded-lg overflow-hidden bg-gray-900/90 aspect-[16/9] relative group">
                                {/* Animated Background within the dashboard */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black/0 to-black/0 animate-[spin_60s_linear_infinite]" />
                                </div>

                                {/* Mock Interface */}
                                <div className="absolute inset-0 flex">
                                    {/* Mock Sidebar */}
                                    <div className="w-64 border-r border-white/5 bg-black/20 p-4 flex flex-col gap-4 hidden md:flex">
                                        <div className="flex items-center gap-3 mb-6 px-2">
                                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                                <div className="w-4 h-4 bg-primary rounded-sm" />
                                            </div>
                                            <div className="text-sm font-bold text-white tracking-wide">Lumina</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
                                                <LayoutDashboard className="w-4 h-4" />
                                                <span className="text-xs font-medium">Dashboard</span>
                                            </div>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
                                                <Users className="w-4 h-4" />
                                                <span className="text-xs font-medium">Clients</span>
                                            </div>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
                                                <Package className="w-4 h-4" />
                                                <span className="text-xs font-medium">Products</span>
                                            </div>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
                                                <Receipt className="w-4 h-4" />
                                                <span className="text-xs font-medium">Invoices</span>
                                            </div>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
                                                <FileText className="w-4 h-4" />
                                                <span className="text-xs font-medium">Quotations</span>
                                            </div>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-transparent border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15),inset_0_1px_0_0_rgba(255,255,255,0.1)] text-white">
                                                <BarChart3 className="w-4 h-4" />
                                                <span className="text-xs font-medium">Reports</span>
                                            </div>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
                                                <Settings className="w-4 h-4" />
                                                <span className="text-xs font-medium">Settings</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mock Main Content */}
                                    <div className="flex-1 p-6 flex flex-col gap-6 relative z-10 w-full overflow-hidden">
                                        {/* Mock Header */}
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1">
                                                <div className="text-xl font-bold text-white">Reports & Analytics</div>
                                                <div className="text-xs text-gray-400">Comprehensive insights into your business performance</div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[10px] text-gray-300">
                                                    <span>All Time</span>
                                                    <ChevronDown className="w-3 h-3" />
                                                </div>
                                                <div className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-[10px] font-bold text-purple-400">
                                                    Export Sales
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reports Stats Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {/* Revenue */}
                                            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2 relative overflow-hidden group/card hover:border-green-500/30 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div className="p-1.5 rounded-lg bg-green-500/10 text-green-500">
                                                        <DollarSign className="w-3 h-3" />
                                                    </div>
                                                    <div className="text-[9px] font-medium text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">Revenue</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-white">$1,827,330</div>
                                                    <div className="text-[10px] text-gray-500">From paid invoices</div>
                                                </div>
                                            </div>

                                            {/* Expenses */}
                                            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2 relative overflow-hidden group/card hover:border-red-500/30 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
                                                        <ArrowUpRight className="w-3 h-3" />
                                                    </div>
                                                    <div className="text-[9px] font-medium text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full">Expenses</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-white">$850,000</div>
                                                    <div className="text-[10px] text-gray-500">From paid bills</div>
                                                </div>
                                            </div>

                                            {/* Net Profit */}
                                            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2 relative overflow-hidden group/card hover:border-purple-500/30 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                                                        <Wallet className="w-3 h-3" />
                                                    </div>
                                                    <div className="text-[9px] font-medium text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-full">45.3% Margin</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-white">$977,330</div>
                                                    <div className="text-[10px] text-gray-500">Net Profit</div>
                                                </div>
                                            </div>

                                            {/* Volume */}
                                            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2 relative overflow-hidden group/card hover:border-blue-500/30 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                                                        <FileText className="w-3 h-3" />
                                                    </div>
                                                    <div className="text-[9px] font-medium text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full">Volume</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-white">142</div>
                                                    <div className="text-[10px] text-gray-500">Invoices processed</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tabs */}
                                        <div className="flex justify-center -mb-2">
                                            <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/5">
                                                <div className="px-4 py-1.5 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] text-[10px] font-bold text-white">Sales Overview</div>
                                                <div className="px-4 py-1.5 rounded-full text-[10px] font-medium text-gray-400 hover:text-white transition-colors">Client Insights</div>
                                            </div>
                                        </div>

                                        {/* Sales Performance Chart */}
                                        <div className="flex-1 rounded-xl bg-white/5 border border-white/5 p-4 relative overflow-hidden flex flex-col justify-between group/chart min-h-[180px]">
                                            <div className="flex flex-col gap-1 mb-2">
                                                <div className="text-xs font-bold text-white flex items-center gap-2">
                                                    <BarChart3 className="w-3 h-3 text-purple-400" />
                                                    Sales Performance
                                                </div>
                                                <div className="text-[10px] text-gray-500">Revenue vs Expenses vs Profit analysis</div>
                                            </div>

                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

                                            <div className="flex gap-4 items-end h-32 px-1 justify-between z-10 w-full">
                                                {[45, 75, 55, 85, 60, 95, 70, 80, 65, 90, 75, 85].map((h, i) => (
                                                    <div key={i} className="w-full h-full flex items-end gap-0.5 group/col">
                                                        {/* Revenue Bar */}
                                                        <div style={{ height: `${h}%` }} className="w-full bg-gradient-to-t from-purple-500/20 to-purple-500 rounded-t-[1px] opacity-80 group-hover/col:opacity-100 transition-all" />
                                                        {/* Expense Bar */}
                                                        <div style={{ height: `${h * 0.6}%` }} className="w-full bg-gradient-to-t from-red-500/20 to-red-500 rounded-t-[1px] opacity-60 group-hover/col:opacity-100 transition-all" />
                                                        {/* Profit Bar (New Green Bar) */}
                                                        <div style={{ height: `${h * 0.4}%` }} className="w-full bg-gradient-to-t from-green-500/20 to-green-500 rounded-t-[1px] opacity-60 group-hover/col:opacity-100 transition-all" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements for depth */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-12 top-20 p-4 rounded-xl bg-gray-900 border border-white/10 shadow-xl hidden lg:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Payment Received</div>
                                    <div className="text-xs text-gray-400">$2,400.00 from Acme Corp</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -left-12 bottom-20 p-4 rounded-xl bg-gray-900 border border-white/10 shadow-xl hidden lg:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Invoice Sent</div>
                                    <div className="text-xs text-gray-400">#INV-2024-001 to Global Ltd</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white/2 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need</h2>
                        <p className="text-gray-400 text-lg">Manage your finances without the headache</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            index={0}
                            icon={<Zap className="w-6 h-6 text-yellow-400" />}
                            title="Lightning Fast"
                            description="Create and send invoices in seconds, not minutes. Pre-saved clients and items make it a breeze."
                        />
                        <FeatureCard
                            index={1}
                            icon={<BarChart3 className="w-6 h-6 text-primary" />}
                            title="Detailed Reports"
                            description="Track your income, expenses, and profit margins with beautiful, easy-to-read charts."
                        />
                        <FeatureCard
                            index={2}
                            icon={<Users className="w-6 h-6 text-green-400" />}
                            title="Client Management"
                            description="Keep all your client details in one place. Auto-fill information for recurring work."
                        />
                        <FeatureCard
                            index={3}
                            icon={<Globe className="w-6 h-6 text-blue-400" />}
                            title="Accessible Anywhere"
                            description="Cloud-based system means your data is safe and accessible from any device."
                        />
                        <FeatureCard
                            index={4}
                            icon={<Shield className="w-6 h-6 text-purple-400" />}
                            title="Secure & Private"
                            description="Your financial data is encrypted and stored securely. We prioritize your privacy."
                        />
                        <FeatureCard
                            index={5}
                            icon={<CheckCircle2 className="w-6 h-6 text-pink-400" />}
                            title="Professional PDF"
                            description="Generate crisp, professional PDF invoices that reflect your brand identity."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 relative z-10 bg-black/20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-60">
                    <p>© 2024 InvoiceL. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description, index = 0 }: { icon: any, title: string, description: string, index?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative p-6 rounded-3xl bg-[#120b1f]/50 border border-white/5 hover:border-purple-400/80 backdrop-blur-sm transition-all duration-300 group overflow-hidden hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />

            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Glow Spot */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-[50px] group-hover:bg-primary/40 transition-colors duration-300 group-hover:scale-150" />

            <div className="relative z-20">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] group-hover:border-primary/50">
                    {icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-200 transition-colors group-hover:translate-x-1 duration-300">{title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                    {description}
                </p>
            </div>
        </motion.div>
    );
}
