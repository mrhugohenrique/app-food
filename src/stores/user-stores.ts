import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserProps = {
  name: string;
  email: string;
  phone: string;
  CEP: string;
  city: string;
  neighborhood: string;
  address: string;
  number: string;
  complement: string;
};

type StateProps = {
  user: UserProps;
  save: (user: UserProps) => void;
};

export const useUserStore = create(
  persist<StateProps>(
    (set) => ({
      user: {
        name: "",
        email: "",
        phone: "",
        CEP: "",
        city: "",
        neighborhood: "",
        address: "",
        number: "",
        complement: "",
      },

      save: (user: UserProps) =>
        set((state) => ({
          ...state,
          user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            CEP: user.CEP,
            city: user.city,
            neighborhood: user.neighborhood,
            address: user.address,
            number: user.number,
            complement: user.complement,
          },
        })),
    }),
    {
      name: "app-food:user",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
