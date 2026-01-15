
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { CameraIcon, XMarkIcon, SpeakerWaveIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { analyzeFoodImage, generateHealthAudio, decodeAudio, decodeAudioData } from '../services/geminiService';
import { UserProfile, FoodAnalysis } from '../types';

interface ScannerProps {
  profile: UserProfile;
  onAnalysisComplete: (analysis: FoodAnalysis) => void;
}

const Scanner: React.FC<ScannerProps> = ({ profile, onAnalysisComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);

  // Robust Camera Startup
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsCapturing(true);

      // Force video element to update
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera Hardware Error:", err);
      alert("Hardware Error: Could not start camera. Check permissions in browser settings.");
    }
  };

  useEffect(() => {
    if (isCapturing && stream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
    }
  }, [isCapturing, stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    // Capture at high resolution for AI clarity
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL('image/jpeg', 0.85).split(',')[1];
    
    setIsAnalyzing(true);
    stopCamera();

    try {
      const result = await analyzeFoodImage(base64, profile);
      setAnalysis(result);
      onAnalysisComplete(result);
    } catch (err) {
      alert("NutriScan AI couldn't see the food clearly. Please try again with better lighting.");
      setAnalysis(null);
      setIsCapturing(false);
    } finally {
      setIsAnalyzing(false);
    }
  }, [profile, onAnalysisComplete]);

  // Decodes and plays the generated TTS audio for food analysis
  const speakAnalysis = async () => {
    if (!analysis || audioLoading) return;
    setAudioLoading(true);
    try {
      const audioBase64 = await generateHealthAudio(analysis.recommendation);
      if (audioBase64) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const decoded = decodeAudio(audioBase64);
        const buffer = await decodeAudioData(decoded, audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);
      }
    } catch (error) {
      console.error("TTS playback failed:", error);
    } finally {
      setAudioLoading(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6 bg-white">
        <div className="relative">
          <div className="w-24 h-24 border-b-4 border-emerald-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
              <ArrowPathIcon className="w-8 h-8 text-emerald-600 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">AI Cloud Analysis</h2>
          <p className="text-slate-400 text-sm font-medium">Identifying food and calculating nutrients...</p>
        </div>
      </div>
    );
  }

  if (analysis) {
    return (
      <div className="p-6 h-full overflow-y-auto space-y-6 bg-slate-50">
        <div className="flex justify-between items-center">
          <button onClick={() => setAnalysis(null)} className="p-3 bg-white shadow-sm rounded-2xl border border-slate-100">
            <XMarkIcon className="w-6 h-6 text-slate-600" />
          </button>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">Analysis Complete</span>
          <div className="w-10" />
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-800 leading-none">{analysis.name}</h3>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                analysis.rating === 'healthy' ? 'bg-emerald-100 text-emerald-700' :
                analysis.rating === 'moderate' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  analysis.rating === 'healthy' ? 'bg-emerald-500' :
                  analysis.rating === 'moderate' ? 'bg-orange-500' : 'bg-red-500'
                }`} />
                {analysis.rating} Choice
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-slate-800">{analysis.healthScore}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Score</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
             <p className="text-slate-600 text-sm leading-relaxed italic">"{analysis.summary}"</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Calories</span>
              <span className="font-black text-slate-800">{analysis.metrics.calories} <span className="text-[10px]">kcal</span></span>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Protein</span>
              <span className="font-black text-slate-800">{analysis.metrics.protein}g</span>
            </div>
          </div>

          <div className="space-y-3">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">NutriScan Advice</h4>
             <div className="bg-emerald-600 p-5 rounded-3xl text-white shadow-lg shadow-emerald-200">
                <p className="text-sm font-medium leading-relaxed">"{analysis.recommendation}"</p>
             </div>
          </div>
        </div>

        <div className="flex gap-4 pb-10">
          <button 
            onClick={speakAnalysis}
            disabled={audioLoading}
            className="flex-1 flex flex-col items-center gap-2 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-transform active:scale-95 disabled:opacity-50"
          >
            {audioLoading ? <ArrowPathIcon className="w-8 h-8 animate-spin" /> : <SpeakerWaveIcon className="w-8 h-8" />}
            {audioLoading ? 'Processing...' : 'Audio Advice'}
          </button>
          <button 
            onClick={() => setAnalysis(null)}
            className="flex-1 flex flex-col items-center gap-2 py-6 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-transform active:scale-95 shadow-lg shadow-emerald-100"
          >
            <CheckCircleIcon className="w-8 h-8" />
            Next Scan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-slate-900 overflow-hidden">
      {isCapturing ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="h-full w-full object-cover scale-x-[-1]"
        />
      ) : (
        <div className="h-full w-full bg-slate-800 flex flex-col items-center justify-center p-12 text-center space-y-8">
           <div className="w-32 h-32 bg-slate-700/50 rounded-full flex items-center justify-center border-2 border-slate-600/50 float">
              <CameraIcon className="w-14 h-14 text-slate-400" />
           </div>
           <div className="space-y-4">
              <h2 className="text-2xl font-black text-white tracking-tight">Ready to scan?</h2>
              <p className="text-slate-400 text-sm leading-relaxed">Point at a label, fruit, meal, or restaurant dish to get instant nutritional facts.</p>
           </div>
           <button 
             onClick={startCamera}
             className="w-full py-5 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-900/40 active:scale-95 transition-transform"
           >
             Initialize Lens
           </button>
        </div>
      )}

      {isCapturing && (
        <>
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="w-72 h-72 border-2 border-emerald-400/20 rounded-[3rem] relative bg-emerald-400/5 backdrop-blur-[2px]">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-emerald-500 rounded-tl-3xl -ml-2 -mt-2" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-emerald-500 rounded-br-3xl -mr-2 -mb-2" />
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,1)] animate-[scan_2.5s_ease-in-out_infinite]" />
            </div>
            <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mt-10 bg-slate-900/80 px-6 py-2 rounded-full border border-white/10">Scanning Real-time Feed</p>
          </div>

          <div className="absolute bottom-16 left-0 w-full px-12 flex justify-between items-center">
            <button onClick={stopCamera} className="p-5 bg-white/10 backdrop-blur-2xl rounded-full text-white border border-white/10 active:scale-90 transition-transform">
              <XMarkIcon className="w-7 h-7" />
            </button>
            <button 
              onClick={captureFrame}
              className="w-28 h-28 bg-white rounded-full p-2 border-[10px] border-slate-900 shadow-2xl active:scale-90 transition-all"
            >
              <div className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center">
                 <div className="w-10 h-10 bg-white rounded-xl rotate-45" />
              </div>
            </button>
            <div className="w-16" />
          </div>
        </>
      )}

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; opacity: 0.2; }
          50% { top: 100%; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Scanner;
