import React, { useState } from "react";
import { studentAPI } from "../Services/api";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { toast, ToastContainer } from "react-toastify";
import {
  Camera,
  RefreshCcw,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ScannerPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scannerActive, setScannerActive] = useState(true);

  const handleScan = async (data) => {
    if (!data || loading) return;

    setLoading(true);
    setScannerActive(false);

    try {
      const res = await studentAPI.processScan(data);
      setResult(res.details);

      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      toast.success(res.message);

      setTimeout(() => {
        setResult(null);
        setScannerActive(true);
        setLoading(false);
      }, 5000); // 5 sec tak details dikhegi
    } catch (err) {
      toast.error(err.response?.data?.message || "Scan Failed");
      setLoading(false);
      setScannerActive(true);
    }
  };

  // Time format karne ke liye helper
  const formatTime = (timeStr) => {
    return new Date(timeStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center p-4 sm:p-8 font-sans">
      <ToastContainer theme="dark" position="top-center" autoClose={2000} />

      {/* Modern Header */}
      <header className="mb-8 w-full max-w-md">
        <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-md">
          <div>
            <h1 className="text-xl font-black text-blue-400 tracking-tight">
              CAMPUS SCAN
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                System Online
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="p-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition"
          >
            <RefreshCcw size={18} className="text-blue-400" />
          </button>
        </div>
      </header>

      {/* Scanner Section */}
      <div
        className={`relative w-full max-w-sm aspect-square rounded-[2.5rem] overflow-hidden border-4 transition-all duration-500 ${result ? "border-blue-500/20 scale-90 opacity-50" : "border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.2)]"}`}
      >
        {scannerActive ? (
          <BarcodeScannerComponent
            width="100%"
            onUpdate={(err, res) => {
              if (res) handleScan(res.text);
            }}
          />
        ) : (
          <div className="h-full w-full bg-slate-800 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-blue-400 tracking-widest">
                PROCESSING
              </p>
            </div>
          </div>
        )}
        {scannerActive && (
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_#3b82f6] animate-scanline"></div>
        )}
      </div>

      {/* Professional ID Card Result */}
      {result && (
        <div className="fixed inset-x-4 bottom-10 sm:relative sm:bottom-0 sm:inset-x-0 mt-8 w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-10 duration-500">
          {/* Top Status Bar */}
          <div
            className={`py-3 px-6 text-center text-white text-xs font-black uppercase tracking-[0.2em] ${result.newStatus === "IN" ? "bg-green-500" : "bg-red-500"}`}
          >
            {result.newStatus === "IN" ? "Entry Authorized" : "Exit Authorized"}
          </div>

          <div className="p-8">
            <div className="flex flex-col items-center">
              {/* Profile Image with Ring */}
              <div
                className={`relative p-1 rounded-full border-4 mb-4 ${result.newStatus === "IN" ? "border-green-100" : "border-red-100"}`}
              >
                <img
                  src={
                    result.imageUrl ||
                    "https://api.dicebear.com/7.x/avataaars/svg"
                  }
                  className="w-28 h-28 rounded-full object-cover shadow-lg"
                  alt="Student"
                />
                <div
                  className={`absolute bottom-1 right-1 p-1.5 rounded-full text-white shadow-md ${result.newStatus === "IN" ? "bg-green-500" : "bg-red-500"}`}
                >
                  {result.newStatus === "IN" ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                </div>
              </div>

              {/* Text Info */}
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight text-center leading-tight">
                {result.name}
              </h2>
              <div className="flex items-center gap-1 mt-1 text-blue-600 font-bold text-sm uppercase">
                <MapPin size={14} /> {result.branch}
              </div>

              <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="flex flex-col items-center border-r border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Time
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                    <Clock size={14} className="text-blue-500" />
                    {formatTime(result.time)}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Movement
                  </span>
                  <div
                    className={`font-black uppercase ${result.newStatus === "IN" ? "text-green-600" : "text-red-600"}`}
                  >
                    {result.newStatus === "IN" ? "Coming In" : "Going Out"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      {!result && (
        <div className="mt-auto py-6 text-center animate-pulse">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            Waiting for QR Code
          </p>
        </div>
      )}
    </div>
  );
};

export default ScannerPage;
