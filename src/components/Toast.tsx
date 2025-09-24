import { useState, useEffect } from "react";
import "./Toast.css";

export interface ToastProps {
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Toast'u göster
        const showTimer = setTimeout(() => setIsVisible(true), 100);
        
        // Otomatik kapanma
        const autoCloseTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(autoCloseTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose(id);
        }, 300);
    };

    const getIcon = () => {
        switch (type) {
            case "success": return "✅";
            case "error": return "❌";
            case "warning": return "⚠️";
            case "info": return "ℹ️";
            default: return "ℹ️";
        }
    };

    return (
        <div 
            className={`toast ${type} ${isVisible ? 'show' : ''} ${isLeaving ? 'leaving' : ''}`}
            onClick={handleClose}
        >
            <div className="toast-content">
                <div className="toast-icon">
                    {getIcon()}
                </div>
                <div className="toast-text">
                    <div className="toast-title">{title}</div>
                    <div className="toast-message">{message}</div>
                </div>
                <button 
                    className="toast-close"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                    }}
                >
                    ×
                </button>
            </div>
            <div className="toast-progress">
                <div 
                    className="toast-progress-bar"
                    style={{ animationDuration: `${duration}ms` }}
                ></div>
            </div>
        </div>
    );
}

export default Toast;
