"use client";

import UsernameInput from "@/components/UsernameInput";
import Image from "next/image";
import logoImg from "@/app/icon.svg";
import PasswordInput from "@/components/PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  CreateUserValidator,
  TCreateUserValidator,
} from "@/lib/validators/create-user-validator";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { client } from "@/lib/client";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TCreateUserValidator>({
    resolver: zodResolver(CreateUserValidator),
  });

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const response = await client.auth.create.post({ username, password });

      if (response.error) {
        throw new Error(response.error.value.message);
      }

      return response.data;
    },
    onSuccess: (data) => {
      reset();
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  const onSubmit = ({ username, password }: TCreateUserValidator) => {
    createUser({ username, password });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Image src={logoImg} alt="logo" className="w-20" />
            <h1 className="text-3xl font-bold tracking-tight text-green-500">
              Otterchatting
            </h1>
          </div>
          <p className="text-zinc-500 text-sm">
            A private, self-destructing chat room.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-zinc-800 bg-zinc-900/5 p-6 backdrop-blur-md space-y-5"
        >
          <div className="space-y-2">
            <label className="flex items-center text-zinc-500 text-sm">
              Username
            </label>

            <UsernameInput
              register={register("username")}
              showRandom={true}
              setValue={setValue}
            />
            {errors.username && (
              <p className="text-red-500 text-xs">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-zinc-500 text-sm">
              Password
            </label>

            <PasswordInput register={register("password")} />

            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-zinc-200 text-black p-3 text- font-medium hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor-pointer disabled:opacity-50"
          >
            Create now
            {isPending && <Loader2 className="animate-spin size-4" />}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Page;
