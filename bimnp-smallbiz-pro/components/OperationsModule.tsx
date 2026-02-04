
import React, { useState } from 'react';
import { Workflow, Plus, MoreVertical, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { BusinessState, Task } from '../types';

const OperationsModule: React.FC<{ state: BusinessState, setBusinessState: any }> = ({ state, setBusinessState }) => {
  const [tasks, setTasks] = useState<Task[]>(state.tasks);

  const smartSort = () => {
    // Simulated AI sorting based on priority and completion probability
    const sorted = [...tasks].sort((a, b) => {
      const aScore = (a.priority * 0.5) + ((a.probabilityOfCompletion || 0) * 0.5);
      const bScore = (b.priority * 0.5) + ((b.probabilityOfCompletion || 0) * 0.5);
      return bScore - aScore;
    });
    setTasks(sorted);
  };

  const columns = ['todo', 'in-progress', 'review', 'done'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operations</h1>
          <p className="text-slate-400 mt-1">Tactical workflow mapping and resource mapping.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={smartSort}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-400 border border-indigo-600/30 rounded-lg text-sm font-semibold hover:bg-indigo-600/20 transition-all"
          >
            <Zap size={16} />
            Gemini Smart Sort
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-500 transition-all">
            <Plus size={18} />
            New Strategic Node
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full min-h-[600px]">
        {columns.map(col => (
          <div key={col} className="bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-2xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{col.replace('-', ' ')}</h3>
              <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded text-slate-400 font-bold">
                {tasks.filter(t => t.status === col).length}
              </span>
            </div>
            <div className="p-3 space-y-3 flex-1 overflow-y-auto">
              {tasks.filter(t => t.status === col).map(task => (
                <div key={task.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm hover:border-slate-700 transition-all group cursor-grab active:cursor-grabbing">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      task.priority === 1 ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {task.priority === 1 ? 'CRITICAL' : 'ROUTINE'}
                    </span>
                    <button className="text-slate-600 group-hover:text-slate-300 transition-colors"><MoreVertical size={14}/></button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-200">{task.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500" 
                            style={{ width: `${(task.probabilityOfCompletion || 0) * 100}%` }}
                          ></div>
                       </div>
                       <span className="text-[10px] text-slate-500 mono">
                         {(task.probabilityOfCompletion || 0) * 100}%
                       </span>
                    </div>
                    {task.probabilityOfCompletion && task.probabilityOfCompletion < 0.7 ? (
                      <AlertTriangle size={14} className="text-amber-500" />
                    ) : (
                      <CheckCircle size={14} className="text-emerald-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationsModule;
