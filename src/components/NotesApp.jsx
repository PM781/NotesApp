import { useEffect, useMemo, useState } from "react";

const starterNote = {
  id: 1,
  title: "A small reminder",
  body: "“Great things are done by a series of small things brought together.” — Vincent van Gogh",
  category: "Personal",
  updatedAt: "2026-01-01T09:00:00.000Z"
};

function loadNotes() {
  try {
    const savedNotes = localStorage.getItem("week04-notes");
    return savedNotes === null ? [starterNote] : JSON.parse(savedNotes);
  } catch {
    return [starterNote];
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="note-card">
      <div className="note-card-top">
        <span className="category-label">{note.category}</span>
        <span className="note-date">{formatDate(note.updatedAt)}</span>
      </div>

      <h3>{note.title || "Untitled note"}</h3>
      <p className="note-body">{note.body}</p>

      <div className="note-actions">
        <button className="text-button" onClick={() => onEdit(note)}>Edit</button>
        <button className="text-button delete-button" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default function NotesApp() {
  const [notes, setNotes] = useState(loadNotes);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Personal");

  useEffect(() => {
    localStorage.setItem("week04-notes", JSON.stringify(notes));
  }, [notes]);

  const categories = useMemo(
    () => ["All", ...new Set(notes.map((note) => note.category || "Uncategorised"))],
    [notes]
  );

  const visibleNotes = useMemo(
    () =>
      notes.filter((note) => {
        const searchableText = `${note.title} ${note.body} ${note.category}`.toLowerCase();
        const matchesSearch = searchableText.includes(search.toLowerCase());
        const matchesCategory =
          categoryFilter === "All" || note.category === categoryFilter;
        return matchesSearch && matchesCategory;
      }),
    [notes, search, categoryFilter]
  );

  function openNewNote() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setCategory("Personal");
    setIsEditorOpen(true);
  }

  function openEditNote(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setBody(note.body);
    setCategory(note.category);
    setIsEditorOpen(true);
  }

  function saveNote(event) {
    event.preventDefault();

    if (!title.trim() && !body.trim()) {
      return;
    }

    const noteData = {
      title: title.trim(),
      body: body.trim(),
      category,
      updatedAt: new Date().toISOString()
    };

    if (editingId !== null) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingId ? { ...note, ...noteData } : note
        )
      );
    } else {
      setNotes((currentNotes) => [
        { id: Date.now(), ...noteData },
        ...currentNotes
      ]);
    }

    setIsEditorOpen(false);
  }

  function deleteNote(id) {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
  }

  return (
    <section className="workspace">
      <div className="notes-toolbar">
        <label className="search-field">
          <span className="visually-hidden">Search notes</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notes..."
          />
        </label>

        <select
          className="category-select"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Filter notes by category"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All categories" : item}
            </option>
          ))}
        </select>

        <button className="primary-button" onClick={openNewNote}>New note</button>
      </div>

      <div className="notes-summary">
        <h2>Your notes <span>{visibleNotes.length}</span></h2>
        <p>Choose a note to edit it, or create something new.</p>
      </div>

      {visibleNotes.length > 0 ? (
        <div className="notes-grid">
          {visibleNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={openEditNote}
              onDelete={deleteNote}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-rule" />
          <h3>{notes.length === 0 ? "No notes yet" : "No matching notes"}</h3>
          <p>
            {notes.length === 0
              ? "Create your first note to get started."
              : "Try a different search or category."}
          </p>
        </div>
      )}

      {isEditorOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsEditorOpen(false);
            }
          }}
        >
          <form className="note-editor" onSubmit={saveNote}>
            <div className="editor-header">
              <h2>{editingId !== null ? "Edit note" : "New note"}</h2>
              <button
                type="button"
                className="text-button close-button"
                onClick={() => setIsEditorOpen(false)}
              >
                Close
              </button>
            </div>

            <label className="field-label">
              Title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Type a title..."
              />
            </label>

            <label className="field-label">
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>Personal</option>
                <option>Study</option>
                <option>Ideas</option>
                <option>Work</option>
              </select>
            </label>

            <label className="field-label">
              Note
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Type your note here..."
                rows="8"
              />
            </label>

            <div className="editor-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setIsEditorOpen(false)}
              >
                Cancel
              </button>
              <button className="primary-button" type="submit">Save note</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
