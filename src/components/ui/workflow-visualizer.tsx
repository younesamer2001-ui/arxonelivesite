'use client';

import { motion, type PanInfo } from "framer-motion";
import type React from "react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { 
  ArrowRight, ArrowDown,
  Database, Mail, Plus, Settings, Webhook, Zap,
  Phone, Calendar, MessageSquare, Bot
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  from: string;
  to: string;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;

const nodeTemplates: Omit<WorkflowNode, "id" | "position">[] = [
  { type: "trigger", title: "Telefon / Chat", description: "Kunden ringer eller sender melding", icon: Phone, color: "emerald" },
  { type: "action", title: "AI Resepsjonist", description: "AI svarer og forstår henvendelsen", icon: Bot, color: "blue" },
  { type: "condition", title: "Vurdering", description: "Sjekk om det er booking, spørsmål eller lead", icon: Settings, color: "amber" },
  { type: "action", title: "Booking", description: "Finn ledig tid og book møte", icon: Calendar, color: "purple" },
  { type: "action", title: "CRM Oppdatering", description: "Lagre info i kunderegisteret", icon: Database, color: "indigo" },
];

const initialNodes: WorkflowNode[] = [
  { id: "node-1", type: "trigger", title: "Telefon / Chat", description: "Kunden ringer eller sender melding", icon: Phone, color: "emerald", position: { x: 50, y: 100 } },
  { id: "node-2", type: "action", title: "AI Resepsjonist", description: "AI svarer og forstår henvendelsen", icon: Bot, color: "blue", position: { x: 300, y: 100 } },
  { id: "node-3", type: "condition", title: "Vurdering", description: "Sjekk om det er booking, spørsmål eller lead", icon: Settings, color: "amber", position: { x: 550, y: 100 } },
];

const initialConnections: WorkflowConnection[] = [
  { from: "node-1", to: "node-2" },
  { from: "node-2", to: "node-3" },
];

const colorClasses: Record<string, string> = {
  emerald: "border-zinc-500/40 bg-zinc-500/10 text-zinc-500",
  blue: "border-zinc-400/40 bg-zinc-600/10 text-zinc-500",
  amber: "border-zinc-500/40 bg-zinc-500/10 text-zinc-500",
  purple: "border-zinc-400/40 bg-zinc-400/10 text-zinc-500",
  indigo: "border-indigo-400/40 bg-indigo-400/10 text-indigo-400",
};

const colorDots: Record<string, string> = {
  emerald: "bg-zinc-500",
  blue: "bg-zinc-600",
  amber: "bg-zinc-500",
  purple: "bg-zinc-500",
  indigo: "bg-indigo-400",
};

