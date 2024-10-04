"use client";

import { useEffect } from "react";
import { Button } from "@nextui-org/button";
import { useModalController } from "@/components/modals";
import { useAuthentication } from "@/states";

function Site() {
  const { user: currentUser, clearUser } = useAuthentication();
  const { setModalId, clearModalId } = useModalController();

  const handleLogout = () => {
    clearUser();
  };

  useEffect(() => {
    if (!currentUser) {
      setModalId("sign-in-method");
    } else {
      clearModalId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className={`flex-1 flex flex-col items-center justify-center px-4 py-8 h-full`}>
      <div className={`rounded-lg shadow-lg p-6 w-full max-w-md`}>
        <p className="text-2xl font-semibold mb-6 text-center">User Profile</p>
        <div className="space-y-4">
          <p className="text-lg">
            <span className="font-bold">Name:</span> {currentUser.firstName} {currentUser.lastName}
          </p>
          <p className="text-lg">
            <span className="font-bold">Username:</span> {currentUser.userName}
          </p>
          <p className="text-lg">
            <span className="font-bold">Email:</span> {currentUser.email || "No email provided"}
          </p>
          <p className="text-lg">
            <span className="font-bold">Phone:</span>{" "}
            {currentUser.phoneNumber || "No phone number provided"}
          </p>
          <p className="text-lg">
            <span className="font-bold">Email Confirmed:</span>{" "}
            {currentUser.emailConfirmed ? "Yes" : "No"}
          </p>
          <p className="text-lg">
            <span className="font-bold">Phone Confirmed:</span>{" "}
            {currentUser.phoneNumberConfirmed ? "Yes" : "No"}
          </p>
          <p className="text-lg">
            <span className="font-bold">Roles:</span> {currentUser.roles.join(", ")}
          </p>
          <p className="text-lg">
            <span className="font-bold">Password Configured:</span>{" "}
            {currentUser.passwordConfigured ? "Yes" : "No"}
          </p>
        </div>
      </div>
      <Button onPress={handleLogout} className="mt-6 rounded-full shadow-lg" color="danger">
        Sign Out
      </Button>
    </div>
  );
}

export default Site;
