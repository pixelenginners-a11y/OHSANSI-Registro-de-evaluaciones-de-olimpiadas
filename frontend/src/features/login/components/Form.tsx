import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Form = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }} = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const { login, loading, isError, isSuccess } = useLogin();

  useEffect(() => {
    if (isSuccess) {
      navigate({ to: '/admin' });
    }
  }, [isSuccess, navigate]);

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-80 px-3 space-y-4"
      noValidate
    >
      <div>
        <label className="block text-sm font-medium text-gray-600">Correo</label>
        <input
          type="email"
          {...register("email")}
          placeholder="ejemplo@gmail.com"
          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
        />
        {errors.email?.message && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Contraseña</label>
        <input
          type="password"
          {...register("password")}
          placeholder="********"
          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
        />
        {errors.password?.message && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {isError && (
        <p className="text-red-500 text-sm text-center">
          Correo o contraseña incorrectos. Por favor, intenta nuevamente.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
};