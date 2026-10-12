import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkSheetProvider } from "@/context/WorkSheetContext";
import Index from "./pages/Index";
import NewWork from "./pages/NewWork";
import WorkDetails from "./pages/WorkDetails";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WorkSheetProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/works" element={<Index />} />
            <Route path="/works/new" element={<NewWork />} />
            <Route path="/works/:id" element={<WorkDetails />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WorkSheetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
