import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCustomer } from '@/lib/shopify';
import { DashboardView } from '@/components/dashboard/DashboardView';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  // 1. If no token in cookies, force login
  if (!sessionToken) {
    redirect('/account/login');
  }

  try {
    // 2. Fetch real data from Shopify
    const customer = await getCustomer(sessionToken);

    // 3. If Shopify returns null (token expired), force login
    if (!customer) {
      redirect('/account/login');
    }

    // 4. Render the View with data
    return <DashboardView customer={customer} />;
    
  } catch (error) {
    console.error("Dashboard Error:", error);
    redirect('/account/login');
  }
}