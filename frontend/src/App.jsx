import { Button, Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from 'react-router-dom';

import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import { FiLogOut } from "react-icons/fi";
import useLogout from "./hooks/useLogout";

function App() {
  const user = useRecoilValue(userAtom);
  const logout = useLogout();

  return (
    <Container maxW='620px'>
      <Header />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />

        <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />

        {/* Only show on ProfilePage and not on HomePage */}
        <Route path="/:username" element={user ? (
          <>
            <UserPage />
            <CreatePost />
            {/* Logout button */}
            <Button position={"fixed"} bottom={8} right={5} size={{ base: "xs", sm: "sm" }} bg={"grey.300"}
              onClick={logout}
            >
              <FiLogOut size={20} />
            </Button>
          </>
        ) : (
          <UserPage />
        )} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
      </Routes>
    </Container>
  )
}

export default App
