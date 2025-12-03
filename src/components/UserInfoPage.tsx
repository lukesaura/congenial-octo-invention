// src/components/UserInfoPage.tsx
import { User, Mail, ArrowLeft, LogOut } from 'lucide-react';
import type { User as AppUser } from '../App';

interface UserInfoPageProps {
  user: AppUser;
  onConfirmSignOut: () => void;
  onCancel: () => void;
}

export function UserInfoPage({ user, onConfirmSignOut, onCancel }: UserInfoPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-gray-800 mb-2">Account Information</h2>
            <p className="text-gray-500">Review your details before signing out</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">Full Name</span>
              </div>
              <p className="text-gray-800 ml-8">{user.name}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">Email Address</span>
              </div>
              <p className="text-gray-800 ml-8">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onConfirmSignOut}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Confirm Sign Out
            </button>

            <button
              onClick={onCancel}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