/* ── Mobile: vertical step list ── */
function MobileWorkflow({ nodes }: { nodes: WorkflowNode[] }) {
  return (
    <div className="flex flex-col items-center gap-0 md:hidden">
      {nodes.map((node, i) => {
        const Icon = node.icon;
        return (
          <div key={node.id} className="flex flex-col items-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className={`w-full max-w-xs rounded-xl border ${colorClasses[node.color]} bg-black/50 p-4 backdrop-blur-sm`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${colorClasses[node.color]} bg-black/50`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-white/50">{node.type}</span>
                  <h3 className="text-sm font-semibold text-white">{node.title}</h3>
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/60">{node.description}</p>
            </motion.div>
            {i < nodes.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.2 }}
                className="flex flex-col items-center py-2"
              >
                <div className="w-px h-6 bg-white/10" />
                <ArrowDown className="w-4 h-4 text-white/25" />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Desktop: draggable canvas (unchanged) ── */
function WorkflowConnectionLine({ from, to, nodes }: { from: string; to: string; nodes: WorkflowNode[] }) {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);
  if (!fromNode || !toNode) return null;

  const startX = fromNode.position.x + NODE_WIDTH;
  const startY = fromNode.position.y + NODE_HEIGHT / 2;
  const endX = toNode.position.x;
  const endY = toNode.position.y + NODE_HEIGHT / 2;
  const cp1X = startX + (endX - startX) * 0.5;
  const cp2X = endX - (endX - startX) * 0.5;
  const path = `M${startX},${startY} C${cp1X},${startY} ${cp2X},${endY} ${endX},${endY}`;

  return (
    <path d={path} fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray="8,6" strokeLinecap="round" opacity={0.35} className="text-white" />
  );
}

export function WorkflowVisualizer() {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [connections, setConnections] = useState<WorkflowConnection[]>(initialConnections);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [contentSize, setContentSize] = useState(() => {
    const maxX = Math.max(...initialNodes.map((n) => n.position.x + NODE_WIDTH));
    const maxY = Math.max(...initialNodes.map((n) => n.position.y + NODE_HEIGHT));
    return { width: maxX + 50, height: maxY + 50 };
  });

  const handleDragStart = (nodeId: string) => {
    setDraggingNodeId(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    if (node) dragStartPosition.current = { x: node.position.x, y: node.position.y };
  };

  const handleDrag = (nodeId: string, { offset }: PanInfo) => {
    if (draggingNodeId !== nodeId || !dragStartPosition.current) return;
    const newX = Math.max(0, dragStartPosition.current.x + offset.x);
    const newY = Math.max(0, dragStartPosition.current.y + offset.y);
    flushSync(() => {
      setNodes((prev) => prev.map((node) => node.id === nodeId ? { ...node, position: { x: newX, y: newY } } : node));
    });
    setContentSize((prev) => ({ width: Math.max(prev.width, newX + NODE_WIDTH + 50), height: Math.max(prev.height, newY + NODE_HEIGHT + 50) }));
  };

  const handleDragEnd = () => { setDraggingNodeId(null); dragStartPosition.current = null; };

  const addNode = () => {
    const template = nodeTemplates[Math.floor(Math.random() * nodeTemplates.length)];
    const lastNode = nodes[nodes.length - 1];
    const newPosition = lastNode ? { x: lastNode.position.x + 250, y: lastNode.position.y } : { x: 50, y: 100 };
    const newNode: WorkflowNode = { id: `node-${Date.now()}`, ...template, position: newPosition };
    flushSync(() => {
      setNodes((prev) => [...prev, newNode]);
      if (lastNode) setConnections((prev) => [...prev, { from: lastNode.id, to: newNode.id }]);
    });
    setContentSize((prev) => ({ width: Math.max(prev.width, newPosition.x + NODE_WIDTH + 50), height: Math.max(prev.height, newPosition.y + NODE_HEIGHT + 50) }));
    const canvas = canvasRef.current;
    if (canvas) canvas.scrollTo({ left: newPosition.x + NODE_WIDTH - canvas.clientWidth + 100, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      {/* Mobile vertical flow */}
      <MobileWorkflow nodes={nodes} />

      {/* Desktop draggable canvas */}
      <div className="hidden md:block">
        <div ref={canvasRef} className="relative h-[300px] w-full overflow-auto" style={{ minHeight: "300px" }} role="region" aria-label="Workflow canvas" tabIndex={0}>
          <div className="relative" style={{ minWidth: contentSize.width, minHeight: contentSize.height }}>
            <svg className="absolute top-0 left-0 pointer-events-none" width={contentSize.width} height={contentSize.height} style={{ overflow: "visible" }} aria-hidden="true">
              {connections.map((c) => <WorkflowConnectionLine key={`${c.from}-${c.to}`} from={c.from} to={c.to} nodes={nodes} />)}
            </svg>

            {nodes.map((node) => {
              const Icon = node.icon;
              const isDragging = draggingNodeId === node.id;
              return (
                <motion.div
                  key={node.id}
                  drag
                  dragMomentum={false}
                  dragConstraints={{ left: 0, top: 0, right: 100000, bottom: 100000 }}
                  onDragStart={() => handleDragStart(node.id)}
                  onDrag={(_, info) => handleDrag(node.id, info)}
                  onDragEnd={handleDragEnd}
                  style={{ x: node.position.x, y: node.position.y, width: NODE_WIDTH, transformOrigin: "0 0" }}
                  className="absolute cursor-grab"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
                  aria-grabbed={isDragging}
                >
                  <div className={`group/node relative w-full overflow-hidden rounded-xl border ${colorClasses[node.color]} bg-black/50 p-3 backdrop-blur-sm transition-all hover:shadow-lg ${isDragging ? "shadow-xl ring-2 ring-white/50" : ""}`}>
                    <div className="relative space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${colorClasses[node.color]} bg-black/50 backdrop-blur`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] uppercase tracking-[0.15em] text-white/60">{node.type}</span>
                          <h3 className="truncate text-xs font-semibold tracking-tight text-white">{node.title}</h3>
                        </div>
                      </div>
                      <p className="line-clamp-2 text-[10px] leading-relaxed text-white/70">{node.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button onClick={addNode} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white hover:bg-white/20 transition-colors">
            <Plus className="h-4 w-4" />
            Legg til node
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-6 text-xs text-white/50">
          <span>{nodes.length} noder</span>
          <span>{connections.length} koblinger</span>
        </div>
      </div>
    </div>
  );
}

export default WorkflowVisualizer;
