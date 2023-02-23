export default function FooterAdmin() {
  return (
    <div className="p-4 mx-auto px-4 bg-blue-600">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full">
            <div className="text-sm text-gray-600 font-semibold text-center">
              <div className="text-sm text-white font-semibold text-center">
                Copyright &copy; {new Date().getFullYear()}.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
