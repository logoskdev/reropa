// src/components/Auth/AuthPage.jsx
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </h2>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <p className="text-center mt-4 text-sm">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-blue-500 underline"
          >
            {isLogin ? "Crear una" : "Iniciar sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
