'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const NavLink = ({ href, label }: { href: string; label: string }) => {
        const isActive = pathname === href;
        return (
            <Link href={href}>
                <button
                    className={`px-4 py-2 rounded-md transition-all duration-200
                        ${isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-blue-100'}
                    `}
                >
                    {label}
                </button>
            </Link>
        );
    };

    return (
        <nav className="flex items-center justify-between p-4 shadow-md mb-6 mt-10">
            <div className="flex gap-4">
                <NavLink href="/" label="Home" />
                {!user ? (
                    <>
                        <NavLink href="/login" label="Login" />
                        <NavLink href="/register" label="Register" />
                    </>
                ) : (
                    <>
                        <NavLink href="/books" label="Books" />
                        <NavLink href="/profile" label="Profile" />
                        <button
                            onClick={logout}
                            className="px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-200"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>

            {user && (
                <div className="text-sm text-gray-700">
                    Welcome, <span className="font-semibold">{user.name}</span>
                </div>
            )}
        </nav>
    );
}
