import { ANIMALS } from "@/constants";
import { nanoid } from "nanoid";

export const generateUsername = () => {
  const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];

  return `${word}-${nanoid(5)}`;
};
