export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-light text-slate-900 antialiased selection:bg-[#13ecec] selection:text-[#102222]">
      {children}
    </div>
  );
}