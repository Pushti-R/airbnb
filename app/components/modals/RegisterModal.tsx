"use client"

import useRegisterModal from "@/app/hooks/useRegisterModal";
import axios from "axios";
import { useCallback, useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from 'react-icons/fc'
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import { signIn } from "next-auth/react";
import useLoginModal from "@/app/hooks/useLoginModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { mailOptions, transporter } from "@/app/api/email/nodemailer";



const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register, handleSubmit, reset, formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    }); 
    const email = () => {
      return (
        <h1>Hello</h1>
      )
    }

    const onSubmit: SubmitHandler<FieldValues> = async(data) => {
        setIsLoading(true);
        // const response = await fetch('/api/send/', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(data)
        // })
        // if(response.status === 200){
        //   toast.success("Email sent")
        // }
        // await fetch('/api/email', {
        //   method: 'POST',
        //   body: JSON.stringify({
        //     firstName: data.firstName,
        //     email: data.email
        //   })
        // })   
        axios.post('/api/register', data).then(async() => {
            toast.success("Success")
            registerModal.onClose();
            reset();
            loginModal.onOpen();
        })
        .catch((error) => {
            toast.error(error.response.data.error);
            console.log(error);
        })
        .finally(() => {
            setIsLoading(false);
        })
        
    }

    const onToggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
      }, [registerModal, loginModal])

    const bodyContent = (
        <div className="flex flex-col gap-3">
            <Heading title="Welcome to Airbnb" subtitle="Create an Account!" />
            <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />
            <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required />
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
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
          <hr />
          <Button 
            outline 
            label="Continue with Google"
            icon={FcGoogle}
            onClick={() => signIn('google')} 
          />
          <Button 
            outline 
            label="Continue with Github"
            icon={AiFillGithub}
            onClick={() => signIn('github')}
          />
          <div className="text-neutral-500 dark:text-neutral-300 text-center mt-2 font-light">
            <p>Already have an account?
              <span onClick={onToggle} className="text-neutral-800 dark:text-neutral-400 cursor-pointer hover:underline"> Log in</span>
            </p>
          </div>
        </div>
      )

    return (
        <Modal disabled={isLoading} isOpen={registerModal.isOpen} title="Register" actionLabel="Continue" onClose={() => {registerModal.onClose(); reset();}} onSubmit={handleSubmit(onSubmit)} body={bodyContent} footer={footerContent} />
    )
}

export default RegisterModal