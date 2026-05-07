import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-white">
              Flow<span className="text-cyan-400">IQ</span>
            </span>
          </Link>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} FlowIQ. AI-powered business automation analysis.
          </p>

          <div className="flex gap-6">
            <Link href="/analyze" className="text-sm text-slate-500 hover:text-white transition-colors">
              Get Started
            </Link>
            <Link href="/admin" className="text-sm text-slate-500 hover:text-white transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
