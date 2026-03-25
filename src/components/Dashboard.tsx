'use client';

import { motion } from 'framer-motion';
import { 
  Phone, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Bot
} from 'lucide-react';

const content = {
  no: {
    title: 'Arxon Kommandosenter',
    subtitle: 'Sanntidsoversikt over dine AI-agenter',
    stats: {
      calls: 'Samtaler i dag',
      responseTime: 'Svartid',
      satisfaction: 'Kundetilfredshet',
      leads: 'Nye leads'
    },
    agents: 'Aktive agenter',
    recent: 'Nylige samtaler',
    performance: 'Ytelse siste 7 dager'
  },
  en: {
    title: 'Arxon Command Center',
    subtitle: 'Real-time overview of your AI agents',
    stats: {
      calls: 'Calls today',
      responseTime: 'Response time',
      satisfaction: 'Customer satisfaction',
      leads: 'New leads'
    },
    agents: 'Active agents',
    recent: 'Recent conversations',
    performance: 'Performance last 7 days'
  }
};

interface DashboardProps {
  lang?: 'no' | 'en';
}

export default function Dashboard({ lang = 'no' }: DashboardProps) {
  const t = content[lang];

  // Demo data
  const stats = [
    { 
      label: t.stats.calls, 
      value: '147', 
      change: '+12%', 
      up: true,
      icon: Phone 
    },
    { 
      label: t.stats.responseTime, 
      value: '2.3s', 
      change: '-0.5s', 
      up: true,
      icon: Clock 
    },
    { 
      label: t.stats.satisfaction, 
      value: '94%', 
      change: '+3%', 
      up: true,
      icon: Activity 
    },
    { 
      label: t.stats.leads, 
      value: '23', 
      change: '+8', 
      up: true,
      icon: Users 
    },
  ];

  const agents = [
    { name: 'Lisa', status: 'active', calls: 45 },
    { name: 'Marcus', status: 'active', calls: 38 },
    { name: 'Emma', status: 'active', calls: 32 },
    { name: 'Leo', status: 'idle', calls: 0 },
  ];

  const recentCalls = [
    { time: '14:32', agent: 'Lisa', type: 'booking', duration: '2:45' },
    { time: '14:28', agent: 'Marcus', type: 'inquiry', duration: '1:20' },
    { time: '14:15', agent: 'Emma', type: 'booking', duration: '3:10' },
    { time: '13:58', agent: 'Lisa', type: 'support', duration: '4:30' },
  ];

  return (
    <section className="relative py-12 md:py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{t.title}</h2>
              <p className="text-gray-400 text-sm">{t.subtitle}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-5 h-5 text-gray-400" />
                <span className={`text-xs flex items-center gap-1 ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Active Agents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
              {t.agents}
            </h3>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div key={agent.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                    <span className="text-white font-medium">{agent.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{agent.calls} calls</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Conversations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
              {t.recent}
            </h3>
            <div className="space-y-3">
              {recentCalls.map((call, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{call.time}</span>
                    <span className="text-white">{call.agent}</span>
                  </div>
                  <span className="text-gray-500">{call.duration}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
              {t.performance}
            </h3>
            <div className="flex items-end gap-2 h-32">
              {[65, 78, 82, 74, 88, 92, 94].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-white/10 rounded-t-sm hover:bg-white/20 transition-colors"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Man</span>
              <span>Tir</span>
              <span>Ons</span>
              <span>Tor</span>
              <span>Fre</span>
              <span>Lør</span>
              <span>Søn</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
