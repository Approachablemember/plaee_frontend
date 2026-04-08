import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-white">Prediction Market</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Markets
            </Link>
            <Link
              href="/crypto"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Crypto
            </Link>
            <Link
              href="/sports"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Sports
            </Link>
            <Link
              href="/politics"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Politics
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
