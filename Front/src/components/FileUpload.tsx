import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useAnalysis } from "../utils/AnalysisContext";

interface FileUploadProps {
  onUploadComplete?: (response: any) => void;
  onFileSelect: (file: File) => Promise<void>;
}

export function FileUpload({
  onUploadComplete,
  onFileSelect,
}: FileUploadProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const { setAnalysisData } = useAnalysis();

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer.files;
      if (files?.[0]) {
        uploadFile(files[0]);
      }
    },
    [setAnalysisData]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files?.[0]) {
        setAnalysisData(null);
        uploadFile(files[0]);
      }
    },
    []
  );

  const uploadFile = async (file: File) => {
    setAnalysisData(null);
    const formData = new FormData();
    formData.append("image", file);
    onFileSelect(file);
    try {
      const response = await fetch("http://127.0.0.1:5000/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setAnalysisData({
          accuracy: data.accuracy,
          filename: data.filename,
          image: data.image,
          loss: data.loss,
          message: data.message,
        });
        onUploadComplete?.(data);
      } else {
        console.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("An error occurred during file upload.");
      console.error("Upload failed:", error);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 p-8 rounded-xl shadow-xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-200 mb-2">
            Upload X-ray Image
          </h3>
          <p className="text-sm text-white mb-4">
            Drag and drop your file here, or click to select
          </p>
          <input
            type="file"
            onChange={handleFileInput}
            accept="image/*"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Select File
          </label>
        </div>
      </motion.div>
    </motion.div>
  );
}
