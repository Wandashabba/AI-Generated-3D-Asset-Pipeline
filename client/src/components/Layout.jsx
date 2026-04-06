
export default function Layout({ children }) {
  return (
    <main className="min-h-screen pb-16 relative bg-surface-50 overflow-hidden">

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-accent-cyan/15 rounded-full blur-[90px] animate-float delay-200" style={{ animationDuration: '6s' }} />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-accent-violet/15 rounded-full blur-[90px] animate-float delay-400" style={{ animationDuration: '5s' }} />
      </div>

      <div className="w-screen max-w-none mx-auto px-[var(--page-gutter)] pt-8 relative z-0">
        {children}
      </div>
    </main>
  );
}
