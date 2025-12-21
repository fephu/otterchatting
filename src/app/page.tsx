"use client";

import Image from "next/image";
import { Suspense } from "react";
import logoImg from "@/app/icon.svg";

import Link from "next/link";

const Page = () => {
  return (
    <Suspense fallback={null}>
      <Lobby />
    </Suspense>
  );
};

function Lobby() {
  return (
    <main className="flex min-h-screen">
      <div className="w-full flex flex-col items-center justify-center space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Image src={logoImg} alt="logo" className="w-20" />
            <h1 className="text-3xl font-bold tracking-tight text-green-500">
              otterchatting
            </h1>
          </div>
          <p className="text-zinc-500 text-sm">
            A private, self-destructing chat room.
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-md w-full">
          <Link href={"/login"}>
            <button className="bg-zinc-200 text-zinc-800 hover:bg-zinc-100 w-full h-12 font-medium cursor-pointer">
              Login
            </button>
          </Link>

          <Link href={"/sign-up"}>
            <button className="bg-zinc-900 hover:bg-zinc-900/90 w-full h-12 cursor-pointer">
              Create an account in seconds
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Page;
