import { useToast } from "@/hooks/use-toast";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts } = useToast();
  const { isBannerVisible } = useLayout();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport
        className={cn(
          "right-0 flex-col md:max-w-[420px] p-4 transition-all duration-300",
          // On mobile, position below Header (64px) + Banner (approx 36px)
          isBannerVisible ? "top-[80px]" : "top-[64px]",
          // On larger screens, standard top-0 is fine if it's in the corner,
          // but we'll keep it consistent
          "sm:top-9",
        )}
      />
    </ToastProvider>
  );
}
