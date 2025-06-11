import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import authService from "../appwrite/authentication";
import { useOutletContext } from "react-router-dom";

function Login() {
  const { login, setLogin, updatePage, setupdatePage } = useOutletContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    authService.login(data).then((resp) => {
      setLogin(resp);
      setupdatePage((prev) => !prev);
      navigate("/");
    });
  };
  useEffect(() => {
    authService.getCurrentUser().then((resp) => {
      if (resp) {
        navigate("/");
      }
    });
  }, []);

  if (!login)
    return (
      <div className="fixed  inset-0 flex justify-center items-center min-h-screen">
        <div className="p-6 shadow-lg rounded-lg bg-gray-50 dark:bg-(--panelDark) dark:text-gray-100 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xl font-medium">Log In!</p>
          </div>
          <div className="h-[1px] w-full bg-black mb-4 dark:bg-gray-100"></div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                className={`border p-2 rounded w-full outline-none ${
                  errors.email ? "border-red-500" : ""
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                className={`border p-2 rounded w-full outline-none ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="cursor-pointer w-full bg-blue-600 text-gray-100 text-lg p-2 rounded mt-2 hover:bg-blue-700 transition-all"
            >
              Login
            </button>
            <div className="">
              <p>
                Create a new account ?{" "}
                <Link className="text-blue-500 font-semibold" to={"/signup"}>
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
}

export default Login;
