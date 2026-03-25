'use client';

import { motion } from 'framer-motion';
import { 
  Phone, 
  Users, 
  TrendingUp,
  Clock,
  MoreHorizontal,
  Search,
  Bell,
  Settings,
  Plus
} from 'lucide-react';

const content = {
  no: {
    title: 'Arxon Kommandosenter',
    subtitle: 'Sanntidsoversikt over dine AI-agenter',
    callsToday: 'Samtaler i dag',
    satisfaction: 'Kundetilfredshet',
    activeAgents: 'Aktive agenter',
    recentCalls: 'Nylige samtaler',
    addAgent: 'Legg til agent'
  },
  en: {
    title: 'Arxon Command Center',
    subtitle: 'Real-time overview of your AI agents',
    callsToday: 'Calls today',
    satisfaction: 'Customer satisfaction',
    activeAgents: 'Active agents',
    recentCalls: 'Recent calls',
    addAgent: 'Add agent'
  }
};

interface CommandCenterProps {
  lang?: 'no' | 'en';
}

export default function CommandCenter({ lang = 'no' }: CommandCenterProps) {
  const t = content[lang];

  const agents = [
    { name: 'Lisa', role: 'Helse', status: 'active', color: 'bg-emerald-400' },
    { name: 'Marcus', role: 'Eiendom', status: 'active', color: 'bg-blue-400' },
    { name: 'Emma', role: 'Regnskap', status: 'active', color: 'bg-purple-400' },
    { name: 'Leo', role: 'Leads', status: 'idle', color: 'bg-amber-400' },
  ];

  const recentCalls = [
    { time: '14:32', name: 'Lisa', number: '+47 123 45 678', type: 'Booking', duration: '2:45' },
    { time: '14:28', name: 'Marcus', number: '+47 123 45 679', type: 'Inquiry', duration: '1:20' },
    { time: '14:15', name: 'Emma', number: '+47 123 45 680', type: 'Booking', duration: '3:10' },
    { time: '13:58', name: 'Lisa', number: '+47 123 45 678', type: 'Support', duration: '4:30' },
    { time: '13:42', name: 'Leo', number: '+47 123 45 681', type: 'Lead', duration: '5:15' },
  ];

  // Chart data
  const chartData = [35, 55, 45, 70, 60, 85, 75, 90, 80, 95, 85, 100];

  return (
    <section className="relative py-24 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{t.title}</h2>
                <p className="text-xs text-zinc-500">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 grid md:grid-cols-3 gap-6">
            {/* Left - Main Stats */}
            <div className="md:col-span-2 space-y-6">
              {/* Big Number */}
              <div className="flex items-end gap-4">
                <div>
                  <div className="text-7xl font-bold text-white">147</div>
                  <div className="text-sm text-zinc-400 mt-1">{t.callsToday}</div>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-sm mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12%</span>
                </div>
              </div>

              {/* Satisfaction */}
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-white">94%</div>
                <div className="text-sm text-zinc-400">{t.satisfaction}</div>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
                </div>
              </div>

              {/* Chart */}
              <div className="pt-4">
                <div className="flex items-end gap-1 h-32">
                  {chartData.map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="flex-1 bg-emerald-400/30 hover:bg-emerald-400/50 transition-colors rounded-t"
                      style={{ minHeight: '4px' }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-zinc-600">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>

            {/* Right - Agents & Recent */}
            <div className="space-y-6">
              {/* Active Agents */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-zinc-400">{t.activeAgents}</h3>
                  <button className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {agents.map((agent) => (
                    <div key={agent.name} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
                      <div className={`w-2 h-2 rounded-full ${agent.color}`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{agent.name}</div>
                        <div className="text-xs text-zinc-500">{agent.role}</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Calls */}
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-4">{t.recentCalls}</h3>
                <div className="space-y-2">
                  {recentCalls.map((call, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/30 text-xs">
                      <span className="text-zinc-500 w-10">{call.time}</span>
                      <div className="flex-1">
                        <div className="text-white">{call.name}</div>
                        <div className="text-zinc-600">{call.number}</div>
                      </div>
                      <span className="text-zinc-500">{call.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
