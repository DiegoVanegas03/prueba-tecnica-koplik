import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, type ReactNode } from "react";
import { Button } from "./ui/button";

export default function ResultsModal({
  children,
  open,
  setOpen,
  calificacion,
  setVisibleErrors,
}: {
  children: ReactNode;
  open: boolean;
  calificacion: number;
  setVisibleErrors: (visible: boolean) => void;
  setOpen: (open: boolean) => void;
}) {
  const estrellas = "⭐".repeat(Math.floor(calificacion / 20));
  function handlePressedButton() {
    setVisibleErrors(true);
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <div className="text-xl flex flex-col items-center justify-center gap-2">
            <DialogTitle>Tu calificacion es de {calificacion}/100</DialogTitle>
            <DialogDescription>Resultado de tu formulario.</DialogDescription>
            <p className="text-4xl">{estrellas}</p>
          </div>
        </DialogHeader>
        <Button onClick={handlePressedButton}>Ver errores.</Button>
      </DialogContent>
    </Dialog>
  );
}
