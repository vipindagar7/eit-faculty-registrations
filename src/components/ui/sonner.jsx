"use client";

import { Toaster as Sonner } from "sonner";

function Toaster(props) {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      richColors
      closeButton
      toastOptions={{ style: { fontFamily: "var(--font-body)" } }}
      {...props}
    />
  );
}

export { Toaster };
