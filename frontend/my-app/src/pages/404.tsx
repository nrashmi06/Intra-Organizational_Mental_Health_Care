import { ArrowLeft } from "lucide-react";
import Image from "next/image";

const NotFoundPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-2">
        <div className="w-full aspect-square max-w-md mx-auto">
          <Image
            src="/notfound.jpg"
            alt="404 illustration"
            className="w-full h-full object-contain"
            height={500}
            width={500}
          />
        </div>
        <p className="text-lg px-4">
          We can&apos;t seem to find the page you&apos;re looking for.
          Don&apos;t worry though - sometimes we all need a moment to find our way back.
        </p>
        <button
          onClick={handleGoBack}
          className="inline-flex items-center px-6 py-3 bg-white text-purple-600 hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
