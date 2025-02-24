"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "首页", href: "/" },
  { name: "地址组管理", href: "/address-groups" },
  { name: "代币空投", href: "/airdrop" },
  { name: "交易记录", href: "/airdrops" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">
              Tron 空投工具
            </span>
          </div>
          <div className="flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-800 hover:text-blue-600"
                } px-1 py-2 text-sm font-medium`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
