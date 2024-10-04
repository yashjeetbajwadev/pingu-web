"use client";

import { useEffect } from "react";
import { useAppearance } from "@/states";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { WebBrowser } from "@/lib/web-browser";
import { ModalController, ModalControllerProvider } from "@/components/modals";
import { ResetPasswordModal } from "@/components/modals/reset-password";
import { SignInMethodModal } from "@/components/modals/sign-in-method-modal";
import { SignInModal } from "@/components/modals/sign-in-modal";
import { SignUpModal } from "@/components/modals/sign-up-modal";
import { Toaster } from "@/components/toaster";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { activeTheme, systemTheme } = useAppearance();

  useEffect(() => {
    WebBrowser.notify();
  }, []);

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" forcedTheme={activeTheme} defaultTheme={systemTheme}>
        <ModalControllerProvider>
          {children}
          <ModalController id="sign-in" modal={SignInModal} />
          <ModalController id="sign-in-method" modal={SignInMethodModal} />
          <ModalController id="sign-up" modal={SignUpModal} />
          <ModalController id="reset-password" modal={ResetPasswordModal} />
        </ModalControllerProvider>
        <Toaster />
      </NextThemesProvider>
    </NextUIProvider>
  );
};
