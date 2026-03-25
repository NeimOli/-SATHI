export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-2">भान्साSATHI</h3>
            <p className="text-gray-400 text-sm">Your cooking community for sharing delicious recipes</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-400">
              <span>© 2024 भान्साSATHI</span>
              <span>•</span>
              <span>Made with ❤️ for food lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
