import { useState } from "react";
import Toast from "./Toast";

interface ToastData {
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    duration?: number;
}

function ToastContainer() {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = (toast: Omit<ToastData, "id">) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { ...toast, id }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Global toast fonksiyonları
    (window as any).showToast = {
        success: (title: string, message: string, duration?: number) => 
            addToast({ type: "success", title, message, duration }),
        error: (title: string, message: string, duration?: number) => 
            addToast({ type: "error", title, message, duration }),
        warning: (title: string, message: string, duration?: number) => 
            addToast({ type: "warning", title, message, duration }),
        info: (title: string, message: string, duration?: number) => 
            addToast({ type: "info", title, message, duration })
    };

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
}

export default ToastContainer;
