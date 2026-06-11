import React from "react";
import { motion } from "motion/react";
import { 
  Shield, 
  Zip, 
  Clock, 
  HelpCircle, 
  EyeOff, 
  Database, 
  Binary,
  Github,
  Linkedin,
  User,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

export default function InfoPage() {
  const specs = [
    {
      icon: <Binary className="w-5 h-5 text-orange-400" />,
      title: "100% Bit-Perfect",
      desc: "We deliver bite-by-bit identical files. ZIPs, images, and documents remain byte-perfect with zero compression."
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-400" />,
      title: "Ephemeral (24h limit)",
      desc: "Links are ephemeral by design. When the 24 hours expires, the file is completely purged automatically."
    },
    {
      icon: <EyeOff className="w-5 h-5 text-purple-400" />,
      title: "No Tracking",
      desc: "Shared directly with zero trackers. No user sign-ups or profile building required."
    },
    {
      icon: <Shield className="w-5 h-5 text-green-400" />,
      title: "Secure Transmission",
      desc: "Uploads are transmitted over modern protocol standards, isolated in encrypted transit channels."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 pb-24 relative px-6">
      {/* Background Decorative */}
      <div className="absolute top-12 left-1/4 w-[450px] h-[450px] bg-orange-500/[0.04] blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Header */}
      <div className="mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-white mb-6"
        >
          Info & Technical Details
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-neutral-400 text-base leading-relaxed"
        >
          EtherealShare maintains flawless original state transfers without cataloging or compressing your files.
        </motion.p>
      </div>

      {/* Developer info */}
      <div className="mb-16">
        <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-orange-400" />
          Developer
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center text-sm">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">Name:</span>
            <span className="text-neutral-400">Rehan97</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Github className="w-4 h-4 text-neutral-400" />
            <a href="https://github.com/ft976" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
              ft976
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Linkedin className="w-4 h-4 text-neutral-400" />
            <a href="https://www.linkedin.com/in/rehan-ahmad-863386382?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors truncate max-w-[200px]">
              LinkedIn Profile
            </a>
          </div>
        </div>
      </div>

      {/* Specs Specs - No Borders/Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-8 mb-16">
        {specs.map((spec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-4"
          >
            <div className="pt-1.5 shrink-0">
              {spec.icon}
            </div>
            
            <div className="text-left">
              <h3 className="font-display font-bold text-white text-base mb-2">{spec.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{spec.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Q&A Section - No Borders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-left"
      >
        <h2 className="text-xl font-display font-bold text-white mb-8 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-orange-400" />
          FAQ
        </h2>

        <div className="space-y-8">
          <div>
            <h4 className="text-sm font-bold text-white mb-2">How do files automatically expire?</h4>
            <p className="text-sm text-neutral-400 leading-relaxed">
              When you generate a sharing link, it automatically expires exactly 24 hours later. The server scrubs file listings continuously. Once the deadline crosses, the file is unlinked and deleted automatically.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-2">Is there a size limitation on files?</h4>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Files of any type up to 50MB are supported. There are no speed-clamping systems nor compressed bandwidth locks.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-2">How does the Device History tab function?</h4>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Successful link generations are safely cached in your local web browser's storage. This data never crosses back to our servers.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
