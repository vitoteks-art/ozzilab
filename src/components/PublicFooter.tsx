import Link from 'next/link'

export function PublicFooter() {
  return (
    <footer className="bg-background-surface border-t border-border-subtle py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-primary text-2xl leading-none">◌</span>
            <span className="text-lg font-bold tracking-tight uppercase">Ozzilab</span>
          </div>
          <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
            Premium business automation for firms that prioritize efficiency and scalability.
          </p>
          <div className="flex gap-6">
            <a
              className="text-slate-400 hover:text-primary transition-colors"
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a className="text-slate-400 hover:text-primary transition-colors" href="https://x.com/" target="_blank" rel="noreferrer">
              X / Twitter
            </a>
            <a
              className="text-slate-400 hover:text-primary transition-colors"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-6">Explore</h4>
          <ul className="space-y-4 text-slate-500">
            <li>
              <Link className="hover:text-primary transition-colors" href="/">
                Services
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary transition-colors" href="/library">
                Library
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary transition-colors" href="/#process">
                How it works
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary transition-colors" href="/audit">
                Request Audit
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-6">Contact</h4>
          <ul className="space-y-4 text-slate-500">
            <li>hello@ozzilab.cloud</li>
            <li>Based in Lagos, NG</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between text-xs text-slate-400 uppercase tracking-widest font-bold">
        <p>© {new Date().getFullYear()} Ozzilab. All rights reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <Link className="hover:text-slate-900" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="hover:text-slate-900" href="/terms">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
