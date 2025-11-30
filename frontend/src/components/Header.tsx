"use client";

import Link from "next/link";
import Image from "next/image";
import useUserProfile from "@/features/users/hooks/useUserProfile";
import { useState, useRef, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

const UserButtons = () => {
    const [userData, error, loading] = useUserProfile();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    console.log(loading)

    if (loading) {
        return <div className="w-32 h-10 bg-gray-100 animate-pulse rounded-xl" />;
    }

    if (!userData || error) {
        return (
            <>
                <Link
                    href="/sign-up"
                    className="cursor-pointer text-sm font-semibold text-primary hover:text-secondary transition"
                >
                    Sign Up
                </Link>
                <Link
                    href="/sign-in"
                    className="cursor-pointer bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-secondary transition font-semibold"
                >
                    Sign In
                </Link>
            </>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
            >
                <img
                    src={
                        userData?.profileImgUrl ||
                        "https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png"
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow"
                />
                <span className="text-sm font-semibold text-gray-700">
                    {userData?.name}
                </span>
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-40 bg-white shadow-lg rounded-xl p-2 flex flex-col text-sm z-50">
                    <Link
                        href="/profile"
                        className="px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        My profile
                    </Link>
                    <button
                        onClick={async () => { await apiClient.delete("auth/logout"); window.location.href = "/" }}
                        className="px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 hover:cursor-pointer transition text-left"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

const Header = () => {
    return (
        <header className="h-20 w-full bg-white shadow-md px-6 lg:px-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Link
                    href="/"
                    className="text-lg lg:text-xl font-family-garamond sm:w-auto w-32 font-semibold text-gray-800 hover:text-secondary transition"
                >
                    <Image src="/logo.svg" alt="logo" width={150} height={300} />
                </Link>
            </div>

            <div className="flex items-center space-x-6">
                <UserButtons />
            </div>
        </header>
    );
};

export default Header;

