import { useCallback, useState } from "react";
import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { identityService } from "@/services";
import { useAuthentication } from "@/states";
import { Icon } from "@iconify-icon/react";
import LogoIconGoogle from "@iconify-icons/logos/google-icon";
import SolarUserBold from "@iconify-icons/solar/user-bold";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent } from "@nextui-org/modal";
import queryString from "query-string";
import { toast } from "sonner";
import { buildUrl, sleep } from "@/lib/utils";
import { WebBrowser } from "@/lib/web-browser";
import { SignInWithProvider } from "@/services/types";
import { ModalComponentProps, useModalController } from ".";

export interface SignInMethodModalProps extends ModalComponentProps {}

export const SignInMethodModal = ({ isOpen, id, ...props }: SignInMethodModalProps) => {
  const { clearModalId } = useModalController();
  const [signingInWith, setSigningInWith] = useState<SignInWithProvider | null>(null);

  const { setUser: setCurrentUser } = useAuthentication();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSignInWith = useCallback(
    async (provider: SignInWithProvider) => {
      try {
        setSigningInWith(provider);
        await sleep(500);

        const callbackUrl = window.location.href;
        const redirectUrl = identityService.signInWithRedirect(provider, callbackUrl);
        const { linkingUrl } = await WebBrowser.open(redirectUrl, { center: true });
        const { query: queryParams } = queryString.parseUrl(linkingUrl);
        const { token } = queryParams || {};

        if (token) {
          const response = await identityService.SignInWithAsync(provider, token as string);

          if (!response.success) {
            console.log("Sign in failed:", response);
            toast.error(response.message);
            return;
          }

          console.log("User signed in:", response.data.userName);
          setCurrentUser(response.data);
          clearModalId();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSigningInWith(null);
      }
    },
    [clearModalId, setCurrentUser]
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        hideCloseButton={true}
        onOpenChange={(opened) => {
          if (!opened) clearModalId();
        }}
      >
        <ModalContent>
          <ModalBody>
            <div className="flex flex-col items-center text-center space-x-1 p-4 flex-initial">
              <div className="text-large font-semibold">Welcome to Pingu</div>
              <div className="text-sm text-default-500">
                Sign in to connect with your friends and family
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-3 gap-y-5 pb-4">
              <Button
                className="col-span-12"
                type="button"
                color="primary"
                variant="solid"
                startContent={<Icon icon={SolarUserBold} width="24" height="24" />}
                isDisabled={!!signingInWith}
                as={NextLink}
                href={buildUrl({
                  url: pathname,
                  query: Object.fromEntries(searchParams.entries()),
                  fragmentIdentifier: "sign-in"
                })}
              >
                Sign in with email or phone
              </Button>
              <Button
                className="col-span-12 light"
                type="button"
                color="default"
                variant="solid"
                startContent={
                  signingInWith != "Google" && <Icon icon={LogoIconGoogle} width="24" height="24" />
                }
                isDisabled={!!signingInWith}
                isLoading={signingInWith == "Google"}
                onPress={() => handleSignInWith("Google")}
              >
                Continue with Google
              </Button>
              <Button
                className="col-span-12"
                type="button"
                color="default"
                variant="flat"
                isDisabled={!!signingInWith}
                as={NextLink}
                href={buildUrl({
                  url: pathname,
                  query: Object.fromEntries(searchParams.entries()),
                  fragmentIdentifier: "sign-up"
                })}
              >
                Don&apos;t have an account? <span className="text-primary">Sign up</span>
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
