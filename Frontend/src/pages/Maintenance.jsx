import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Wrench, Clock, CheckCircle2, User, FileText, Plus, AlertCircle, Trash, X } from 'lucide-react';
import api from '../services/api';
import PageTransition from '../components/PageTransition';
import { cn } from '../utils/cn';

const Maintenance = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [machineId, setMachineId] = useState('CNC-A12');
  const [scheduledDate, setScheduledDate] = useState('');
  const [type, setType] = useState('Preventative');
  const [technician, setTechnician] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Fetch maintenance list
  const { data: schedules, isLoading } = useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      const { data } = await api.get('/maintenance');
      return data;
    }
  });

  // Fetch machines list to populate dropdown
  const { data: machines } = useQuery({
    queryKey: ['machines'],
    queryFn: async () => {
      const { data } = await api.get('/machines');
      return data;
    }
  });

  // Schedule mutation
  const scheduleMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/maintenance', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      setShowForm(false);
      resetForm();
    },
    onError: (err) => {
      setFormError(err.response?.data?.message || 'Failed to schedule maintenance.');
    }
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }) => {
      const { data } = await api.put(`/maintenance/${id}`, { status, notes });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    }
  });

  const resetForm = () => {
    setMachineId('CNC-A12');
    setScheduledDate('');
    setType('Preventative');
    setTechnician('');
    setNotes('');
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!machineId || !scheduledDate || !type || !technician) {
      setFormError('Please fill in all required fields.');
      return;
    }
    scheduleMutation.mutate({
      machineId,
      scheduledDate,
      type,
      technician,
      notes
    });
  };

  const handleUpdateStatus = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition className="space-y-8 pb-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Wrench className="w-6 h-6 text-indigo-400" />
            </div>
            Maintenance Scheduler
          </h1>
          <p className="text-white/50 mt-2">Manage upcoming equipment inspections and maintain service history logs</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2 text-sm justify-center self-start sm:self-auto"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Close Scheduler' : 'Schedule Service'}
        </button>
      </header>

      {/* Scheduler Form Panel */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border border-white/10 bg-[#09090b]/55 backdrop-blur-md overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Configure Maintenance Task</h2>

              {formError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Target Machine</label>
                  <select
                    value={machineId}
                    onChange={(e) => setMachineId(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  >
                    {machines?.map(m => (
                      <option key={m.machineId} value={m.machineId} className="bg-[#09090b]">
                        {m.machineName} ({m.machineId})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Task Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="Preventative" className="bg-[#09090b]">Preventative PM</option>
                    <option value="Corrective" className="bg-[#09090b]">Corrective Action</option>
                    <option value="Inspection" className="bg-[#09090b]">Routine Inspection</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Assigned Engineer</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    required
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Maintenance Instructions / Details</label>
                <textarea
                  placeholder="Describe parts replacement, diagnostic checks, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={scheduleMutation.isPending}
                  className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                >
                  {scheduleMutation.isPending ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main timeline listing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Schedules */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Scheduled Maintenance Pipeline
          </h2>

          <div className="space-y-4">
            {schedules?.filter(s => s.status === 'Scheduled' || s.status === 'In Progress').map((s) => {
              const isInProgress = s.status === 'In Progress';
              return (
                <div
                  key={s._id}
                  className={cn(
                    "rounded-2xl border p-5 bg-[#09090b]/50 transition-all hover:bg-white/[0.02] relative overflow-hidden flex flex-col gap-4",
                    isInProgress ? "border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]" : "border-white/[0.05]"
                  )}
                >
                  {isInProgress && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                  )}

                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{s.machineId}</span>
                          <span className={cn(
                            "text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded border",
                            s.type === 'Corrective' ? "text-rose-400 bg-rose-400/10 border-rose-400/20" :
                            s.type === 'Inspection' ? "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" :
                            "text-indigo-400 bg-indigo-400/10 border-indigo-400/20"
                          )}>
                            {s.type}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">Assigned to: <strong className="text-white/60 font-semibold">{s.technician}</strong></p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border",
                        isInProgress ? "text-amber-400 bg-amber-400/10 border-amber-400/20 animate-pulse" : "text-slate-400 bg-slate-800/10 border-slate-700/20"
                      )}>
                        {s.status}
                      </span>
                      <p className="text-[10px] text-white/30 mt-1.5 font-mono">
                        {new Date(s.scheduledDate).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {s.notes && (
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white/60 leading-relaxed font-medium">
                      {s.notes}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-3">
                    {!isInProgress ? (
                      <button
                        onClick={() => handleUpdateStatus(s._id, 'In Progress')}
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all"
                      >
                        Start Service
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(s._id, 'Completed')}
                        className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all"
                      >
                        Mark Completed
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus(s._id, 'Cancelled')}
                      className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-lg text-xs font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}

            {schedules?.filter(s => s.status === 'Scheduled' || s.status === 'In Progress').length === 0 && (
              <div className="py-16 border border-dashed border-white/10 bg-white/[0.01] rounded-2xl text-center">
                <Calendar className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-white/50 text-sm font-medium">No upcoming maintenance scheduled.</p>
              </div>
            )}
          </div>
        </div>

        {/* Maintenance History */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Service History Log
          </h2>

          <div className="space-y-3">
            {schedules?.filter(s => s.status === 'Completed' || s.status === 'Cancelled').map((s) => {
              const isCompleted = s.status === 'Completed';
              return (
                <div
                  key={s._id}
                  className="p-4 rounded-xl border border-white/[0.03] bg-white/[0.01] flex flex-col gap-2 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{s.machineId}</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                      isCompleted ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-rose-400 bg-rose-400/10 border-rose-400/20"
                    )}>
                      {s.status}
                    </span>
                  </div>

                  <div className="text-[10px] text-white/40 flex items-center gap-1 font-medium">
                    <User className="w-3 h-3 text-indigo-400" /> {s.technician}
                    <span className="mx-1">•</span>
                    <Clock className="w-3 h-3 text-indigo-400" /> {s.completionDate ? new Date(s.completionDate).toLocaleDateString() : new Date(s.updatedAt).toLocaleDateString()}
                  </div>

                  {s.notes && (
                    <p className="text-[11px] text-white/50 font-mono italic leading-relaxed">
                      "{s.notes}"
                    </p>
                  )}
                </div>
              );
            })}

            {schedules?.filter(s => s.status === 'Completed' || s.status === 'Cancelled').length === 0 && (
              <div className="py-12 border border-dashed border-white/5 bg-white/[0.005] rounded-xl text-center text-xs text-white/30">
                No past logs recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Maintenance;
