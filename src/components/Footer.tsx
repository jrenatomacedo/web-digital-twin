import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-brand-cyan/10 bg-background/50 backdrop-blur-sm mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="font-display font-bold text-xl tracking-tighter">
              <span className="text-foreground">José</span>
              <span className="text-brand-cyan">.Renato</span>
            </div>
            <p className="text-brand-gray max-w-sm text-sm">
              Executive Development Manager | Tech Lead | Systems Architecture | Agile Management based in São Paulo, Brazil.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.linkedin.com/in/jrenato-oliveira" target="_blank" rel="noreferrer" className="text-brand-gray hover:text-brand-cyan inline-flex items-center gap-1 transition-colors">
                  LinkedIn <ArrowUpRight size={14} />
                </a>
              </li>
              <li>
                <a href="mailto:jrenato.macedo@gmail.com" className="text-brand-gray hover:text-brand-cyan inline-flex items-center gap-1 transition-colors">
                  Email <ArrowUpRight size={14} />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-brand-gray hover:text-brand-cyan transition-colors">About</a></li>
              <li><a href="#experience" className="text-brand-gray hover:text-brand-cyan transition-colors">Experience</a></li>
              <li><a href="#portfolio" className="text-brand-gray hover:text-brand-cyan transition-colors">Portfolio</a></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-brand-gray/60">
          <p>© {new Date().getFullYear()} José Renato Oliveira. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="flex items-center gap-1">
              Built with <span className="text-brand-cyan">Next.js & Tailwind</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
