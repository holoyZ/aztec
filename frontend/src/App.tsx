import { useState, useEffect } from "react";
import { connect } from "../../src/connect.js";
import { CounterContract } from "../../src/artifacts/counter/Counter.js";
import "./App.css";

type Status = "disconnected" | "connected" | "deployed";

function App() {
  const [wallet, setWallet] = useState<unknown>(null);
  const [accounts, setAccounts] = useState<Array<{ address: { toString(): string } }>>([]);
  const [counterContract, setCounterContract] = useState<{
    address: { toString(): string };
    methods: {
      increment: (owner: unknown) => { send: (opts: { from: unknown }) => { wait: () => Promise<void> } };
      get_counter: (owner: unknown) => { simulate: () => Promise<bigint> };
    };
  } | null>(null);
  const [counterValue, setCounterValue] = useState<bigint | null>(null);
  const [contractAddress, setContractAddress] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status>("disconnected");

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    const savedAddress = localStorage.getItem("counterContractAddress");
    if (savedAddress) {
      setContractAddress(savedAddress);
      addLog(`Loaded saved contract address: ${savedAddress.slice(0, 14)}...`);
    }
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      addLog("Connecting to Aztec network...");
      const connection = await connect();

      setWallet(connection.wallet);
      setAccounts(connection.accounts);
      setStatus("connected");
      addLog("Successfully connected to Aztec node and wallet");
      addLog(`Found ${connection.accounts.length} test accounts`);
    } catch (error) {
      addLog(`Connection failed: ${error}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = async () => {
    if (!wallet || !accounts.length) {
      addLog("Please connect first");
      return;
    }

    setIsLoading(true);
    try {
      const [alice] = accounts;
      addLog(`Deploying Counter contract with Alice (${alice.address.toString().slice(0, 14)}...)`);

      const deployTx = CounterContract.deploy(wallet, 42n, alice.address);
      const { contract } = await deployTx.send({ from: alice.address }).deployed();

      setCounterContract(contract);
      const addr = contract.address.toString();
      setContractAddress(addr);
      localStorage.setItem("counterContractAddress", addr);
      setStatus("deployed");

      addLog(`Counter deployed at: ${addr}`);

      const value = await contract.methods.get_counter(alice.address).simulate();
      setCounterValue(value);
      addLog(`Current counter value: ${value}`);
    } catch (error) {
      addLog(`Deployment failed: ${error}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async () => {
    if (!counterContract || !wallet || !accounts.length) {
      addLog("No contract or wallet available");
      return;
    }

    setIsLoading(true);
    try {
      const [alice] = accounts;
      addLog("Incrementing counter...");

      await counterContract.methods.increment(alice.address).send({ from: alice.address }).wait();

      addLog("Increment successful");

      const value = await counterContract.methods.get_counter(alice.address).simulate();
      setCounterValue(value);
      addLog(`New counter value: ${value}`);
    } catch (error) {
      addLog(`Increment failed: ${error}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRead = async () => {
    if (!counterContract || !accounts.length) return;

    try {
      const [alice] = accounts;
      const value = await counterContract.methods.get_counter(alice.address).simulate();
      setCounterValue(value);
      addLog(`Read counter value: ${value}`);
    } catch (error) {
      addLog(`Read failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Aztec Counter dApp
          </h1>
          <p className="text-gray-400">Private Counter · Noir Contract · React + Vite</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-6">Controls</h2>

            <div className="space-y-4">
              <button
                onClick={handleConnect}
                disabled={isLoading || status !== "disconnected"}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 py-4 rounded-xl font-medium transition-all"
              >
                {isLoading ? "Connecting..." : "Connect to Aztec"}
              </button>

              <button
                onClick={handleDeploy}
                disabled={isLoading || status !== "connected"}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 py-4 rounded-xl font-medium transition-all"
              >
                {isLoading ? "Deploying..." : "Deploy Counter Contract"}
              </button>

              <button
                onClick={handleIncrement}
                disabled={isLoading || status !== "deployed"}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 py-4 rounded-xl font-medium transition-all"
              >
                {isLoading ? "Incrementing..." : "Increment (Private)"}
              </button>

              <button
                onClick={handleRead}
                disabled={isLoading || status !== "deployed"}
                className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 py-4 rounded-xl font-medium transition-all"
              >
                Refresh Counter Value
              </button>
            </div>

            {contractAddress && (
              <div className="mt-8 p-4 bg-black/50 rounded-xl text-sm font-mono break-all">
                <div className="text-gray-400 mb-1">Contract Address (persisted)</div>
                {contractAddress}
              </div>
            )}
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 flex flex-col">
            <h2 className="text-2xl font-semibold mb-6">Status</h2>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    status === "deployed" ? "bg-emerald-500" : status === "connected" ? "bg-blue-500" : "bg-gray-500"
                  }`}
                />
                <span className="capitalize font-medium">{status}</span>
              </div>

              {counterValue !== null && (
                <div className="text-6xl font-mono font-bold text-emerald-400 mb-2">{counterValue.toString()}</div>
              )}
              <div className="text-gray-400">Private Counter Value</div>
            </div>

            <div className="flex-1">
              <h3 className="font-medium mb-3 text-gray-300">Activity Log</h3>
              <div className="bg-black/70 rounded-xl p-5 h-80 overflow-y-auto font-mono text-sm text-gray-300 space-y-1">
                {logs.length === 0 ? (
                  <p className="text-gray-500 italic">Connect and deploy to see activity...</p>
                ) : (
                  logs.map((log, i) => <div key={i}>{log}</div>)
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          Aztec Privacy Starter · Built with Noir + Aztec.js + React
        </footer>
      </div>
    </div>
  );
}

export default App;
