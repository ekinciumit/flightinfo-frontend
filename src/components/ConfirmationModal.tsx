import { useEffect } from "react";
import "./ConfirmationModal.css";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "warning" | "danger" | "info";
    onConfirm: () => void;
    onCancel: () => void;
}

function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = "Tamam",
    cancelText = "İptal",
    type = "warning",
    onConfirm,
    onCancel
}: ConfirmationModalProps) {
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case "warning": return "⚠️";
            case "danger": return "🚨";
            case "info": return "ℹ️";
            default: return "⚠️";
        }
    };

    const getConfirmButtonClass = () => {
        switch (type) {
            case "danger": return "btn-danger";
            case "info": return "btn-info";
            default: return "btn-warning";
        }
    };

    return (
        <div className="confirmation-overlay" onClick={onCancel}>
            <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
                <div className="confirmation-header">
                    <div className="confirmation-icon">
                        {getIcon()}
                    </div>
                    <h2 className="confirmation-title">{title}</h2>
                </div>
                
                <div className="confirmation-body">
                    <p className="confirmation-message">{message}</p>
                </div>
                
                <div className="confirmation-footer">
                    <button 
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button 
                        className={`btn ${getConfirmButtonClass()}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
