import { useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useHeartbeat = (BASE_URL) => {
    const navigate = useNavigate();
    const stoppedRef = useRef(false);

    useEffect(() => {
        const forceLogout = () => {
            if (stoppedRef.current) return; // prevent multiple alerts
            stoppedRef.current = true;

            localStorage.clear();
            sessionStorage.clear();

            toast.error("Session expired. Please login again.", {
                autoClose: 4000,
            });

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1500);
        };

        const sendHeartbeat = async () => {
            const token =
                localStorage.getItem("token") || sessionStorage.getItem("token");

            if (!token) return;

            try {
                await axios.post(
                    `${BASE_URL}/api/auth/heartbeat`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } catch (err) {
                const status = err.response?.status;
                const message = err.response?.data?.message || "";

                if (
                    status === 401 ||
                    message.toLowerCase().includes("jwt expired") ||
                    message.toLowerCase().includes("session expired")
                ) {
                    forceLogout();
                }
            }
        };

        sendHeartbeat();
        const interval = setInterval(sendHeartbeat, 2 * 60 * 1000);

        return () => clearInterval(interval);
    }, [BASE_URL, navigate]);
};

export default useHeartbeat;
