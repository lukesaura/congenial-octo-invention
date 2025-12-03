import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

interface LoginPageProps {
  onLogin: (email: string, name: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Look for matching user in Firestore (users collection)
      const usersRef = collection(db, "users");

      const q = query(
        usersRef,
        where("name", "==", email),
        where("password", "==", password)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // user found
        onLogin(email, email);
      } else {
        alert("Invalid credentials. User not found in Firestore.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      alert("Failed to connect to Firebase.");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-gray-800 mb-2">Campus Sentry</h1>
            <p className="text-gray-500">Sign in to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Username
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-all"
                placeholder="test"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-all"
                placeholder="123"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white 
              py-3 rounded-lg transition-colors duration-200 flex items-center 
              justify-center gap-2 mt-6 disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Checking..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
