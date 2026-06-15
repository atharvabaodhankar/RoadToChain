"use client";

import React, { useState, useEffect, useRef } from 'react';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'mined' | 'failed';
}

interface Block {
  id: number;
  hash: string;
  prevHash: string;
  transactions: Transaction[];
  timestamp: number;
  nonce: number;
  miner: string;
}

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  text: string;
}

export default function VisualBlockchainSimulator() {
  const [chain, setChain] = useState<Block[]>([]);
  const [mempool, setMempool] = useState<Transaction[]>([]);
  const [mining, setMining] = useState(false);
  const [newTx, setNewTx] = useState({ from: 'Alice', to: 'Bob', amount: 10 });
  const [brokenChain, setBrokenChain] = useState(false);
  const [tamperConfirmId, setTamperConfirmId] = useState<number | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const chainScrollRef = useRef<HTMLDivElement>(null);

  const getFormattedTime = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const addLog = (text: string, level: 'info' | 'warn' | 'error' | 'success' = 'info') => {
    setLogs(prev => [...prev, { timestamp: getFormattedTime(), level, text }]);
  };

  // Determinisic hash helper for simulation
  const makeHash = (data: string): string => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data.charCodeAt(i)) & 0xffffffff;
    }
    const hex = Math.abs(hash).toString(16).padStart(6, '0');
    return "00" + hex.slice(0, 4);
  };

  const createGenesis = () => {
    const genesis: Block = {
      id: 0,
      hash: '00a2f1',
      prevHash: '000000',
      transactions: [],
      timestamp: Date.now() - 300000,
      nonce: 0,
      miner: 'GENESIS'
    };
    setChain([genesis]);
    setLogs([
      { timestamp: getFormattedTime(), level: 'info', text: 'INIT: genesis ready (hash: 00a2f1)' },
      { timestamp: getFormattedTime(), level: 'success', text: 'AUDIT: consensus layer online' }
    ]);
  };

  useEffect(() => {
    if (chain.length === 0) {
      createGenesis();
    }
  }, []);

  // Auto-scroll terminal log to bottom locally when logs update
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Scroll chain to right when new blocks are mined
  useEffect(() => {
    if (chainScrollRef.current && chain.length > 1) {
      chainScrollRef.current.scrollTo({
        left: chainScrollRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [chain.length]);

  const addTransaction = () => {
    if (!newTx.from || !newTx.to || newTx.amount <= 0) {
      addLog('TX_INJECT_ERR: invalid parameters (check sender, receiver, and amount)', 'error');
      return;
    }

    const tx: Transaction = {
      id: Math.random().toString(36).substring(7),
      from: newTx.from,
      to: newTx.to,
      amount: newTx.amount,
      timestamp: Date.now(),
      status: 'pending'
    };

    setMempool(prev => [...prev, tx]);
    addLog(`TX_INJECT: added to mempool (${tx.from} -> ${tx.to}, ${tx.amount.toFixed(2)} ETH, tx_id: ${tx.id})`, 'info');
  };

  const mineBlock = () => {
    if (mempool.length === 0) {
      addLog('POW_ERR: cannot mine block (mempool is empty)', 'error');
      return;
    }

    setMining(true);
    addLog('POW_MINE: mining started... solving cryptographic puzzle (target: 00XXXX)', 'info');

    setTimeout(() => {
      const lastBlock = chain[chain.length - 1];
      const blockData = JSON.stringify({
        prevHash: lastBlock.hash,
        transactions: mempool,
        timestamp: Date.now()
      });

      let nonce = 0;
      let hash = '';
      do {
        nonce++;
        hash = makeHash(blockData + nonce);
      } while (!hash.startsWith('00') && nonce < 5000);

      const newBlock: Block = {
        id: chain.length,
        hash,
        prevHash: lastBlock.hash,
        transactions: [...mempool.map(tx => ({ ...tx, status: 'mined' as const }))],
        timestamp: Date.now(),
        nonce,
        miner: 'MINER_NODE_' + Math.floor(Math.random() * 900 + 100)
      };

      setChain(prev => [...prev, newBlock]);
      setMempool([]); // Clear mempool
      setMining(false);
      addLog(`BLOCK_MINED: resolved block #${newBlock.id} (nonce: ${nonce}, hash: ${newBlock.hash})`, 'success');
    }, 1500);
  };

  const confirmTamper = (blockId: number) => {
    if (blockId === 0) {
      addLog("TAMPER_ERR: genesis block is immutable", "error");
      setTamperConfirmId(null);
      return;
    }

    addLog(`SECURITY_ALERT: external database modification triggered on block #${blockId}`, 'warn');

    setTimeout(() => {
      setChain(prev => {
        const copy = [...prev];
        const block = { ...copy[blockId] };
        const txs = [...block.transactions];
        
        if (txs.length > 0) {
          const tx = { ...txs[0] };
          const originalAmount = tx.amount;
          tx.amount = 999999; // Rogue amount injection
          txs[0] = tx;
          block.transactions = txs;
          // Note: we do NOT update block.hash, simulating manual database editing
          copy[blockId] = block;
          addLog(`DATA_CORRUPTED: block #${blockId} tx_${tx.id} altered (${originalAmount} ETH -> 999999 ETH)`, 'error');
        } else {
          addLog(`DATA_CORRUPTED: block #${blockId} modified with empty payload`, 'error');
        }
        return copy;
      });
      setBrokenChain(true);
      setTamperConfirmId(null);
    }, 800);
  };

  const validateChain = () => {
    addLog('AUDIT: starting full ledger integrity audit...', 'info');
    
    setTimeout(() => {
      let isValid = true;
      let failureIndex = -1;

      for (let i = 1; i < chain.length; i++) {
        const block = chain[i];
        const prevBlock = chain[i - 1];
        
        if (block.prevHash !== prevBlock.hash) {
          isValid = false;
          failureIndex = i;
          break;
        }
      }

      if (isValid && !brokenChain) {
        addLog('AUDIT_OK: ledger integrity verified. 0 anomalies detected.', 'success');
      } else {
        const index = failureIndex !== -1 ? failureIndex : 1;
        addLog(`AUDIT_FAILED: hash mismatch detected. block #${index}.prevHash does not match actual hash of block #${index - 1}`, 'error');
      }
    }, 800);
  };

  // Determine if a specific block is broken
  const isBlockValid = (index: number) => {
    if (index === 0) return true;
    if (brokenChain && index >= 1) {
      // If the chain is broken, any block at or after the tampering points or the whole chain gets invalidated
      return false;
    }
    return chain[index].prevHash === chain[index - 1].hash;
  };

  const isChainValid = !brokenChain && chain.every((_, idx) => isBlockValid(idx));

  return (
    <div className="not-prose my-8 w-full bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-xs select-none">
      
      {/* Node Controller Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-neutral-900/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700" />
          </div>
          <span className="text-[10px] text-neutral-500 font-semibold tracking-wider">BLOCKCHAIN_NODE_SIMULATOR // CORED_v1.0.4</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${isChainValid ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
          <span className={`text-[10px] uppercase font-bold ${isChainValid ? 'text-emerald-500' : 'text-red-500'}`}>
            {isChainValid ? 'CHAIN_SECURE' : 'INTEGRITY_COMPROMISED'}
          </span>
        </div>
      </div>

      {/* Main Section: Ledger Blockchain Visualizer */}
      <div className="flex flex-col border-b border-neutral-800">
        <div className="bg-neutral-900/30 px-3 py-1.5 border-b border-neutral-800 flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
          <span>Ledger Chain State</span>
          <button 
            onClick={validateChain}
            className="px-2 py-0.5 rounded border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-emerald-400 transition-colors"
          >
            Run Ledger Audit
          </button>
        </div>

        {/* Scrollable blockchain container */}
        <div 
          ref={chainScrollRef}
          className="flex items-center gap-0 p-6 overflow-x-auto bg-black/60 min-h-[260px] scrollbar-thin scrollbar-thumb-neutral-800"
        >
          {chain.map((block, idx) => {
            const isValid = isBlockValid(idx);
            return (
              <React.Fragment key={block.id}>
                {/* Visual Connection Arrow */}
                {idx > 0 && (
                  <div className="flex flex-col justify-center items-center px-4 shrink-0 text-neutral-700 select-none">
                    <div className="text-[8px] font-mono text-neutral-500 mb-1">prevHash</div>
                    <svg className="w-8 h-4 text-neutral-600 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <div className="text-[8px] font-mono text-emerald-500/50 mt-1 truncate max-w-[48px]">{block.prevHash}</div>
                  </div>
                )}

                {/* Block Card */}
                <div 
                  className={`w-64 shrink-0 bg-neutral-900 border ${
                    isValid ? 'border-neutral-800' : 'border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                  } p-3 flex flex-col justify-between`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-neutral-850 pb-2 mb-2">
                      <div>
                        <span className="text-neutral-500 text-[10px]">BLOCK:</span>{" "}
                        <span className="text-neutral-200 font-bold">#{block.id}</span>
                      </div>
                      <span className={`px-1.5 py-0.5 text-[8px] font-bold ${
                        block.id === 0 ? 'bg-blue-950/50 text-blue-400 border border-blue-800/40' : 
                        isValid ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/40' : 'bg-red-950/50 text-red-400 border border-red-800/40'
                      }`}>
                        {block.id === 0 ? 'GENESIS' : isValid ? 'VALID' : 'CORRUPTED'}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1.5 mb-3 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">NONCE:</span>
                        <span className="text-neutral-300 font-bold">{block.nonce}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">MINER:</span>
                        <span className="text-neutral-400 truncate max-w-[120px]">{block.miner}</span>
                      </div>

                      {/* Block Ledger Transactions */}
                      <div className="mt-2 pt-2 border-t border-neutral-800/60">
                        <span className="text-neutral-500 block mb-1">LEDGER_DATA:</span>
                        <div className="space-y-1 max-h-16 overflow-y-auto pr-0.5">
                          {block.transactions.map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center bg-black/40 px-1.5 py-0.5 rounded border border-neutral-800/50 text-[9px]">
                              <span className="text-neutral-400">{tx.from} → {tx.to}</span>
                              <span className={`${tx.amount > 1000 ? 'text-red-400 font-bold animate-pulse' : 'text-emerald-500'}`}>{tx.amount} ETH</span>
                            </div>
                          ))}
                          {block.transactions.length === 0 && (
                            <span className="text-neutral-600 italic">SYSTEM_GENESIS_VOID</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic Linkage Details */}
                  <div className="space-y-1 bg-black/50 p-2 border border-neutral-850 text-[9px]">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">PREV_HASH:</span>
                      <span className="text-neutral-400 truncate max-w-[100px]">{block.prevHash}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-neutral-900/60 pt-1 mt-1">
                      <span className="text-neutral-500">BLOCK_HASH:</span>
                      <span className={`truncate max-w-[100px] font-bold ${isValid ? 'text-emerald-500' : 'text-red-400'}`}>
                        {block.hash}
                      </span>
                    </div>
                  </div>

                  {/* Tamper trigger */}
                  {block.id > 0 && (
                    <div className="mt-3 pt-2 border-t border-neutral-850">
                      {tamperConfirmId === block.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => confirmTamper(block.id)}
                            className="flex-grow bg-red-950 hover:bg-red-900 border border-red-700 text-red-400 py-1 text-[9px] font-bold animate-pulse"
                          >
                            CONFIRM INJECT?
                          </button>
                          <button
                            onClick={() => setTamperConfirmId(null)}
                            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 py-1 text-[9px]"
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setTamperConfirmId(block.id)}
                          className="w-full bg-neutral-900/80 hover:bg-red-950/30 text-neutral-500 hover:text-red-400 border border-neutral-850 hover:border-red-900/40 py-1 text-[9px] font-semibold transition-colors"
                        >
                          TAMPER DATA
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Operations Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800">
        
        {/* Left Side: TX INJECTOR & MEMPOOL QUEUE */}
        <div className="lg:col-span-6 p-4 bg-neutral-950 flex flex-col md:flex-row gap-4 divide-y md:divide-y-0 md:divide-x divide-neutral-800/60">
          
          {/* TX INJECTOR */}
          <div className="flex-1 space-y-3 pb-4 md:pb-0">
            <h4 className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Transaction Injector</h4>
            
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-500 text-[9px] uppercase mb-0.5">SENDER_ADDR</label>
                  <input 
                    type="text" 
                    value={newTx.from}
                    onChange={(e) => setNewTx({...newTx, from: e.target.value})}
                    className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-emerald-500 text-emerald-400 font-mono px-2 py-1 rounded outline-none text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 text-[9px] uppercase mb-0.5">RECIPIENT_ADDR</label>
                  <input 
                    type="text" 
                    value={newTx.to}
                    onChange={(e) => setNewTx({...newTx, to: e.target.value})}
                    className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-emerald-500 text-emerald-400 font-mono px-2 py-1 rounded outline-none text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 text-[9px] uppercase mb-0.5">PAYLOAD_VALUE (ETH)</label>
                <input 
                  type="number"
                  value={newTx.amount}
                  onChange={(e) => setNewTx({...newTx, amount: Number(e.target.value)})}
                  min="1"
                  className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-emerald-500 text-emerald-400 font-mono px-2 py-1 rounded outline-none text-[11px]"
                />
              </div>

              <button 
                onClick={addTransaction}
                className="w-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-300 py-1.5 transition-all active:scale-[0.98]"
              >
                SUBMIT_TX_TO_MEMPOOL
              </button>
            </div>
          </div>

          {/* MEMPOOL QUEUE */}
          <div className="flex-1 flex flex-col justify-between pt-4 md:pt-0 md:pl-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Mempool Ledger Queue</h4>
                <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-sm">
                  {mempool.length} TX_PENDING
                </span>
              </div>

              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-0.5 mb-4 scrollbar-thin">
                {mempool.map((tx) => (
                  <div key={tx.id} className="bg-black/30 border border-neutral-850/80 p-2 flex justify-between items-center text-[10px]">
                    <span className="text-neutral-400">{tx.from} → {tx.to}</span>
                    <span className="text-emerald-500 font-semibold">{tx.amount.toFixed(2)} ETH</span>
                  </div>
                ))}
                {mempool.length === 0 && (
                  <div className="text-neutral-600 italic text-[10px] py-4 text-center">
                    Mempool empty. Node idling...
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={mineBlock}
              disabled={mempool.length === 0 || mining}
              className="w-full bg-emerald-950/60 hover:bg-emerald-900/80 disabled:opacity-30 disabled:hover:bg-emerald-950/60 border border-emerald-500 text-emerald-400 py-1.5 font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed select-none"
            >
              {mining ? "RESOLVING_POW..." : "MINE_PENDING_BLOCK"}
            </button>
          </div>
        </div>

        {/* Right Side: Scrollable Terminal Log Pane */}
        <div className="lg:col-span-6 p-4 bg-black flex flex-col h-64 lg:h-auto min-h-[220px]">
          <div className="flex justify-between items-center border-b border-neutral-900 pb-2 mb-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">System CLI Output Log</span>
            <button 
              onClick={() => setLogs([])}
              className="text-[9px] text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              CLEAR_CLI
            </button>
          </div>

          <div ref={terminalContainerRef} className="flex-grow overflow-y-auto font-mono text-[10px] text-neutral-400 space-y-1 scrollbar-thin pr-1 max-h-48 lg:max-h-56">
            {logs.map((log, index) => {
              let colorClass = 'text-neutral-400';
              if (log.level === 'warn') colorClass = 'text-amber-500';
              if (log.level === 'error') colorClass = 'text-red-500 font-semibold';
              if (log.level === 'success') colorClass = 'text-emerald-400';
              return (
                <div key={index} className="leading-relaxed">
                  <span className="text-neutral-600">[{log.timestamp}]</span>{" "}
                  <span className={colorClass}>{log.text}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-neutral-900 pt-2 mt-2 flex items-center gap-1.5 text-neutral-500 text-[10px]">
            <span>guest@blockchain-node:~$</span>
            <span className="w-1.5 h-3.5 bg-emerald-500 animate-pulse inline-block align-middle" />
          </div>
        </div>

      </div>

    </div>
  );
}