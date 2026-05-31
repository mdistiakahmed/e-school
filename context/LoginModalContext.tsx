"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { signIn } from "next-auth/react";
import LoginModal from "@/components/LoginModal";

type LoginModalOptions = {
  callbackUrl?: string;
  title?: string;
  description?: string;
};

type LoginModalContextValue = {
  openLoginModal: (options?: LoginModalOptions | string) => void;
  closeLoginModal: () => void;
};

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) {
    throw new Error("useLoginModal must be used within LoginModalProvider");
  }
  return ctx;
}

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("/");
  const [title, setTitle] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();

  const closeLoginModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openLoginModal = useCallback(
    (options?: LoginModalOptions | string) => {
      if (typeof options === "string") {
        setCallbackUrl(options);
        setTitle(undefined);
        setDescription(undefined);
      } else {
        setCallbackUrl(options?.callbackUrl ?? "/");
        setTitle(options?.title);
        setDescription(options?.description);
      }
      setIsOpen(true);
    },
    [],
  );

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <LoginModalContext.Provider value={{ openLoginModal, closeLoginModal }}>
      {children}
      <LoginModal
        isOpen={isOpen}
        onClose={closeLoginModal}
        onGoogleSignIn={handleGoogleSignIn}
        title={title}
        description={description}
      />
    </LoginModalContext.Provider>
  );
}
