// components/Footer.js
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">+91 1234567891</span>
            </div>
            <div className="flex items-center gap-2">
              <span>SerenitySphere@gmail.com</span>
            </div>
            <p>Nitte, State Highway 1, Karkal, Karnataka 574110</p>
          </div>
          <div className="space-y-4 md:text-right">
            <div className="flex gap-4 md:justify-end">
              <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
              <Link href="/t&c" className="hover:underline">Terms of Service</Link>
              <Link href="/disclosure" className="hover:underline">Disclosure</Link>
            </div>
            <div className="flex gap-4 md:justify-end">
              <Link href="#" className="hover:text-gray-300">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          Copyright © 2024 Agencies Private Limited
        </div>
      </div>
    </footer>
  );
}
