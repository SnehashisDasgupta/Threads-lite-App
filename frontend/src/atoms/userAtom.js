import { atom } from "recoil";

const userAtom = atom({
    key: 'userAtom',
    // user will get navigate to home page once signed in or logged in
    default: JSON.parse(localStorage.getItem('user-threads')) || null
})

export default userAtom;