import "./App.css";
import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "@/components/theme-provider";

function App() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jirafy</h1>
        <ModeToggle />
      </header>

      <main className="container mx-auto p-4">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Current Theme: {theme}</h2>
          <p className="text-muted-foreground mb-4">
            This is a demonstration of the theme provider. Try changing the
            theme using the toggle in the header.
          </p>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-primary text-primary-foreground rounded-md">
              Primary Color Block
            </div>
            <div className="p-4 bg-secondary text-secondary-foreground rounded-md">
              Secondary Color Block
            </div>
            <div className="p-4 bg-accent text-accent-foreground rounded-md">
              Accent Color Block
            </div>
            <div className="p-4 bg-muted text-muted-foreground rounded-md">
              Muted Color Block
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
