import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { Explorer } from "./components/explorer/Explorer";
import "./base.css";
createRoot(document.getElementById("root")!).render(
  <>
    <Explorer />
    <Toaster position="bottom-right" />
  </>,
);
