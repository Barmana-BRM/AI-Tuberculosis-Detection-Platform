import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';

interface ImageViewerProps {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  showProcessed: boolean;
  onToggleView: () => void;
}

export function ImageViewer({ 
  originalImage, 
  processedImage, 
  isProcessing, 
  showProcessed,
  onToggleView 
}: ImageViewerProps) {
  return (
    <div className="relative h-full w-1/3 bg-gray-950 rounded-lg overflow-hidden p-2">
      {originalImage && (
        <div className="relative h-full flex items-center justify-center">
          <img
            src={showProcessed ? (processedImage || originalImage) : originalImage}
            alt="X-ray"
            className="h-auto w-full transform transition-transform duration-300 hover:scale-105 rounded"
          />
          {isProcessing && (
            <motion.div
              className="absolute top-0 left-0 w-full h-full border-blue-400 border-t-2 opacity-50"
              animate={{
                y: ["0%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
          {processedImage && (
            <button
              onClick={onToggleView}
              className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeftRight className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      )}
      {!originalImage && (
        <div className="h-full flex items-center justify-center">
          <p className="text-white/60">No image uploaded</p>
        </div>
      )}
      {originalImage == "imgs/default.png" && (
        <div className="h-full w-full flex items-center justify-center absolute left-0 top-0 bg-white/10 backdrop-blur-sm p-2 rounded">
      </div>
      )}
    </div>
  );
}