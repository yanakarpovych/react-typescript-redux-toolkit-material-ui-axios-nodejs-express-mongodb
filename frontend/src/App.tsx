import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./auth/Auth";
import Add from "./diaries/Add";
import Diaries from "./diaries/Diaries";
import DiaryUpdate from "./diaries/DiaryUpdate";
import Header from "./header/Header";
import Home from "./home/Home";
import Profile from "./profile/Profile";
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
            element={userId ? <Add /> : <Navigate to="/auth" replace />}
          />

          <Route
            path="/profile"
            element={
              userId ? (
                <Profile key={userId} userId={userId} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="/post/:id"
            element={userId ? <DiaryUpdate /> : <Navigate to="/auth" replace />}
          />
        </Routes>
      </main>
    </>
  );
}