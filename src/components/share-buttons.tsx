'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Linkedin, Facebook, Twitter, Send } from 'lucide-react';

interface ShareButtonsProps {
  imageUrl: string;
}

export default function ShareButtons({ imageUrl }: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = async (platform: string) => {
    // Convert base64 to blob
    const fetchImage = async (base64: string) => {
      const response = await fetch(base64);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    };

    try {
      const blobUrl = await fetchImage(imageUrl);
      const shareData = {
        title: 'Check out this AI-generated image!',
        text: 'Created with AI Studio',
        url: blobUrl,
        files: [new File([await (await fetch(blobUrl)).blob()], 'ai-generated-image.jpg', { type: 'image/jpeg' })]
      };

      switch (platform) {
        case 'linkedin':
          const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Check out this AI-generated image!')}&summary=${encodeURIComponent('Created with AI Studio')}&source=${encodeURIComponent(window.location.origin)}`;
          window.open(linkedinShareUrl, '_blank', 'width=600,height=600');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blobUrl)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(blobUrl)}`, '_blank');
          break;
        case 'tiktok':
          try {
            await navigator.share({
              files: shareData.files,
              title: shareData.title,
              text: shareData.text
            });
          } catch (err) {
            // Fallback to copying the URL if sharing fails
            // navigator.clipboard.writeText(publicUrl);
            alert('Link copied! You can now share it on TikTok');
          }
          break;
        default:
          try {
            if (navigator.canShare && navigator.canShare(shareData)) {
              await navigator.share(shareData);
            } else {
              throw new Error('Sharing not supported');
            }
          } catch (err) {
            console.error('Error sharing:', err);
            // Fallback to copying the URL
            navigator.clipboard.writeText(blobUrl);
            alert('Link copied to clipboard!');
          }
      }

      // Cleanup
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error sharing image. Please try again.');
    }
  };

  return (
    <div className="absolute bottom-2 right-2 z-10">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/80 transition-colors"
        >
          <Share2 className="w-4 h-4 text-slate-200" />
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full right-0 mb-2 bg-slate-800/90 backdrop-blur-sm rounded-lg p-2 flex gap-2"
          >
            <button
              onClick={() => handleShare('linkedin')}
              className="p-2 rounded-full hover:bg-slate-700/80 transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-slate-200" />
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="p-2 rounded-full hover:bg-slate-700/80 transition-colors"
              title="Share on Facebook"
            >
              <Facebook className="w-4 h-4 text-slate-200" />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 rounded-full hover:bg-slate-700/80 transition-colors"
              title="Share on Twitter"
            >
              <Twitter className="w-4 h-4 text-slate-200" />
            </button>
            <button
              onClick={() => handleShare('tiktok')}
              className="p-2 rounded-full hover:bg-slate-700/80 transition-colors"
              title="Share on TikTok"
            >
              <Send className="w-4 h-4 text-slate-200" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}