'use client';

import React, { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Globe, Store, Package, DollarSign, Mail, MessageSquare, ShieldAlert, Search, CircleDashed, ArrowRight } from 'lucide-react';
import { mockScans, WebsiteScan } from '../data/mockScans';
import { ScanNode } from './ScanNode';
import { ScanConnection } from './ScanConnection';
import { ScanCenter } from './ScanCenter';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Left-to-Right Desktop Composition
const scanStages = [
  { id: 'domain', label: 'Domain', description: 'Domain identity', icon: Globe, pos: { x: 100, y: 300 } },
  { id: 'storefront', label: 'Storefront', description: 'Site structure', icon: Store, pos: { x: 280, y: 300 } },
  { id: 'products', label: 'Products', description: 'Catalog analysis', icon: Package, pos: { x: 460, y: 300 } },
  { id: 'pricing', label: 'Pricing', description: 'Price band evaluation', icon: DollarSign, pos: { x: 900, y: 150 } },
  { id: 'contact', label: 'Contact', description: 'Identity verification', icon: Mail, pos: { x: 900, y: 300 } },
  { id: 'social', label: 'Social Signals', description: 'Off-business activity', icon: MessageSquare, pos: { x: 900, y: 450 } },
  { id: 'risk', label: 'Risk Assessment', description: 'Final intelligence', icon: ShieldAlert, pos: { x: 1120, y: 300 } },
];

const CORE_POS = { x: 680, y: 300 };

