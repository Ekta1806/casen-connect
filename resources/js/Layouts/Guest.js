export default function Guest({ children }) {
    return (
        <div className="min-h-auto md:min-h-screen flex flex-col sm:justify-center items-center p-4 pt-6 sm:pt-0 bg-gray-50">
            <div className="w-full sm:max-w-md mt-0 md:mt-6 px-0 md:px-6 py-6 bg-transparent overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
