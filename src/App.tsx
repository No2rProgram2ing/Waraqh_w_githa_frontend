import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Login from '@/pages/Login'
// import Placeholder from '@/pages/Placeholder'
// import NotFound from '@/pages/NotFound'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "@/routes/AppRoutes";

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
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;


// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route
//           path="/signup"
//           element={<Placeholder title="إنشاء حساب جديد" />}
//         />
//         <Route
//           path="/forgot-password"
//           element={<Placeholder title="استعادة كلمة المرور" />}
//         />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//     </QueryClientProvider>
//   )
// }

// export default App
