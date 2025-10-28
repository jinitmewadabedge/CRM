import { useEffect } from "react";
import axios from "axios";

const useHeartbeat = (BASE_URL) => {
    useEffect(() => {
        const sendHeartbeat = async () => {

            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (!token) return;

            try {
                console.log("Sending heartbeat...");
                await axios.post(`${BASE_URL}/api/auth/heartbeat`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Heartbeat sent successfully");
            } catch (err) {
                console.warn("Heartbeat failed:", err.message);
            }
        };

        const startHeartbeat = setTimeout(() => {
            sendHeartbeat();

            const interval = setInterval(sendHeartbeat, 2 * 60 * 1000);

            return () => clearInterval(interval);
        }, 2000);

        return () => clearTimeout(startHeartbeat);
    }, [BASE_URL]);

};

export default useHeartbeat;
