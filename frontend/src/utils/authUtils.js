import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

export const checkTokenExpiration = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        if (decodedToken.exp < currentTime) {
            // Token has expired
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            Swal.fire({
                title: "Session Expired",
                text: "Your session has expired. Please log in again.",
                icon: "warning",
                customClass: {
                    container: "swal2-custom-z-index",
                },
            }).then(() => {
                window.location.href = "/";
            });
        }
    }
};
