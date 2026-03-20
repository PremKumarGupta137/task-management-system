'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'completed';
  createdAt: string;
}
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
type FilterStatus = 'all' | 'pending' | 'completed';

export default function Dashboard() {
  const [tasks, setTasks]           = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [page, setPage]             = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle]     = useState('');
  const [newDesc, setNewDesc]       = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const [editTask, setEditTask]     = useState<Task | null>(null);
  const [editTitle, setEditTitle]   = useState('');
  const [editDesc, setEditDesc]     = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const [userName, setUserName]     = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem('userName') || 'Guest');
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 8 };
      if (filterStatus !== 'all') params.status = filterStatus;
      if (search.trim()) params.search = search.trim();
      const { data } = await api.get('/tasks', { params });
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch {
      toast.error('Could not load tasks.');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, search, router]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { setPage(1); }, [filterStatus, search]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAddLoading(true);
    try {
      await api.post('/tasks', { title: newTitle.trim(), description: newDesc.trim() || undefined });
      toast.success('Task added to ledger.');
      setNewTitle(''); setNewDesc(''); setShowAddModal(false);
      fetchTasks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create task.');
    } finally { setAddLoading(false); }
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTask || !editTitle.trim()) return;
    setEditLoading(true);
    try {
      await api.patch(`/tasks/${editTask.id}`, { title: editTitle.trim(), description: editDesc.trim() || null });
      toast.success('Task updated.');
      setEditTask(null); fetchTasks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update task.');
    } finally { setEditLoading(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task removed.');
      fetchTasks();
    } catch { toast.error('Failed to delete task.'); }
  };

  const handleToggle = async (id: string) => {
    try { await api.patch(`/tasks/${id}/toggle`); fetchTasks(); }
    catch { toast.error('Failed to update status.'); }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
    } catch {}
    localStorage.clear();
    toast.success('Signed out.');
    router.push('/login');
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description || '');
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingCount   = tasks.filter((t) => t.status === 'pending').length;

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Header ─────────────────────────────────── */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-paper)',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 8px rgba(28,24,20,0.06)',
      }}>
        {/* Gold top stripe */}
        <div style={{ height: '3px', background: 'linear-gradient(to right, transparent, var(--gold), transparent)' }} />

        <div style={{
          maxWidth: '1000px', margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px', height: '36px', border: '1.5px solid var(--gold)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--gold-dim)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="var(--gold)" strokeWidth="1.5"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--ink)', letterSpacing: '0.01em' }}>
              TaskLedger
            </span>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-faint)', fontSize: '0.92rem', fontStyle: 'italic' }}>
              {userName}
            </span>
            <button onClick={handleLogout} className="btn-ghost" style={{
              fontSize: '0.68rem', padding: '0.4rem 0.9rem',
              borderColor: 'var(--rust)', color: 'var(--rust)',
            }}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────── */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Page heading row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '0.3rem' }}>
              Personal Register
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              My Tasks
            </h1>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-classic">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Add Task
          </button>
        </div>

        {/* Horizontal rule */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, var(--border-dark), var(--border), transparent)', margin: '1rem 0 2rem' }} />

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Tasks',  value: pagination?.total ?? 0,   color: 'var(--gold)',  dim: 'var(--gold-dim)' },
            { label: 'Pending',      value: pendingCount,              color: '#8b6914',      dim: 'rgba(139,105,20,0.08)' },
            { label: 'Completed',    value: completedCount,            color: 'var(--sage)',  dim: 'var(--sage-dim)' },
          ].map((s) => (
            <div key={s.label} className="paper" style={{ padding: '1.1rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '2px',
                background: s.dim, border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '220px', display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="var(--ink-ghost)" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="var(--ink-ghost)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                className="input-classic"
                style={{ paddingLeft: '2.2rem', fontSize: '0.95rem' }}
                placeholder="Search tasks…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-classic" style={{ padding: '0.6rem 1rem', fontSize: '0.72rem' }}>
              Search
            </button>
            {search && (
              <button type="button" className="btn-ghost" style={{ fontSize: '0.68rem', padding: '0.55rem 0.8rem' }}
                onClick={() => { setSearch(''); setSearchInput(''); }}>
                Clear
              </button>
            )}
          </form>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {(['all', 'pending', 'completed'] as FilterStatus[]).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '2px',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'capitalize',
                cursor: 'pointer',
                border: '1px solid',
                transition: 'all 0.2s',
                borderColor: filterStatus === s ? 'var(--gold)' : 'var(--border)',
                background:  filterStatus === s ? 'var(--gold-dim)' : 'transparent',
                color:       filterStatus === s ? 'var(--gold)' : 'var(--ink-faint)',
              }}>
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <svg className="spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="var(--gold)" strokeWidth="2.5" strokeDasharray="40" strokeDashoffset="10"/>
            </svg>
          </div>
        ) : tasks.length === 0 ? (
          <div className="paper" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 1rem', display: 'block' }}>
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="var(--ink-ghost)" strokeWidth="1.5"/>
              <path d="M8 10h8M8 14h5" stroke="var(--ink-ghost)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-faint)', fontSize: '1.05rem', marginBottom: '0.4rem' }}>
              No tasks recorded
            </p>
            <p style={{ color: 'var(--ink-ghost)', fontSize: '0.875rem', fontStyle: 'italic' }}>
              {search || filterStatus !== 'all' ? 'Try adjusting your filters.' : 'Click "Add Task" to begin your ledger.'}
            </p>
          </div>
        ) : (
          <div className="paper" style={{ overflow: 'hidden' }}>
            {tasks.map((task, i) => (
              <div key={task.id} className="animate-fade-up" style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.4rem',
                borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none',
                animationDelay: `${i * 0.04}s`,
                background: task.status === 'completed' ? 'rgba(58,92,62,0.03)' : 'transparent',
                transition: 'background 0.2s',
              }}>

                {/* Toggle checkbox */}
                <button onClick={() => handleToggle(task.id)} style={{
                  width: '20px', height: '20px', flexShrink: 0,
                  border: `1.5px solid ${task.status === 'completed' ? 'var(--sage)' : 'var(--border-dark)'}`,
                  borderRadius: '2px',
                  background: task.status === 'completed' ? 'var(--sage-dim)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {task.status === 'completed' && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="var(--sage)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>

                {/* Task content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    fontWeight: task.status === 'completed' ? 400 : 500,
                    color: task.status === 'completed' ? 'var(--ink-faint)' : 'var(--ink)',
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p style={{ color: 'var(--ink-ghost)', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Date */}
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '0.68rem',
                  color: 'var(--ink-ghost)', letterSpacing: '0.04em',
                  flexShrink: 0, display: 'none',
                }}
                  className="hidden sm:block">
                  {formatDate(task.createdAt)}
                </span>

                {/* Status badge */}
                <span style={{
                  padding: '0.2rem 0.65rem', borderRadius: '2px',
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                  flexShrink: 0,
                  background: task.status === 'completed' ? 'var(--sage-dim)' : 'rgba(139,105,20,0.08)',
                  color:      task.status === 'completed' ? 'var(--sage)'    : 'var(--gold)',
                  border: `1px solid ${task.status === 'completed' ? 'rgba(58,92,62,0.25)' : 'rgba(139,105,20,0.2)'}`,
                }}>
                  {task.status}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                  <button onClick={() => openEdit(task)} title="Edit" style={{
                    width: '30px', height: '30px', borderRadius: '2px',
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--ink-faint)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(task.id)} title="Delete" style={{
                    width: '30px', height: '30px', borderRadius: '2px',
                    border: '1px solid rgba(139,58,30,0.2)', background: 'var(--rust-dim)',
                    color: 'var(--rust)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', marginTop: '2rem' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="btn-ghost" style={{ fontSize: '0.68rem', padding: '0.45rem 0.9rem' }}>
              ← Prev
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={{
                width: '34px', height: '34px', borderRadius: '2px',
                fontFamily: 'var(--font-display)', fontSize: '0.8rem',
                border: `1px solid ${page === p ? 'var(--gold)' : 'var(--border)'}`,
                background: page === p ? 'var(--gold-dim)' : 'transparent',
                color: page === p ? 'var(--gold)' : 'var(--ink-faint)',
                cursor: 'pointer', fontWeight: page === p ? 700 : 400,
              }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
              className="btn-ghost" style={{ fontSize: '0.68rem', padding: '0.45rem 0.9rem' }}>
              Next →
            </button>
          </div>
        )}
      </main>

      {/* ── Add Modal ──────────────────────────────── */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(28,24,20,0.45)', backdropFilter: 'blur(3px)',
          zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={() => setShowAddModal(false)}>
          <div className="paper animate-fade-up" style={{ width: '100%', maxWidth: '460px', padding: '0' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ height: '3px', background: 'linear-gradient(to right, transparent, var(--gold), transparent)', borderRadius: '2px 2px 0 0' }} />
            <div style={{ padding: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.2rem' }}>
                New Task
              </h2>
              <p style={{ color: 'var(--ink-faint)', fontSize: '0.88rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                Record a task in your ledger
              </p>
              <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label className="label-classic">Title *</label>
                  <input type="text" className="input-classic" placeholder="What needs to be done?" value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)} required autoFocus />
                </div>
                <div>
                  <label className="label-classic">Description</label>
                  <textarea className="input-classic" style={{ resize: 'vertical', minHeight: '72px' }}
                    placeholder="Additional notes…" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                  <button type="button" className="btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn-classic" disabled={addLoading}>
                    {addLoading ? 'Saving…' : 'Add to Ledger'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ─────────────────────────────── */}
      {editTask && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(28,24,20,0.45)', backdropFilter: 'blur(3px)',
          zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={() => setEditTask(null)}>
          <div className="paper animate-fade-up" style={{ width: '100%', maxWidth: '460px', padding: '0' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ height: '3px', background: 'linear-gradient(to right, transparent, var(--gold), transparent)', borderRadius: '2px 2px 0 0' }} />
            <div style={{ padding: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.2rem' }}>
                Edit Task
              </h2>
              <p style={{ color: 'var(--ink-faint)', fontSize: '0.88rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                Amend the task record
              </p>
              <form onSubmit={handleEditTask} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label className="label-classic">Title *</label>
                  <input type="text" className="input-classic" value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)} required autoFocus />
                </div>
                <div>
                  <label className="label-classic">Description</label>
                  <textarea className="input-classic" style={{ resize: 'vertical', minHeight: '72px' }}
                    value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                  <button type="button" className="btn-ghost" onClick={() => setEditTask(null)}>Cancel</button>
                  <button type="submit" className="btn-classic" disabled={editLoading}>
                    {editLoading ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
