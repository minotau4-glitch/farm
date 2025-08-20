"use client";

import Protected from "@/components/auth/Protected";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleSignOut = async () => {
    await signOut(getFirebaseAuth());
  };

  return (
    <Protected>
      <div className="min-h-screen">
        <header className="flex items-center justify-between px-4 py-3 border-b border-black/10">
          <div className="font-semibold">App</div>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-black/5"
          >
            Sign out
          </button>
        </header>
        {children}
      </div>
    </Protected>
  );
}


