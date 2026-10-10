'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2, Globe, Store, MessageSquare, Mail, Package, DollarSign } from 'lucide-react';
import { WebsiteScan, mockScans } from '../data/mockScans';
import { HoverBorderRay } from '../../command-center/components/HoverBorderRay';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function WebsiteIntelligence() {
  const [selectedScan, setSelectedScan] = useState<WebsiteScan | null>(
    mockScans.find(s => s.id === '6') || null
  );

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'elevated': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-[#171717] text-[#737373] border-[#292929]';
    }
  };

  const getRiskBarColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'elevated': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-[#404040]';
    }
  };

  return (
    <div className="flex flex-col h-full max-w-[1400px] mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-[#F5F5F5]">Website Scanning Intelligence (WSI)</h2>
        <p className="text-sm text-[#A3A3A3] mt-2 mb-8 max-w-3xl">
          Scans each merchant's storefront: product count, price band, whether the contact email is an official domain address (not a free Gmail/Yahoo-style address), and a look at social-media comments for off-business activity.
        </p>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar: Merchant List */}
          <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-2">
            {mockScans.map((scan) => {
              const isSelected = selectedScan?.id === scan.id;
              return (
                <button
                  key={scan.id}
                  onClick={() => setSelectedScan(scan)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2 relative overflow-hidden",
                    isSelected 
                      ? "bg-[#101010] border-[#737373] shadow-[0_4px_20px_rgba(255,255,255,0.03)]" 
                      : "bg-[#0A0A0A] border-[#292929] hover:border-[#404040] hover:bg-[#101010]"
                  )}
                >
                  {isSelected && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#737373]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="flex justify-between items-start w-full">
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-[#F5F5F5] truncate">{scan.name}</span>
                      <span className="text-xs text-[#737373] truncate font-mono mt-0.5">{scan.domain}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#A3A3A3] font-medium">{scan.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#F5F5F5]">{scan.riskScore}</span>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded border text-[9px] uppercase font-bold tracking-wider",
                        getRiskBadgeColor(scan.riskLevel)
                      )}>
                        {scan.riskLevel}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Details Panel */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {selectedScan && (
                <motion.div 
                  key={selectedScan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col space-y-6"
                >
                  
                  {/* Domain & Identity */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-[#0A0A0A] border border-[#292929] rounded-xl p-5 md:p-6 group relative overflow-hidden"
                  >
                    <HoverBorderRay />
                    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#292929] relative z-10">
                      <Globe className="w-4 h-4 text-[#737373]" />
                      <h3 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider">Domain & Identity</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-[#737373]">Domain</span>
                        <span className="text-sm font-mono text-[#F5F5F5]">{selectedScan.domain}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-[#737373]">Category</span>
                        <span className="text-sm text-[#F5F5F5]">{selectedScan.category}</span>
                      </div>
                      <div className="flex flex-col gap-1 md:col-span-2">
                        <div className="flex items-center gap-1.5 text-[#737373] mb-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">Contact Email</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-mono text-[#F5F5F5]">{selectedScan.contactEmail}</span>
                          {selectedScan.isOfficialEmail ? (
                            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                              <CheckCircle2 className="w-3 h-3" />
                              Official Domain
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                              <AlertTriangle className="w-3 h-3" />
                              Free Email
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Storefront Intelligence */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-[#0A0A0A] border border-[#292929] rounded-xl p-5 md:p-6 group relative overflow-hidden"
                  >
                    <HoverBorderRay />
                    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#292929] relative z-10">
                      <Store className="w-4 h-4 text-[#737373]" />
                      <h3 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider">Storefront Intelligence</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 divide-x divide-[#292929]">
                      <div className="flex flex-col gap-2 pr-6">
                        <div className="flex items-center gap-2 text-[#737373]">
                          <Package className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium uppercase tracking-wider">Products Listed</span>
                        </div>
                        <span className="font-mono text-xl text-[#F5F5F5]">{selectedScan.productsListed}</span>
                      </div>
                      <div className="flex flex-col gap-2 pl-6">
                        <div className="flex items-center gap-2 text-[#737373]">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium uppercase tracking-wider">Price Range</span>
                        </div>
                        <span className="font-mono text-xl text-[#F5F5F5]">{selectedScan.priceRange}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Social Signals */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-[#0A0A0A] border border-[#292929] rounded-xl p-5 md:p-6 group relative overflow-hidden"
                  >
                    <HoverBorderRay />
                    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#292929] relative z-10">
                      <MessageSquare className="w-4 h-4 text-[#737373]" />
                      <h3 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider">Social Signals</h3>
                    </div>
                    
                    <div className="flex flex-col">
                      {selectedScan.socialComments.map((comment, idx) => (
                        <div key={idx} className="flex gap-3 py-3 border-b border-[#292929] last:border-0 items-start">
                          <MessageSquare className="w-3.5 h-3.5 text-[#737373] shrink-0 mt-0.5" />
                          <span className="text-sm text-[#A3A3A3] leading-relaxed">{comment}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* WSI Risk Assessment */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="bg-[#101010] border border-[#292929] rounded-xl p-6 md:p-8 relative overflow-hidden group"
                  >
                    <HoverBorderRay />
                    {/* Background glow for high risk */}
                    {selectedScan.riskLevel !== 'low' && (
                      <div className={cn(
                        "absolute top-0 right-0 w-64 h-64 opacity-5 blur-3xl pointer-events-none",
                        selectedScan.riskLevel === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                      )} />
                    )}
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-[#737373]" />
                          <h3 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider">WSI Risk Assessment</h3>
                        </div>
                        <p className="text-sm text-[#A3A3A3] mt-1">Final intelligence correlation</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black font-mono tracking-tighter text-[#F5F5F5] leading-none">
                              {selectedScan.riskScore}
                            </span>
                            <span className="text-sm font-medium text-[#737373]">/ 100</span>
                          </div>
                        </div>
                        <div className={cn(
                          "px-3 py-1.5 rounded border text-[10px] uppercase font-bold tracking-wider",
                          getRiskBadgeColor(selectedScan.riskLevel)
                        )}>
                          {selectedScan.riskLevel} RISK
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative z-10 h-1.5 w-full bg-[#292929] rounded-full overflow-hidden mb-5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedScan.riskScore}%` }}
                        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                        className={cn("h-full rounded-full", getRiskBarColor(selectedScan.riskLevel))}
                      />
                    </div>

                    <div className="relative z-10 flex items-start gap-3 bg-[#0A0A0A] border border-[#292929] rounded-lg p-4">
                      {selectedScan.riskLevel === 'low' ? (
                        <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className={cn(
                          "w-5 h-5 shrink-0 mt-0.5",
                          selectedScan.riskLevel === 'critical' ? 'text-red-500' : 'text-yellow-500'
                        )} />
                      )}
                      <p className="text-sm text-[#F5F5F5] leading-relaxed font-medium">{selectedScan.riskMessage}</p>
                    </div>
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
