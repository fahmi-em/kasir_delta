import { usePathname } from 'next/navigation';
import { Calculator, ChartAreaIcon, FilePlus2, Home,  ReceiptIcon, ShoppingBasket, UserPlus2 } from 'lucide-react';


export const NavItems = () => {
  // const { data: session } = useSession(); // Mengambil session pengguna
  // console.log("sesi:", session);
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname === nav || pathname.startsWith(`${nav}/`);
  }

  return [
    {
      name: 'Home',
      href: '/',
      icon: <Home size={20} />,
      active: pathname === '/',
      position: 'top',
      role: ['admin', 'superadmin'],
    },
    {
      name: 'Add Customers',
      href: '/add-customers',
      icon: <UserPlus2 size={20} />,
      active: isNavItemActive(pathname, '/add-customers'),
      position: 'top',
      role: 'superadmin',
    },
    {
      name: 'Add Bahan',
      href: '/add-bahan',
      icon: <FilePlus2 size={20} />,
      active: isNavItemActive(pathname, '/add-bahan'),
      position: 'top',
      role: 'superadmin',
    },
    {
      name: 'Order',
      href: '#',
      icon: <ShoppingBasket size={20} />,
      active: isNavItemActive(pathname, '/order'),
      position: 'top',
      role: ['admin', 'superadmin'],
      children: [
        {
          name: 'Add Order',
          href: '/add-order',
          icon: <Calculator size={20} />,
          active: isNavItemActive(pathname, '/add-order'),
          position: 'top',
          role: ['admin', 'superadmin'],
        },
        {
          name: 'View Order',
          href: '/view-order',
          icon: <ReceiptIcon size={20} />,
          active: isNavItemActive(pathname, '/view-order'),
          position: 'top',
          role: ['admin', 'superadmin'],
        },
      ],
    },
    {
      name: 'Laporan',
      href: '/laporan',
      icon: <ChartAreaIcon size={20} />,
      active: isNavItemActive(pathname, '/laporan'),
      position: 'top', 
      role: 'superadmin',
    },
  ];
};