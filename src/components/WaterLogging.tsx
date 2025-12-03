// src/components/WaterLogging.tsx
import { useEffect, useState } from 'react';
import { Droplets, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { db, serverTime } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';

interface WaterLoggingIssue {
  id: string;
  location: string;
  dateTime?: string;
  approved: boolean;
  approvedAt?: string;
}

export function WaterLogging() {
  const [issues, setIssues] = useState<WaterLoggingIssue[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'waterIssues'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => {
        const data: any = d.data();
        return {
          id: d.id,
          location: data.location ?? '—',
          dateTime: data.dateTime ?? (data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : ''),
          approved: !!data.approved,
          approvedAt: data.approvedAt ? new Date(data.approvedAt.seconds * 1000).toLocaleString() : undefined,
        } as WaterLoggingIssue;
      });
      setIssues(items);
      setLoading(false);
    }, (err) => {
      console.error('Firestore listen error', err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      const dref = doc(db, 'waterIssues', id);
      await updateDoc(dref, {
        approved: true,
        approvedAt: serverTime(),
      });
      setExpandedId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to approve. Try again.');
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return <div className="py-8 text-center text-gray-600">Loading water logging issues...</div>;
  }

  const pendingCount = issues.filter(i => !i.approved).length;
  const approvedCount = issues.filter(i => i.approved).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-gray-800 text-2xl font-semibold">Water Logging Issues</h2>
          <p className="text-gray-500 mt-1 text-sm">Track and resolve water logging reports</p>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 sm:px-4 py-2">
            <p className="text-red-600 text-sm sm:text-base">{pendingCount} Pending</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg px-3 sm:px-4 py-2">
            <p className="text-green-600 text-sm sm:text-base">{approvedCount} Approved</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className={`bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden ${
              issue.approved 
                ? 'border-green-200 bg-green-50/30' 
                : 'border-red-200 bg-red-50/30'
            } ${expandedId === issue.id ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}`}
          >
            <button
              onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
              className="w-full p-4 sm:p-5 text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex-shrink-0 ${
                    issue.approved ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <Droplets className={`w-5 h-5 sm:w-6 sm:h-6 ${issue.approved ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-gray-800 text-sm sm:text-base truncate">{issue.location}</h3>
                      {issue.approved && (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Approved</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Reported: {issue.dateTime}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex-shrink-0 ${
                  issue.approved 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {issue.approved ? 'Approved' : 'Pending'}
                </div>
              </div>
            </button>

            {expandedId === issue.id && (
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-200 pt-4 bg-white">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-600 text-xs sm:text-sm mb-1">Location Details</p>
                      <p className="text-gray-800 text-sm sm:text-base break-words">{issue.location}</p>
                    </div>
                  </div>
                </div>
                {issue.approved && issue.approvedAt && (
                  <p className="text-green-600 text-xs sm:text-sm mb-4">Approved on {issue.approvedAt}</p>
                )}
                {!issue.approved && (
                  <button
                    onClick={() => handleApprove(issue.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
                    disabled={approvingId === issue.id}
                  >
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    {approvingId === issue.id ? 'Approving...' : 'Approve Issue'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
