import React, { useMemo, useState } from 'react';

const initialTodos = [
  {
    id: 1,
    title: 'Mengerjakan tugas React',
    description: 'Membuat aplikasi To-Do List untuk kuis praktikum frontend.',
    priority: 'High',
    deadline: '2026-11-18',
    status: 'In Progress',
  },
  {
    id: 2,
    title: 'Mempelajari materi UI/UX',
    description: 'Membaca materi dan mencatat poin penting mengenai pengalaman pengguna.',
    priority: 'Medium',
    deadline: '2026-11-20',
    status: 'Todo',
  },
  {
    id: 3,
    title: 'Menyelesaikan laporan praktikum',
    description: 'Merapikan laporan dan menyiapkan screenshot hasil pengerjaan.',
    priority: 'High',
    deadline: '2026-11-21',
    status: 'Todo',
  },
  {
    id: 4,
    title: 'Upload project ke GitHub',
    description: 'Push seluruh source code dan lengkapi README dengan screenshot aplikasi.',
    priority: 'Low',
    deadline: '2026-11-22',
    status: 'Done',
  },
];

const blankTodo = {
  title: '',
  description: '',
  priority: 'Medium',
  deadline: '',
  status: 'Todo',
};

const statusLabel = {
  Todo: 'To Do',
  'In Progress': 'In Progress',
  Done: 'Done',
};

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blankTodo);

  const filteredTodos = useMemo(
    () =>
      todos.filter((todo) => {
        const matchesSearch = `${todo.title} ${todo.description}`
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesFilter = filter === 'All' || todo.status === filter;

        return matchesSearch && matchesFilter;
      }),
    [todos, search, filter]
  );

  const counts = {
    total: todos.length,
    progress: todos.filter((t) => t.status === 'In Progress').length,
    done: todos.filter((t) => t.status === 'Done').length,
    todo: todos.filter((t) => t.status === 'Todo').length,
  };

  function openAdd() {
    setForm(blankTodo);
    setModal({ type: 'add' });
  }

  function openEdit(todo) {
    setForm({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      deadline: todo.deadline,
      status: todo.status,
    });

    setModal({ type: 'edit', todo });
  }

  function saveTodo(e) {
    e.preventDefault();

    if (!form.title.trim() || !form.deadline) return;

    if (modal.type === 'add') {
      setTodos((prev) => [
        { ...form, title: form.title.trim(), id: Date.now() },
        ...prev,
      ]);
    } else {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === modal.todo.id
            ? { ...t, ...form, title: form.title.trim() }
            : t
        )
      );
    }

    setModal(null);
  }

  function deleteTodo(todo) {
    if (window.confirm(`Hapus tugas "${todo.title}"?`)) {
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
      window.alert('Tugas berhasil dihapus.');
    }
  }

  function formatDate(date) {
    if (!date) return '—';

    return new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">✓</div>
          <span>
            Task<span className="brand-accent">Flow</span>
          </span>
        </div>

        <div className="side-label">MENU</div>

        <button className="nav-item active">
          <span className="nav-icon">▦</span> Daftar Tugas
        </button>

        <div className="sidebar-bottom">
          <div className="mini-card">
            <div className="mini-icon">✦</div>
            <strong>My little space</strong>
            <p>One step at a time.</p>
          </div>

          <div className="profile">
            <div className="avatar">A</div>
            <div>
              <strong>Acha's Workspace</strong>
              <small>Personal To-Do</small>
            </div>
            <span className="dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <b>Daftar Tugas</b>
          </div>

          <div className="top-actions">
            <span className="today-chip">
              ◷{' '}
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </span>
            <div className="avatar small">A</div>
          </div>
        </header>

        <section className="page-heading">
          <div>
            <div className="eyebrow">PERSONAL WORKSPACE</div>
            <h1>
              To-Do List <span className="wave">✦</span>
            </h1>
            <p>Atur tugasmu, capai targetmu. Satu langkah setiap hari.</p>
          </div>

          <button className="primary-btn" onClick={openAdd}>
            <span>＋</span> Tambah Tugas
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span>Total Tugas</span>
              <span className="stat-icon purple">▤</span>
            </div>
            <strong>{counts.total}</strong>
            <small>Semua tugas tercatat</small>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Belum Dimulai</span>
              <span className="stat-icon blue">◷</span>
            </div>
            <strong>{counts.todo}</strong>
            <small>Siap untuk dikerjakan</small>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Dalam Proses</span>
              <span className="stat-icon orange">↻</span>
            </div>
            <strong>{counts.progress}</strong>
            <small>Sedang kamu kerjakan</small>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Selesai</span>
              <span className="stat-icon green">✓</span>
            </div>
            <strong>{counts.done}</strong>
            <small>Good job, keep it up!</small>
          </div>
        </section>

        <section className="tasks-panel">
          <div className="panel-heading">
            <div>
              <h2>Daftar Tugas</h2>
              <p>Kelola semua aktivitasmu di sini.</p>
            </div>

            <div className="task-tools">
              <label className="search-box">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari tugas..."
                />
              </label>

              <select
                className="filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter status"
              >
                <option value="All">Semua Status</option>
                <option value="Todo">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>TUGAS</th>
                  <th>PRIORITAS</th>
                  <th>DEADLINE</th>
                  <th>STATUS</th>
                  <th className="actions-head">AKSI</th>
                </tr>
              </thead>

              <tbody>
                {filteredTodos.map((todo) => (
                  <tr key={todo.id}>
                    <td>
                      <button
                        className="task-title"
                        onClick={() => setModal({ type: 'detail', todo })}
                      >
                        {todo.title}
                      </button>

                      <div className="task-description">
                        {todo.description}
                      </div>
                    </td>

                    <td>
                      <span className={`priority ${todo.priority.toLowerCase()}`}>
                        <i />
                        {todo.priority}
                      </span>
                    </td>

                    <td className="deadline">
                      ▦ &nbsp;{formatDate(todo.deadline)}
                    </td>

                    <td>
                      <span
                        className={`status ${todo.status
                          .replace(' ', '-')
                          .toLowerCase()}`}
                      >
                        {statusLabel[todo.status]}
                      </span>
                    </td>

                    <td>
                      <div className="row-actions">
                        <button
                          className="icon-btn view"
                          title="Lihat detail"
                          onClick={() => setModal({ type: 'detail', todo })}
                        >
                          ⌕
                        </button>

                        <button
                          className="icon-btn edit"
                          title="Edit tugas"
                          onClick={() => openEdit(todo)}
                        >
                          ✎
                        </button>

                        <button
                          className="icon-btn delete"
                          title="Hapus tugas"
                          onClick={() => deleteTodo(todo)}
                        >
                          ×
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTodos.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      <div>⌕</div>
                      <strong>Tugas tidak ditemukan</strong>
                      <p>Coba kata kunci atau filter yang berbeda.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="panel-footer">
            <span>
              Menampilkan <b>{filteredTodos.length}</b> dari <b>{todos.length}</b>{' '}
              tugas
            </span>

            <span className="footer-note">
              <span className="green-dot"></span>
              Data tersimpan selama aplikasi dibuka
            </span>
          </div>
        </section>

        <footer className="page-footer">
          Made for your productivity <span>✦</span>
        </footer>
      </main>

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-kicker">
                  {modal.type === 'detail' ? 'TASK OVERVIEW' : 'TASK MANAGEMENT'}
                </span>

                <h2>
                  {modal.type === 'add'
                    ? 'Tambah Tugas'
                    : modal.type === 'edit'
                    ? 'Edit Tugas'
                    : 'Detail Tugas'}
                </h2>
              </div>

              <button className="close-btn" onClick={() => setModal(null)}>
                ×
              </button>
            </div>

            {modal.type === 'detail' ? (
              <div className="detail-content">
                <div className="detail-title">{modal.todo.title}</div>

                <p className="detail-description">
                  {modal.todo.description || 'Tidak ada deskripsi.'}
                </p>

                <div className="detail-grid">
                  <div>
                    <label>Prioritas</label>
                    <span
                      className={`priority ${modal.todo.priority.toLowerCase()}`}
                    >
                      <i />
                      {modal.todo.priority}
                    </span>
                  </div>

                  <div>
                    <label>Status</label>
                    <span
                      className={`status ${modal.todo.status
                        .replace(' ', '-')
                        .toLowerCase()}`}
                    >
                      {statusLabel[modal.todo.status]}
                    </span>
                  </div>

                  <div>
                    <label>Deadline</label>
                    <strong>{formatDate(modal.todo.deadline)}</strong>
                  </div>

                  <div>
                    <label>ID Tugas</label>
                    <strong>#{modal.todo.id}</strong>
                  </div>
                </div>

                <button
                  className="primary-btn full"
                  onClick={() => openEdit(modal.todo)}
                >
                  ✎ Edit Tugas
                </button>
              </div>
            ) : (
              <form onSubmit={saveTodo}>
                <div className="form-field">
                  <label>
                    Judul Tugas <span>*</span>
                  </label>

                  <input
                    autoFocus
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Contoh: Mengerjakan tugas React"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Deskripsi</label>

                  <textarea
                    rows="3"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Ceritakan detail tugasmu..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>Status</label>

                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="Todo">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Prioritas</label>

                    <select
                      value={form.priority}
                      onChange={(e) =>
                        setForm({ ...form, priority: e.target.value })
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label>
                    Deadline <span>*</span>
                  </label>

                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm({ ...form, deadline: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setModal(null)}
                  >
                    Batal
                  </button>

                  <button type="submit" className="primary-btn">
                    {modal.type === 'add'
                      ? '＋ Tambahkan'
                      : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;