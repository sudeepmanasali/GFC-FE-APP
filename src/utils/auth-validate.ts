import { jwtDecode } from "jwt-decode";

export function validateTokenAge() {
    let user: any, jwt: string;
    jwt = localStorage.getItem("token") || "";
    user = jwtDecode(jwt);

    const expDate = new Date(user.exp * 1000);
    const curr = new Date();
    if (expDate.getTime() - curr.getTime() > 0) {
        localStorage.clear();
        return true;
    }
    return false;
}

export default function useAuthListener() {
    let user: any, jwt;
    try {
        jwt = localStorage.getItem("token") || "";
        user = jwtDecode(jwt);
    } catch (error) {
        user = null;
    }
    return { user, jwt };
}
