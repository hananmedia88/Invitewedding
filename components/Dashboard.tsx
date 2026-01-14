
import React from 'react';
import { RsvpEntry, InvitationData } from '../types';
import { Users, UserCheck, UserX, MessageCircle, ChevronLeft, Download, Trash2, Edit3, ShieldCheck } from 'lucide-react';

interface Props {
  rsvps: RsvpEntry[];
  onBack: () => void;
  invitationData: InvitationData;
  onDeleteRsvp?: (id: string) => void;
  onEditInvitation?: () => void;
}

const Dashboard: React.FC<Props> = ({ rsvps, onBack, invitationData, onDeleteRsvp, onEditInvitation }) => {
  const attendingCount = rsvps.filter(r => r.attendance === 'yes').reduce((acc, curr) => acc + curr.guests, 0);
  const totalRsvp = rsvps.length;
  const declineCount = rsvps.filter(r => r.attendance === 'no').length;

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-2 bg-white rounded-full text-stone-500 hover:text-stone-900 transition shadow-sm border border-stone-200">
               <ChevronLeft className="w-6 h-6" />
             </button>
             <div>
               <div className="flex items-center gap-2 text-stone-900 font-bold">
                 <ShieldCheck className="w-5 h-5 text-indigo-500" />
                 <h1 className="text-3xl font-serif">Admin Panel</h1>
               </div>
               <p className="text-stone-500 text-sm">Pernikahan {invitationData.couple.brideName} & {invitationData.couple.groomName}</p>
             </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onEditInvitation}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition font-medium shadow-lg"
            >
              <Edit3 className="w-4 h-4" /> Edit Undangan
            </button>
            <button className="bg-white border border-stone-200 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-stone-50 transition font-medium text-stone-700 shadow-sm">
              <Download className="w-4 h-4" /> Export Excel
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-stone-100 space-y-2">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="text-2xl font-bold">{totalRsvp}</div>
            <div className="text-sm text-stone-500 font-medium">Total Konfirmasi</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-stone-100 space-y-2">
            <UserCheck className="w-8 h-8 text-green-500" />
            <div className="text-2xl font-bold">{attendingCount}</div>
            <div className="text-sm text-stone-500 font-medium">Total Tamu Hadir</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-stone-100 space-y-2">
            <UserX className="w-8 h-8 text-red-500" />
            <div className="text-2xl font-bold">{declineCount}</div>
            <div className="text-sm text-stone-500 font-medium">Tamu Berhalangan</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-stone-100 space-y-2">
            <MessageCircle className="w-8 h-8 text-purple-500" />
            <div className="text-2xl font-bold">{rsvps.filter(r => r.message).length}</div>
            <div className="text-sm text-stone-500 font-medium">Total Pesan/Harapan</div>
          </div>
        </div>

        {/* Guest Management Table */}
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-stone-100">
           <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <h2 className="text-xl font-serif font-bold">Manajemen Tamu</h2>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-stone-50 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  <tr>
                    <th className="px-8 py-4">Nama Tamu</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Jumlah</th>
                    <th className="px-8 py-4">Pesan</th>
                    <th className="px-8 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {rsvps.map(r => (
                    <tr key={r.id} className="hover:bg-stone-50/50 transition group">
                      <td className="px-8 py-6">
                        <div className="font-semibold text-stone-900">{r.name}</div>
                        <div className="text-[10px] text-stone-400">{new Date(r.timestamp).toLocaleString('id-ID')}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                          r.attendance === 'yes' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {r.attendance === 'yes' ? 'Hadir' : 'Absen'}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-medium text-stone-600">{r.guests} Orang</td>
                      <td className="px-8 py-6 max-w-xs">
                        <p className="text-stone-500 text-xs italic line-clamp-2">
                          {r.message || '-'}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => onDeleteRsvp?.(r.id)}
                          className="p-2 text-stone-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus RSVP"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {rsvps.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                           <Users className="w-12 h-12 text-stone-200" />
                           <p className="text-stone-400 italic font-light">Belum ada konfirmasi kehadiran tamu.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
