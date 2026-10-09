import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useThemeStore } from "./stores/useThemeStore";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocketStore } from "./stores/useSocketStore";

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken]);


  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>


          {/*Public Routes*/}





          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/*Private Routes*/}

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatPage />} />
          </Route>


        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
