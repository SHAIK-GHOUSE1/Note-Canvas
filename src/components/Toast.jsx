import {CheckCircle2, AlertCircle,Info} from "lucide-react";
export default function Toast({toasts}) {
    if (!toasts || toasts.length===0) return null;

    return (
        <div className="toast-container" role="status" aria-live="polite">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast ${toast.type || "info"}`}>
                    {toast.type === "success" && <CheckCircle2 size={16} />}
                    {toast.type === "error" && <AlertCircle size={16} />}
                    {(!toast.type || toast.type === "info") && <Info size={16} />}
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}