export function WebsiteScanner() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [idleIndex, setIdleIndex] = useState(0);
  const [scanProgressIndex, setScanProgressIndex] = useState(-1);
  const [finalResult, setFinalResult] = useState<WebsiteScan | null>(null);

  // Idle animation
  useEffect(() => {
    if (isScanning || finalResult) return;
    const interval = setInterval(() => {
      setIdleIndex((prev) => (prev + 1) % scanStages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isScanning, finalResult]);

  // Scan progression
  useEffect(() => {
    if (!isScanning) return;

    if (scanProgressIndex < scanStages.length) {
      // Speed up the correlation phase so they overlap visually
      let delay = 900;
      if (scanProgressIndex >= 3 && scanProgressIndex <= 5) {
        delay = 600; 
      }
      
      const timer = setTimeout(() => {
        setScanProgressIndex((prev) => prev + 1);
      }, delay);
      
      return () => clearTimeout(timer);
    } else if (scanProgressIndex === scanStages.length) {
      const match = mockScans.find(
        (s) =>
          s.domain.includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setFinalResult(match || mockScans[5]);
      
      const redirectTimer = setTimeout(() => {
        router.push('/website-scanning/details');
      }, 3500);
      return () => clearTimeout(redirectTimer);
    }
  }, [isScanning, scanProgressIndex, searchQuery, router]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalResult) {
      router.push('/website-scanning/details');
      return;
    }
    if (!searchQuery.trim() || isScanning) return;
    setIsScanning(true);
    setScanProgressIndex(0);
  };

  const activeIndex = isScanning ? scanProgressIndex : idleIndex;
  
  // Mapping connections for the left-to-right network
  const connections = [
    { id: 'c1', from: scanStages[0].pos, to: scanStages[1].pos, stageIndex: 0 }, // Domain -> Storefront
    { id: 'c2', from: scanStages[1].pos, to: scanStages[2].pos, stageIndex: 1 }, // Storefront -> Products
    { id: 'c3', from: scanStages[2].pos, to: CORE_POS, stageIndex: 2 }, // Products -> Core
    { id: 'c4', from: CORE_POS, to: scanStages[3].pos, stageIndex: 3, dur: 0.7 }, // Core -> Pricing
    { id: 'c5', from: CORE_POS, to: scanStages[4].pos, stageIndex: 4, dur: 0.9 }, // Core -> Contact
    { id: 'c6', from: CORE_POS, to: scanStages[5].pos, stageIndex: 5, dur: 1.1 }, // Core -> Social
    { id: 'c7', from: scanStages[3].pos, to: scanStages[6].pos, stageIndex: 6, dur: 1.0 }, // Pricing -> Risk
    { id: 'c8', from: scanStages[4].pos, to: scanStages[6].pos, stageIndex: 6, dur: 0.8 }, // Contact -> Risk
    { id: 'c9', from: scanStages[5].pos, to: scanStages[6].pos, stageIndex: 6, dur: 1.2 }, // Social -> Risk
  ];

  return (
    <div className="flex flex-col h-full w-full mx-auto p-4 md:p-8 space-y-8 items-center max-w-[1400px] overflow-y-auto overflow-x-hidden">
      
      {/* 1. INPUT AREA (Control Layer - always visible at the top) */}
      <div className="w-full max-w-2xl flex flex-col items-center text-center space-y-6 pt-4 md:pt-8 z-30">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#F5F5F5]">Website / Merchant URL Scanner</h1>
          <p className="text-sm text-[#A3A3A3] mt-2">
            Analyze a merchant website using RTMT Website Intelligence.
          </p>
        </div>
        
        <form onSubmit={handleScan} className="w-full bg-[#0A0A0A] border border-[#292929] rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center relative z-30">
          <div className="relative w-full flex-1 group">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] group-focus-within:text-[#F5F5F5] transition-colors" />
            <input
              type="text"
              placeholder="https://example-shop.com"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isScanning || finalResult !== null}
              className="w-full bg-[#101010] border border-[#292929] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#737373] transition-colors disabled:opacity-50 placeholder:text-[#404040]"
            />
          </div>
          
          <button
            type="submit"
            disabled={(!searchQuery.trim() && !finalResult) || isScanning}
            className={cn(
              "w-full sm:w-auto px-6 py-2.5 font-medium rounded-lg text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0",
              finalResult 
                ? "bg-[#101010] border border-[#292929] text-[#F5F5F5] hover:bg-[#1A1A1A]" 
                : "bg-[#F5F5F5] text-[#0A0A0A] hover:bg-white"
            )}
          >
            {isScanning ? (
              <>
                <CircleDashed className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
                Scanning...
              </>
            ) : finalResult ? (
              <>
                View Intelligence Report
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Scan Merchant
              </>
            )}
          </button>
        </form>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#292929] to-transparent my-2 opacity-50" />

      {/* 2. VISUALIZATION AREA (Intelligence Layer) */}
      
      {/* Mobile view (hidden on md and up) */}
      <div className="md:hidden flex flex-col w-full max-w-md z-10">
        <ScanCenter
          isScanning={isScanning}
          finalResult={finalResult}
          scanProgressIndex={scanProgressIndex}
          totalStages={scanStages.length}
          isMobile
        />

        <div className="flex flex-col gap-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[1px] before:bg-[#292929]">
          {scanStages.map((stage, i) => {
            const isCompleted = isScanning && i < scanProgressIndex;
            const isCurrent = isScanning ? i === scanProgressIndex : i === idleIndex;
            
            return (
              <ScanNode
                key={stage.id}
                id={stage.id}
                label={stage.label}
                description={stage.description}
                icon={stage.icon}
                isCurrent={isCurrent}
                isCompleted={isCompleted || finalResult !== null}
                finalRiskScore={finalResult?.riskScore}
                finalRiskLevel={finalResult?.riskLevel}
                isMobile
              />
            );
          })}
        </div>
      </div>

      {/* Desktop Left-to-Right Network View */}
      <div className="hidden md:block relative w-[1250px] h-[600px] z-10">
        
        {/* SVG Connections Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1250 600">
          {connections.map((conn) => {
            const isCompleted = isScanning && conn.stageIndex < scanProgressIndex || finalResult !== null;
            
            let isSignalActive = false;
            let isHighlighted = isCompleted;

            if (isScanning && !finalResult) {
              if (scanProgressIndex >= 3 && scanProgressIndex <= 5) {
                // Convergence phase: Core -> Pricing/Contact/Social
                if (conn.stageIndex >= 3 && conn.stageIndex <= 5) {
                  isSignalActive = true;
                  isHighlighted = true;
                }
              } else if (scanProgressIndex === 6) {
                // Final convergence: Pricing/Contact/Social -> Risk
                if (conn.stageIndex === 6) {
                  isSignalActive = true;
                  isHighlighted = true;
                }
              } else if (conn.stageIndex === scanProgressIndex) {
                isSignalActive = true;
                isHighlighted = true;
              }
            } else if (!isScanning && !finalResult && conn.stageIndex === idleIndex) {
              // Idle state random subtle pulse
              isSignalActive = true;
            }

            return (
              <ScanConnection
                key={conn.id}
                startX={conn.from.x}
                startY={conn.from.y}
                endX={conn.to.x}
                endY={conn.to.y}
                isHighlighted={isHighlighted}
                isSignalActive={isSignalActive}
                signalDuration={conn.dur || 0.8}
                prefersReducedMotion={prefersReducedMotion || false}
              />
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {scanStages.map((stage, i) => {
          let isCurrent = activeIndex === i;
          
          if (isScanning && !finalResult && scanProgressIndex >= 3 && scanProgressIndex <= 5) {
            if (i >= 3 && i <= 5) isCurrent = true;
          }

          const isCompleted = (isScanning && i < scanProgressIndex) || finalResult !== null;
          
          return (
            <ScanNode
              key={stage.id}
              id={stage.id}
              label={stage.label}
              description={stage.description}
              icon={stage.icon}
              isCurrent={isCurrent}
              isCompleted={isCompleted}
              position={stage.pos}
              finalRiskScore={finalResult?.riskScore}
              finalRiskLevel={finalResult?.riskLevel}
            />
          );
        })}

        {/* RTMT Intelligence Core Node */}
        <div 
          className="absolute z-20"
          style={{ left: CORE_POS.x, top: CORE_POS.y, transform: 'translate(-50%, -50%)' }}
        >
          <ScanCenter
            isScanning={isScanning}
            finalResult={finalResult}
            scanProgressIndex={scanProgressIndex}
            totalStages={scanStages.length}
          />
        </div>

      </div>
    </div>
  );
}
