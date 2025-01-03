"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function WelcomePage() {
  const router = useRouter();
  const role = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(role === "ADMIN" ? "/insights" : "/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [role, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-purple-100">
      <main className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="inline-block bg-gradient-to-r from-green-500 to-purple-600 text-transparent bg-clip-text">
                  Welcome to
                </span>
                <br />
                <span className="inline-block bg-gradient-to-r from-green-500 to-purple-600 text-transparent bg-clip-text">
                  SerenitySphere
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">
                A place where you will find a solution to all your problems!
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to the homepage in 2 seconds...
              </p>
            </div>

            <div className="w-full lg:w-1/2 max-w-lg lg:max-w-none">
              <div className="relative aspect-square">
                <Image
                  src="/welcome.svg"
                  alt="Decorative 3D shapes and coffee cup illustration"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}