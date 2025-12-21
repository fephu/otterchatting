"use client";

import { generateUsername } from "@/lib/username";
import { useRef, useState } from "react";
import { UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";

interface UsernameInputProps {
  register: UseFormRegisterReturn;
  setValue: UseFormSetValue<any>;
  showRandom?: boolean;
}

const UsernameInput = ({
  register,
  showRandom = false,
  setValue,
}: UsernameInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRandom, setIsRandom] = useState(false);

  const randomUsername = () => {
    const username = generateUsername();

    setValue(register.name, username, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsRandom(true);
  };

  const removeRandom = () => {
    setValue(register.name, "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsRandom(false);
  };

  return (
    <div className="relative flex items-center justify-between bg-zinc-950 border border-zinc-800 text-sm text-zinc-400 font-mono">
      <input
        {...register}
        ref={(e) => {
          register.ref(e);
          inputRef.current = e;
        }}
        className="focus:outline-none w-full p-3"
      />

      {showRandom && (
        <div className="absolute right-3">
          {isRandom ? (
            <button
              type="button"
              className="text-xs cursor-pointer hover:text-zinc-500"
              onClick={removeRandom}
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              className="text-xs cursor-pointer hover:text-zinc-500"
              onClick={randomUsername}
            >
              Randomly
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UsernameInput;
