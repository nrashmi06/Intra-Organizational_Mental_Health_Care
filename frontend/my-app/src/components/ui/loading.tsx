import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-white/80">
      <div className="w-full max-w-md aspect-square">
        <DotLottieReact
          src="https://lottie.host/715e63f9-ea4c-41ec-aad4-b6b3fcdf5c0a/6WcEMMWJBD.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default Loading;
