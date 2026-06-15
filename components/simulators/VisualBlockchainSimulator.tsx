"use client";

import React, { useState, useEffect } from 'react';
import { Server, Send, Cpu, RefreshCw, AlertTriangle, CheckCircle, Activity, ShieldAlert } from 'lucide-react';

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

export default function VisualBlockchainSimulator() {
  const [chain, setChain] = useState<Block[]>([]);
  const [mempool, setMempool] = useState<Transaction[]>([]);
  const [mining, setMining] = useState(false);
  const [tampering, setTampering] = useState(false);
  const [newTx, setNewTx] = useState({ from: 'Alice', to: 'Bob', amount: 10 });
  const [lastAction, setLastAction] = useState('System online');
  const [brokenChain, setBrokenChain] = useState(false);

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
      prevHash: 'genesis',
      transactions: [],
      timestamp: Date.now() - 300000,
      nonce: 0,
      miner: 'system'
    };
    setChain([genesis]);
    setLastAction('Genesis block created');
  };

  useEffect(() => {
    if (chain.length === 0) {
      createGenesis();
    }
  }, []);

  const addTransaction = () => {
    if (!newTx.from || !newTx.to || newTx.amount <= 0) {
      setLastAction('Please fix your transaction values first');
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
    setLastAction(`${tx.from} initiated transfer of ${tx.amount} ETH to ${tx.to}`);
  };

  const mineBlock = () => {
    if (mempool.length === 0) {
      setLastAction('No transactions in the waiting room to mine');
      return;
    }

    setMining(true);
    setLastAction('Finding matching Proof-of-Work nonce...');

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
      } while (!hash.startsWith('00') && nonce < 1000);

      const newBlock: Block = {
        id: chain.length,
        hash,
        prevHash: lastBlock.hash,
        transactions: [...mempool.map(tx => ({ ...tx, status: 'mined' as const }))],
        timestamp: Date.now(),
        nonce,
        miner: 'miner-' + Math.floor(Math.random() * 100)
      };

      setChain(prev => [...prev, newBlock]);
      setMempool([]); // Clear mempool
      setMining(false);
      setLastAction(`Block #${newBlock.id} successfully mined!`);
    }, 1500);
  };

  const tamperWithBlock = (blockId: number) => {
    if (blockId === 0) {
      setLastAction("Cannot tamper with Genesis Block");
      return;
    }

    setTampering(true);
    setLastAction('Injecting rogue payload into ledger...');

    setTimeout(() => {
      setChain(prev => {
        const copy = [...prev];
        const block = { ...copy[blockId] };
        const txs = [...block.transactions];
        
        if (txs.length > 0) {
          const tx = { ...txs[0] };
          tx.amount = 999999; // Rogue amount injection
          txs[0] = tx;
          block.transactions = txs;
          // Note: we do NOT update block.hash, simulating manual database editing
          copy[blockId] = block;
        }
        return copy;
      });
      setBrokenChain(true);
      setLastAction(`Tampered! Block #${blockId} transaction modified without recalculating hash.`);
      setTampering(false);
    }, 1200);
  };

  const validateChain = () => {
    setLastAction('Running cryptographic node validation checks...');
    
    let isValid = true;
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const prevBlock = chain[i - 1];
      
      if (block.prevHash !== prevBlock.hash) {
        isValid = false;
        break;
      }
    }

    setTimeout(() => {
      if (isValid && !brokenChain) {
        setLastAction('Chain validation complete: Cryptographically secure.');
      } else {
        setLastAction('Security Alert: Chain link mismatch detected! Block sequence is invalid.');
      }
    }, 1000);
  };

  // Determine if a specific block is broken
  const isBlockValid = (index: number) => {
    if (index === 0) return true;
    if (brokenChain && index >= 1) {
      // If the first block's transaction amount was modified, it breaks integrity
      return false;
    }
    return chain[index].prevHash === chain[index - 1].hash;
  };

  const isChainValid = !brokenChain && chain.every((_, idx) => isBlockValid(idx));

  return (
    <div className="not-prose my-10 w-full rounded-lg border border-border/80 p-5 font-mono text-xs text-text bg-bg">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Inputs) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section: Issue Transaction */}
          <div className="border border-border/60 rounded-lg p-4 bg-bg2/40 space-y-3">
            <h4 className="font-semibold text-text">1. Issue transaction</h4>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-dim mb-1">From</label>
                  <input 
                    type="text" 
                    value={newTx.from}
                    onChange={(e) => setNewTx({...newTx, from: e.target.value})}
                    className="w-full bg-bg border border-border px-2 py-1 rounded focus:outline-none focus:border-border2"
                  />
                </div>
                <div>
                  <label className="block text-dim mb-1">To</label>
                  <input 
                    type="text" 
                    value={newTx.to}
                    onChange={(e) => setNewTx({...newTx, to: e.target.value})}
                    className="w-full bg-bg border border-border px-2 py-1 rounded focus:outline-none focus:border-border2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-dim mb-1">Amount (ETH)</label>
                <input 
                  type="number"
                  value={newTx.amount}
                  onChange={(e) => setNewTx({...newTx, amount: Number(e.target.value)})}
                  min="1"
                  className="w-full bg-bg border border-border px-2 py-1 rounded focus:outline-none focus:border-border2"
                />
              </div>

              <button 
                onClick={addTransaction}
                className="w-full bg-bg3 hover:bg-bg4 border border-border text-text py-1.5 rounded transition-colors cursor-pointer"
              >
                Add to mempool
              </button>
            </div>
          </div>

          {/* Section: Mempool */}
          <div className="border border-border/60 rounded-lg p-4 bg-bg2/40 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-text">2. Mempool</h4>
              <span className="text-[10px] text-dim">
                {mempool.length} pending
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {mempool.map((tx) => (
                <div key={tx.id} className="bg-bg border border-border/40 rounded p-2 flex justify-between items-center">
                  <span>{tx.from} ➔ {tx.to}</span>
                  <span className="text-accent font-semibold">{tx.amount} ETH</span>
                </div>
              ))}
              {mempool.length === 0 && (
                <p className="text-dim text-center py-4">
                  Mempool is empty.
                </p>
              )}
            </div>

            <button 
              onClick={mineBlock}
              disabled={mempool.length === 0 || mining}
              className="w-full bg-accent hover:bg-accent2 disabled:opacity-40 text-white py-1.5 rounded transition-colors cursor-pointer"
            >
              {mining ? "Calculating PoW..." : "Mine block"}
            </button>
          </div>
        </div>

        {/* Right Column (Chain) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border border-border/60 rounded-lg p-4 bg-bg2/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/30 pb-2">
              <h4 className="font-semibold text-text">Mined Blocks</h4>
              <button 
                onClick={validateChain}
                className="px-2 py-1 rounded bg-bg border border-border hover:border-border2 text-text transition-colors cursor-pointer"
              >
                Verify chain integrity
              </button>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[440px] pr-1">
              {chain.map((block, idx) => {
                const isValid = isBlockValid(idx);
                return (
                  <div 
                    key={block.id}
                    className={`rounded-lg border p-3.5 bg-bg transition-all flex flex-col md:flex-row gap-4 ${
                      isValid ? "border-border/60" : "border-red-500/40"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col justify-between shrink-0 md:w-28 border-b md:border-b-0 md:border-r border-border/60 pb-3 md:pb-0 md:pr-4">
                      <div>
                        <div className="font-semibold text-text">Block #{block.id}</div>
                        <div className="text-dim mt-1">Nonce: {block.nonce}</div>
                      </div>
                      
                      {block.id > 0 && (
                        <button 
                          onClick={() => tamperWithBlock(block.id)}
                          className="mt-3 bg-bg3 hover:bg-bg4 border border-border hover:border-red-500/35 text-dim hover:text-red-400 py-1 rounded transition-colors cursor-pointer"
                        >
                          Tamper data
                        </button>
                      )}
                    </div>

                    {/* Transactions */}
                    <div className="flex-1 space-y-1.5">
                      <div className="text-dim">Transactions:</div>
                      <div className="space-y-1">
                        {block.transactions.map((tx) => (
                          <div key={tx.id} className="flex justify-between items-center bg-bg2/30 border border-border/40 p-2 rounded">
                            <span>{tx.from} ➔ {tx.to}</span>
                            <span className="font-semibold">{tx.amount} ETH</span>
                          </div>
                        ))}
                        {block.transactions.length === 0 && (
                          <span className="text-dim italic">Genesis Block</span>
                        )}
                      </div>
                    </div>

                    {/* Hash details */}
                    <div className="md:w-52 space-y-2 border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-4">
                      <div>
                        <span className="text-dim block">Prev hash:</span>
                        <span className="block truncate bg-bg2/50 px-1 py-0.5 rounded text-muted">
                          {block.prevHash}
                        </span>
                      </div>
                      <div>
                        <span className="text-dim block">Block hash:</span>
                        <span className={`block truncate px-1 py-0.5 rounded ${
                          isValid ? "bg-bg2/50 text-emerald-400" : "bg-bg2/50 border border-red-500/20 text-red-400"
                        }`}>
                          {block.hash}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Logs Banner */}
      <div className="mt-4 px-3 py-1.5 rounded bg-bg2 border border-border/60 text-dim flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-accent animate-pulse" />
        <span>Status log: {lastAction}</span>
      </div>

    </div>
  );
}