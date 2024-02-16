"use client";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import { useCallback, useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginModal = () => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      //name: '',
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

      signIn("credentials", {
        ...data,
        redirect: false,
      }).then((callback) => {
        setIsLoading(false);

        if (callback?.ok) {
          toast.success("Logged In");
          router.refresh();
          loginModal.onClose();
        }

        if (callback?.error) {
          toast.error(callback.error);
        }
      });
  };

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-3">
      <Heading title="Welcome back" subtitle="Login to your Account!" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <div className="w-full relative">
        <input
          id="password"
          {...register("password", { required: true })}
          placeholder=""
          type={showPassword ? "text" : "password"}
          className={`peer w-full p-4 pt-6 font-light border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
                ${errors["password"] ? "border-rose-500" : "border-neutral-300"}
                ${
                  errors["password"]
                    ? "focus:border-rose-500"
                    : "focus:border-black"
                }`}
        />
        <label
          className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 left-4 origin-[0] 
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4
                ${errors["password"] ? "text-rose-500" : "text-zinc-400"}
              `}
        >
          {"Password"}
        </label>
        <div
          className="absolute top-5 end-5 cursor-pointer 
        "
          onClick={() => {
            setShowPassword(!showPassword);
          }}
        >
          {showPassword ? (
            <FaEyeSlash size={24}/>
          ) : (
            <FaEye size={24}/>
          )}
        </div>
      </div>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn("github")}
      />
      <div className="text-neutral-500 dark:text-neutral-300 text-center mt-4 font-light">
        <p>
          First time using Airbnb?
          <span
            onClick={onToggle}
            className="text-neutral-800 dark:text-neutral-400 cursor-pointer hover:underline"
          >
            {" "}
            Create an account
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={() => {
        loginModal.onClose();
        reset();
      }}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
