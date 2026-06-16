import { CounterUI } from "./CounterUI";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Aztec Counter dApp
          </h1>
          <p className="text-gray-400">Private Counter · Noir Contract · React + Vite</p>
        </header>

        <CounterUI />

        <footer className="mt-12 text-center text-gray-500 text-sm">
          Aztec Privacy Starter · Built with Noir + Aztec.js + React
        </footer>
      </div>
    </div>
  );
}

export default App;
