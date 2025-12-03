import { useState } from 'react';
import { Car, Droplets, LogOut } from 'lucide-react';
import { ParkingViolations } from './ParkingViolations';
import { WaterLogging } from './WaterLogging';

interface DashboardProps {
  user: {
    name: string;
    email: string;
  };
  onSignOut: () => void;
}

type TabType = 'parking' | 'water';

export function Dashboard({ user, onSignOut }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('parking');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-blue-700 text-2xl font-semibold">Campus Sentry</h1>
              <p className="text-gray-500 text-sm mt-1 hidden sm:block">Dashboard Overview</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <div className="text-left sm:text-right">
                <p className="text-gray-800 text-sm sm:text-base">{user.name}</p>
                <p className="text-gray-500 text-xs sm:text-sm">{user.email}</p>
              </div>
              <button
                onClick={onSignOut}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 border border-red-200 text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('parking')}
              className={`flex items-center gap-2 px-3 sm:px-6 py-3 sm:py-4 border-b-2 transition-all duration-200 text-sm sm:text-base flex-1 sm:flex-initial justify-center ${
                activeTab === 'parking'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              <Car className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Parking Violations</span>
              <span className="sm:hidden">Parking</span>
            </button>
            <button
              onClick={() => setActiveTab('water')}
              className={`flex items-center gap-2 px-3 sm:px-6 py-3 sm:py-4 border-b-2 transition-all duration-200 text-sm sm:text-base flex-1 sm:flex-initial justify-center ${
                activeTab === 'water'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Water Logging</span>
              <span className="sm:hidden">Water</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {activeTab === 'parking' ? <ParkingViolations /> : <WaterLogging />}
      </main>
    </div>
  );
}
