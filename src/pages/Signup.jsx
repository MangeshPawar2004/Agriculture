import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">
          Join BeejSeBazaar now 🌱
        </h2>
        <SignUp path="/signup" routing="path" afterSignUpUrl="/dashboard" />
      </div>
    </div>
  );
};

export default Signup;
