import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "@/routes/AppRoutes";
import { AdminRoutes } from "@/routes/AdminRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* مسارات المستخدم أو المسارات العامة */}
        <AppRoutes />
        
        {/* مسارات لوحة التحكم */}
        <AdminRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;