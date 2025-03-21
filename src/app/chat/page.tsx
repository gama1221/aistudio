"use client";

import { useState } from 'react';
import { useI18n } from '@/components/i18n-provider';
import { Send, Plus, Download, X } from 'lucide-react';
import ShareButtons from '@/components/share-buttons';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState('');
  interface ChatMessage {
    type: 'text' | 'image';
    content: string;
    prompt?: string;
    timestamp?: number;
    generationTime?: string;
  }

  const [modalImage, setModalImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const handleClearAll = () => {
    // Clear all timers first
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    // Reset all states atomically to ensure consistent UI update
    Promise.resolve().then(() => {
      setIsGenerating(false);
      setGenerationTime(0);
      setElapsedTime(0);
      setPrompt('');
      setUploadError('');
      setModalImage(null);
      setSelectedImage(null);
      setLastGeneratedImage(null);
      
      // Clear images and chat history last to ensure proper cleanup
      setGeneratedImages([]);
      setChatHistory([]);
    });

    // Clear file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    // Force immediate UI refresh
    requestAnimationFrame(() => {
      setGeneratedImages([]);
      setChatHistory([]);
    });
  };
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [lastGeneratedImage, setLastGeneratedImage] = useState<string | null>(null);

  const [uploadError, setUploadError] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError('');

    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      // Clear any existing error
      setUploadError('');
    };
    reader.onerror = () => {
      setUploadError('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationTime, setGenerationTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const handleSendPrompt = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    const startTime = Date.now();
    
    // Start the timer
    const interval = setInterval(() => {
      setElapsedTime((Date.now() - startTime) / 1000);
    }, 100);
    setTimerInterval(interval);
    
    // Add user prompt to chat history
    setChatHistory([...chatHistory, { type: 'text', content: prompt, timestamp: Date.now() }]);
    
    try {
      const apiEndpoint = `${process.env.NEXT_PUBLIC_GEMINI_API_BASE_URL}/models/${process.env.NEXT_PUBLIC_GEMINI_MODEL}:generateContent`;

      const imageToEdit = selectedImage || lastGeneratedImage;
      const requestBody = imageToEdit
        ? {
            contents: [{
              parts: [
                { inlineData: { data: imageToEdit.split(',')[1], mimeType: 'image/jpeg' } },
                { text: prompt }
              ]
            }],
            generationConfig: {
              responseModalities: ["Text", "Image"]
            }
          }
        : {
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              responseModalities: ["Text", "Image"]
            }
          };

      const response = await fetch(`${apiEndpoint}?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to generate/edit image');
      }

      const data = await response.json();
      const base64ImageData = data.candidates[0].content.parts[0].inlineData.data;
      const generatedImageUrl = `data:image/jpeg;base64,${base64ImageData}`;
      
      clearInterval(interval);
      setTimerInterval(null);
      const endTime = Date.now();
      const timeInSeconds = ((endTime - startTime) / 1000).toFixed(2);
      setGenerationTime(parseFloat(timeInSeconds));
      setChatHistory(prev => [...prev, { 
        type: 'image', 
        content: generatedImageUrl, 
        prompt: prompt, 
        generationTime: timeInSeconds 
      }]);
      setGeneratedImages(prev => [generatedImageUrl, ...prev]);
      setLastGeneratedImage(generatedImageUrl);
      setSelectedImage(null); // Clear selected image after editing
    } catch (error) {
      console.error('Error generating/editing image:', error);
      setChatHistory(prev => [...prev, { type: 'text', content: 'Failed to generate/edit image. Please try again.', timestamp: Date.now() }]);
    } finally {
      setIsGenerating(false);
      setElapsedTime(0);
    }
    
    setPrompt('');
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6 p-4 lg:p-6 w-full max-w-[2560px] mx-auto overflow-x-hidden">
      {/* Chat History Section */}
      <motion.section
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-[clamp(20%,25%,300px)] xl:w-[clamp(18%,22%,320px)] 2xl:w-[clamp(16%,20%,360px)] h-full overflow-y-auto rounded-lg p-4 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/30"
      >
        <h2 className="text-lg font-semibold mb-4">{t('chatHistory')}</h2>
        <div className="mb-4 text-sm text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-800/40 px-3 py-1.5 rounded-md border border-slate-700/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <line x1="10" y1="9" x2="8" y2="9"/>
            </svg>
            <span className="font-medium">{chatHistory.filter(msg => msg.type === 'text').length}</span>
            <span className="text-slate-400">{t('prompts')}</span>
          </div>
          {chatHistory.length > 0 && (
            <button
              onClick={handleClearAll}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              <span className="text-sm">{t('clear')}</span>
            </button>
          )}
        </div>
        <div className="space-y-2">
          {chatHistory.filter(msg => msg.type === 'text').map((msg, index) => (
            <div key={index}
                onClick={() => {
                  setPrompt(msg.content);
                  const input = document.querySelector('input[type="text"]');
                  if (input instanceof HTMLInputElement) input.focus();
                }}
                className="group bg-muted p-4 rounded-md shadow-sm hover:bg-muted/90 hover:scale-[1.02] hover:shadow-md cursor-pointer transition-all duration-300 ease-out border border-transparent hover:border-slate-700/50">
              <div className="space-y-2">
                <p className="text-slate-300 group-hover:text-white transition-colors duration-300">{msg.content}</p>
                {msg.timestamp && (
                  <p className="text-xs text-muted-foreground flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Main Chat Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full lg:w-[50%] xl:w-[56%] 2xl:w-[64%] flex flex-col h-full rounded-lg p-4 bg-gradient-to-br from-slate-800/30 via-slate-900/30 to-slate-800/30 backdrop-blur-sm border border-slate-700/20"
      >
        {/* Welcome Section */}
        {!selectedImage && chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-2 px-2">
            <Image
              src="/AiStudio.jpg"
              alt="AIStudio Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            />
            <h1 className="text-xl font-bold text-center">AIStudio</h1>
            <p className="text-center text-sm text-muted-foreground">
              Welcome to AIStudio! You can:
            </p>
            <div className="space-y-1 text-center text-sm">
              <p>1. Upload an image to edit</p>
              <p>2. Describe the image you want to generate</p>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Enter description or click examples below to start:
            </p>
            <div className="space-y-1.5 w-full max-w-sm">
              {[
                { text: "Create an adorable kitten playing with colorful yarn in a cozy sunlit room", icon: "🐱" },
                { text: "Design an enchanted garden with iridescent butterflies and magical glowing flowers", icon: "🌸" },
                { text: "Generate a breathtaking neon-lit metropolis with flying cars and holographic billboards", icon: "🌆" }
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setPrompt(example.text);
                    const input = document.querySelector('input[type="text"]');
                    if (input instanceof HTMLInputElement) input.focus();
                  }}
                  className="group w-full p-2.5 text-left rounded-lg bg-muted/60 hover:bg-muted/90 hover:scale-[1.01] hover:shadow-md transition-all duration-300 ease-out flex items-center gap-2.5 border border-transparent hover:border-slate-700/50"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">{example.icon}</span>
                  <span className="text-xs">{example.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Image Display Area */}
        {selectedImage && (
          <div className="mb-4 p-4 bg-muted rounded-lg shadow-sm">
            <div className="relative w-full max-h-[500px] rounded-lg mb-2 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage}
                alt="Selected"
                className="max-w-full max-h-[500px] object-contain rounded-lg cursor-pointer"
                onClick={() => handleImageClick(selectedImage)}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                  className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(selectedImage);
                  }}
                  className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  <Download className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            {uploadError && (
              <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
                {uploadError}
              </div>
            )}
            <p className="text-sm text-muted-foreground italic">Selected image ready for processing. Enter your prompt below.</p>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {chatHistory.map((msg, index) => {
            if (typeof msg.content !== 'string') return null;
            return (
              <div
                key={index}
                className={`flex ${msg.type === 'text' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${msg.type === 'text' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  {msg.type === 'text' ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-white">{msg.content}</p>
                        <button
                          onClick={() => setPrompt(msg.content)}
                          className="p-1 hover:bg-black/20 rounded-full transition-colors"
                          title="Reuse this prompt"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white/70 hover:text-white transition-colors"
                          >
                            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                            <path d="M21 3v5h-5"/>
                          </svg>
                        </button>
                      </div>
                      {msg.timestamp && (
                        <p className="text-xs text-white flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative w-full max-h-[400px] rounded-lg flex items-center justify-center overflow-hidden group">
                        <ShareButtons imageUrl={msg.content} />
                        <img
                          src={msg.content}
                          alt="Generated"
                          className="max-w-full max-h-[400px] object-contain rounded-lg cursor-pointer"
                          onClick={() => handleImageClick(msg.content)}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(msg.content);
                          }}
                          className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <Download className="h-4 w-4 text-white" />
                        </button>
                      </div>
                      {msg.generationTime && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground justify-end">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <span>{msg.generationTime}s</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Prompt Input Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-4 shadow-sm hover:bg-muted/80 transition-colors relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendPrompt();
                } else if (e.key === 'PageUp' || e.key === 'Prior' || e.keyCode === 33) {
                  e.preventDefault();
                  const textMessages = chatHistory.filter(msg => msg.type === 'text' && msg.content);
                  if (textMessages.length > 0) {
                    setPrompt(textMessages[textMessages.length - 1].content);
                  }
                }
              }}
              placeholder={t('promptInput')}
              className="flex-1 bg-transparent outline-none py-3 pr-24 text-foreground placeholder:text-muted-foreground"
            />
            <div className="absolute right-2 flex items-center gap-2">
              <label className="cursor-pointer p-2 hover:bg-background rounded-full transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Plus className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </label>
              <button
                onClick={handleSendPrompt}
                disabled={isGenerating}
                className={`flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all shadow-sm hover:shadow-md ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-1">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent" />
                    <span className="text-xs">{elapsedTime.toFixed(1)}s</span>
                  </div>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Image History Section */}
      <motion.section
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full lg:w-[clamp(20%,25%,300px)] xl:w-[clamp(18%,22%,320px)] 2xl:w-[clamp(16%,20%,360px)] h-full overflow-y-auto rounded-lg p-4 bg-gradient-to-tl from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-700/30"
      >
        <h2 className="text-lg font-semibold mb-4">{t('Image History')}</h2>
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span>Total Images: {generatedImages.length}</span>
        </div>
        <div className="space-y-4">
          {generatedImages.map((img, index) => {
            const imageMessage = chatHistory.find(msg => msg.type === 'image' && msg.content === img);
            return (
              <div key={index} className="group relative aspect-square hover:scale-[1.02] transition-transform bg-slate-700/20 rounded-lg p-1" onClick={() => handleImageClick(img)}>
                <p className="text-sm font-bold mb-2 px-1">{imageMessage?.prompt || `Generated Image ${index + 1}`}</p>
                <img
                  src={img}
                  alt={`Generated ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-sm cursor-zoom-in"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-between p-3">
                  <p className="text-sm text-white font-medium">Generated Image {index + 1}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(img);
                    }}
                    className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <Download className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center cursor-zoom-out"
          onClick={() => setModalImage(null)}
        >
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <img
                src={modalImage}
                alt="Full size"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    modalImage && handleDownload(modalImage);
                  }}
                >
                  <Download className="h-6 w-6 text-white" />
                </button>
                <button
                  className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  onClick={() => setModalImage(null)}
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}     
    </div>
  );
}