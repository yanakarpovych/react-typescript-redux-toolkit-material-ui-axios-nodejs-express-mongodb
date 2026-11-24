import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./auth/Auth";
import Diaries from "./diaries/Diaries";
import Header from "./header/Header";
import Home from "./home/Home";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

export default function App() {
  const userId = useSelector((state: RootState) => state.auth.userId);

  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diaries" element={<Diaries />} />

          <Route
            path="/auth"
            element={userId ? <Navigate to="/diaries" replace /> : <Auth />}
          />

          <Route
            path="/add"
            element={
              userId ? <h1>Add a diary</h1> : <Navigate to="/auth" replace />
            }
          />

          <Route
            path="/profile"
            element={
              userId ? <h1>Profile</h1> : <Navigate to="/auth" replace />
            }
          />
        </Routes>
      </main>
    </>
  );
}
