import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "@/routes/AppRoutes";
import { AdminRoutes } from "@/routes/AdminRoutes";
import { HelmetProvider } from "react-helmet-async";
import { useAuthSessionBootstrap } from "@/features/auth-customer/hooks/useAuthSessionBootstrap";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthBootstrap() {
 useAuthSessionBootstrap();
 return null;
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
 return (
   <QueryClientProvider client={queryClient}>
     <BrowserRouter>
       <AuthBootstrap />
       <Routes>
         <Route path="/admin/*" element={<AdminRoutes />} />
         <Route path="/*" element={<AppRoutes />} />
       </Routes>
     </BrowserRouter>
   </QueryClientProvider>
 );
}

export default App;
