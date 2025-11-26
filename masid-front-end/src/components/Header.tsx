import React from "react";
import { Link } from "react-router"; // Use `next/link` if Next.js

export default function Header() {
  return (
    <header className="w-full bg-neutral-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">ShoeFit</h1>
      <nav className="flex gap-4">
        <ul className="flex gap-4">
        <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
        <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
        <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
      </ul>
      </nav>
    </header>
  );
}
