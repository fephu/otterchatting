"use client";

import { useRef, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

interface PasswordInputProps {
  register: UseFormRegisterReturn;
}

const PasswordInput = ({ register }: PasswordInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [hasValue, setHasValue] = useState<boolean>(false);

  const { ref, onChange, ...rest } = register;

  const toggling = () => {
    setIsShow((prev) => !prev);

    requestAnimationFrame(() => {
      inputRef.current?.focus();

      const length = inputRef.current?.value.length || 0;
      inputRef.current?.setSelectionRange(length, length);
    });
  };

  return (
    <div className="relative flex items-center justify-between bg-zinc-950 border border-zinc-800 text-sm text-zinc-400 font-mono">
      <input
        {...rest}
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
        type={isShow ? "text" : "password"}
        className="focus:outline-none w-full p-3 bg-transparent"
        onChange={(e) => {
          onChange(e);
          setHasValue(e.target.value.length > 0);
        }}
      />

      {hasValue && (
        <button
          type="button"
          className="text-xs cursor-pointer hover:text-zinc-500 size-4 absolute right-3 bg-zinc-950"
          onClick={toggling}
          aria-label={isShow ? "Hide password" : "Show password"}
        >
          {isShow ? (
            <FaRegEyeSlash className="size-4 text-zinc-600" />
          ) : (
            <FaRegEye className="size-4 text-zinc-600" />
          )}
        </button>
      )}
    </div>
  );
};

export default PasswordInput;
