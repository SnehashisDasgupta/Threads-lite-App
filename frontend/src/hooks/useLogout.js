import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";

const useLogout = () => {
    const setUser = useRecoilState(userAtom);
    const showToast = useShowToast();

    const logout = async () => {
        try {
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            
            //"User logged out successfully" is not an error, it ends up going in if-loop and returning without clearing localStorage and setUser(null)
            if(data.error && data.error !== "User logged out successfully"){
                // user-defined toast
                showToast("Error", data.error, "error");
                return;
            }

            localStorage.removeItem("user-threads");
            setUser(null);

        } catch (error) {
            showToast("Error", error, "error");
        }
    };

    return logout;
}

export default useLogout