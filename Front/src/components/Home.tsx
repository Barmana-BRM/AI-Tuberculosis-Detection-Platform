import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FileUpload } from './FileUpload';
import { ImageViewer } from './ImageViewer';
import { DataVisualizer } from './DataVisualizer';
import { ImageUp, Stethoscope } from 'lucide-react';
import clsx from 'clsx';
import {  useAnalysis } from './../utils/AnalysisContext';


function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>("imgs/default.png");
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProcessed, setShowProcessed] = useState(false);
  const { analysisData } = useAnalysis();



  const handleFileSelect = useCallback(async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);
    setIsProcessing(true);
  }, []);

  useEffect(() => {
    if (analysisData && analysisData.image) {
      setProcessedImage(`data:image/jpeg;base64,${analysisData.image}`);
      setIsProcessing(false);
    } else {
      setProcessedImage(null); 
    }
  }, [analysisData]);
  
  
  

  return (
    
    <div className="h-screen bg-gray-950 d-flex flex-col gap-1">
      <header className="bg-gray-900 shadow-sm h-20 flex items-center justify-between px-4">
        <div className="max-w-7xl px-4 py-4 flex items-center h-full">
          <Stethoscope className="w-8 h-8 text-blue-300 mr-3" />
          <h1 className="text-2xl font-bold text-white">X-ray Analysis</h1>
        </div>
        <button
            onClick={() => setOriginalImage(null)}
            className={clsx(
              'flex gap-2 items-center p-3 rounded-lg transition-all bg-gray-600 hover:bg-gray-700'
            )}
          >
            <span className={clsx(
              'text-sm text-gray-50 font-bold'
            )}>
              Load
            </span>
            <ImageUp size={20} className={clsx(
              'w-6 h-6 mb-1 text-gray-50'
            )} />
          </button>
      </header>

      <main style={{height:"calc(100vh - 80px)"}} className="w-screen mx-auto p-1">
        <div className="bg-gray-900 rounded-xl shadow-lg h-full flex gap-6 p-2">
          <ImageViewer
            originalImage={originalImage}
            processedImage={processedImage}
            isProcessing={isProcessing}
            showProcessed={showProcessed}
            onToggleView={() => setShowProcessed(!showProcessed)}
          />
          
         
            <DataVisualizer/>
          
        </div>
      </main>

      <AnimatePresence>
        {!originalImage && (
          <FileUpload onFileSelect={handleFileSelect} />
        )}
      </AnimatePresence>
    </div>
    
  );
}

export default Home;