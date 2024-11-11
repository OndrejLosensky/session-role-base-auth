import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { IoArrowBackOutline } from "react-icons/io5";

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-neutral-100">
        <Link 
          href="/" 
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
        >
            <IoArrowBackOutline className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Home</span>
        </Link>
      <LoginForm />
    </div>
  );
}