import { Box, Container } from "@chakra-ui/react"
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useRecoilValue } from "recoil";

import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import BookmarkPage from "./pages/BookmarkPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation(); // using for dynamic width for diff pages

  return (
    <Box position={"relative"} w={"full"}>
      <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
        <Header />
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />

          <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />

          {/* Only show on ProfilePage and not on HomePage */}
          <Route
            path="/:username"
            element={user ? (
              <>
                <UserPage />
                <CreatePost />
              </>
            ) : (
              <UserPage />
            )}
          />

          <Route path="/:username/post/:pid" element={<PostPage />} />

          <Route path="/chat" element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />

          <Route path="/bookmarks" element={user ? <BookmarkPage /> : <Navigate to={"/auth"} />} />

          <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />

        </Routes>
      </Container>
    </Box>
  )
}

export default App
