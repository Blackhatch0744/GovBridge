import Sidebar from '@/components/shared/Sidebar';
import PageTransition from '@/components/shared/PageTransition';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Sidebar />
      <main className="lg:ml-[240px] min-h-screen p-6 lg:p-10">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
