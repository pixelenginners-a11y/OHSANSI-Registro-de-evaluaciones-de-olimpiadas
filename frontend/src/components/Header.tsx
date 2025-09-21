import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="bg-[#D62828] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="font-semibold">Olimpiadas UMSS 2025</div>
        <nav className="flex gap-6 text-sm">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{" "}
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
