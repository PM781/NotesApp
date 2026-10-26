import NotesApp from "./components/NotesApp.jsx";

export default function App() {
  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Notes App</p>
          <h1>Keep your thoughts <span>in one place.</span></h1>
          <p className="page-description">
            A simple space for ideas, reminders, and notes.
          </p>
        </div>
        <div className="header-index"></div>
      </header>

      <NotesApp />

      <footer className="page-footer">
        <span>Notes App</span>
      </footer>
    </main>
  );
}
