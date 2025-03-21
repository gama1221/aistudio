"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const backgrounds = [
    '/backgrounds/neural-network.svg',
    '/backgrounds/transform-wave.svg',
    '/backgrounds/floating-brush.svg',
    '/backgrounds/color-palette.svg',
    '/backgrounds/ai-art-transform.svg',
    '/backgrounds/ai-morphing.svg',
    '/backgrounds/style-transfer.svg',
    '/backgrounds/image-enhance.svg',
    '/backgrounds/style-blending.svg',
    '/backgrounds/color-harmonization.svg',
    '/backgrounds/artistic-filter.svg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center relative z-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBgIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="relative w-full h-full"
            >
              <Image
                src={backgrounds[currentBgIndex]}
                alt="AI Image Transformation"
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-white mb-6"
        >
          Transform Your Ideas Into Art
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-300 mb-8"
        >
          Create, Edit, and Transform Images with AI
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => router.push('/chat')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all"
        >
          Chat Now
        </motion.button>
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 bg-slate-900/80 backdrop-blur-sm z-50 py-4 border-b border-slate-700/30">
        <div className="container mx-auto px-4 flex justify-center space-x-8">
          <button onClick={() => scrollToSection('use-cases')} className="text-slate-300 hover:text-white transition-colors">Use Cases</button>
          <button onClick={() => scrollToSection('how-to-use')} className="text-slate-300 hover:text-white transition-colors">How to Use</button>
          <button onClick={() => scrollToSection('terms')} className="text-slate-300 hover:text-white transition-colors">Terms</button>
          <button onClick={() => scrollToSection('privacy')} className="text-slate-300 hover:text-white transition-colors">Privacy</button>
          <button onClick={() => scrollToSection('blog')} className="text-slate-300 hover:text-white transition-colors">Blog</button>
        </div>
      </nav>

      {/* How to Use Section */}
      <section id="how-to-use" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">How to Use</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-700/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <div className="text-4xl font-bold text-blue-500 mb-4">1</div>
              <h3 className="text-xl font-semibold text-white mb-4">Enter Your Prompt</h3>
              <p className="text-slate-300">
                Describe the image you want to create in detail. Be specific about style, mood, colors, and composition for best results.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-700/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <div className="text-4xl font-bold text-blue-500 mb-4">2</div>
              <h3 className="text-xl font-semibold text-white mb-4">Generate or Upload</h3>
              <p className="text-slate-300">
                Click generate to create a new image from your prompt, or upload an existing image to edit and transform it.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-700/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <div className="text-4xl font-bold text-blue-500 mb-4">3</div>
              <h3 className="text-xl font-semibold text-white mb-4">Refine & Download</h3>
              <p className="text-slate-300">
                Fine-tune your results with additional prompts, save your favorite generations, or download them for use in your projects.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Use Cases</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-700/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <Image src="/icons/content-creation.svg" alt="Content Creation Icon" width={48} height={48} className="mb-4 text-white transform transition-all duration-300 hover:scale-110 hover:filter hover:drop-shadow-[0_0_8px_rgba(79,70,229,0.5)] motion-safe:animate-pulse" />
              <h3 className="text-xl font-semibold text-white mb-4">Content Creation</h3>
              <ul className="text-slate-300 space-y-2">
                <li>Generate unique marketing materials and promotional content</li>
                <li>Create custom blog and article illustrations</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-700/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <Image src="/icons/design-art.svg" alt="Design and Art Icon" width={48} height={48} className="mb-4 text-white transform transition-all duration-300 hover:scale-110 hover:filter hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] motion-safe:animate-pulse" />
              <h3 className="text-xl font-semibold text-white mb-4">Design and Art</h3>
              <ul className="text-slate-300 space-y-2">
                <li>Assist in generating design concepts and variations</li>
                <li>Explore new artistic styles and inspiration</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-700/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <Image src="/icons/ecommerce.svg" alt="E-commerce Icon" width={48} height={48} className="mb-4 text-white transform transition-all duration-300 hover:scale-110 hover:filter hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] motion-safe:animate-pulse" />
              <h3 className="text-xl font-semibold text-white mb-4">E-commerce</h3>
              <ul className="text-slate-300 space-y-2">
                <li>Generate high-quality product images and variations</li>
                <li>Create virtual try-on experiences</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-slate-700/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <Image src="/icons/entertainment.svg" alt="Entertainment Icon" width={48} height={48} className="mb-4 text-white transform transition-all duration-300 hover:scale-110 hover:filter hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] motion-safe:animate-pulse" />
              <h3 className="text-xl font-semibold text-white mb-4">Entertainment</h3>
              <ul className="text-slate-300 space-y-2">
                <li>Generate game assets and characters</li>
                <li>Create storyboards and concept art</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-slate-700/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <Image src="/icons/personalization.svg" alt="Personalization Icon" width={48} height={48} className="mb-4 text-white transform transition-all duration-300 hover:scale-110 hover:filter hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] motion-safe:animate-pulse" />
              <h3 className="text-xl font-semibold text-white mb-4">Personalization</h3>
              <ul className="text-slate-300 space-y-2">
                <li>Create customized gift portraits and artwork</li>
                <li>Generate unique social media avatars</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-slate-700/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <Image src="/icons/education.svg" alt="Education Icon" width={48} height={48} className="mb-4 text-white transform transition-all duration-300 hover:scale-110 hover:filter hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] motion-safe:animate-pulse" />
              <h3 className="text-xl font-semibold text-white mb-4">Education</h3>
              <ul className="text-slate-300 space-y-2">
                <li>Produce visual aids for educational materials</li>
                <li>Generate training simulation images</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-slate-700/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <Image src="/icons/accessibility.svg" alt="Accessibility Icon" width={48} height={48} className="mb-4 text-white transform transition-all duration-300 hover:scale-110 hover:filter hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.5)] motion-safe:animate-pulse" />
              <h3 className="text-xl font-semibold text-white mb-4">Accessibility</h3>
              <ul className="text-slate-300 space-y-2">
                <li>Generate images from textual descriptions</li>
                <li>Create custom visuals for learning needs</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="bg-slate-700/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <h3 className="text-xl font-semibold text-white mb-4">R&D</h3>
              <ul className="text-slate-300 space-y-2">
                <li>Visualize prototypes and concepts</li>
                <li>Create complex data visualizations</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Terms Section */}
      <section id="terms" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Terms of Service</h2>
          <div className="bg-slate-700/30 p-8 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-4">Usage Guidelines</h3>
            <p className="text-slate-300 mb-4">By using our service, you agree to comply with our terms and conditions.</p>
            <h3 className="text-xl font-semibold text-white mb-4">Content Policy</h3>
            <p className="text-slate-300">Users are responsible for the content they generate and must comply with our content guidelines.</p>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Privacy Policy</h2>
          <div className="bg-slate-700/30 p-8 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-4">Data Collection</h3>
            <p className="text-slate-300 mb-4">We collect and process data in accordance with GDPR and other applicable privacy laws.</p>
            <h3 className="text-xl font-semibold text-white mb-4">Data Security</h3>
            <p className="text-slate-300">Your data is encrypted and stored securely on our servers.</p>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Latest Updates</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.article
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-700/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Introducing New Features</h3>
              <p className="text-slate-300">Explore our latest AI image generation capabilities and improvements.</p>
            </motion.article>
            <motion.article
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-700/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Tips & Tricks</h3>
              <p className="text-slate-300">Learn how to get the most out of our AI image generation tools.</p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 border-t border-slate-700/30">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2025 AIStudio. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}