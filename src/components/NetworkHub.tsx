import { Shield, Upload, DollarSign, Database, Link as LinkIcon, Users, FileText, Terminal } from 'lucide-react';
import { useState } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function NetworkHub() {
    const [uploading, setUploading] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const handleUpload = () => {
        setUploading(true);
        setTimeout(() => setUploading(false), 2000);
    };

    const handleAssetSync = async () => {
        if (!auth.currentUser) {
            alert("Must be logged in to sync Sovereign Assets.");
            return;
        }
        setSyncing(true);
        try {
            await addDoc(collection(db, 'assets'), {
                ownerId: auth.currentUser.uid,
                assetHash: "0x" + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
                registeredAt: serverTimestamp()
            });
            setTimeout(() => setSyncing(false), 1000);
        } catch (error) {
            console.error(error);
            handleFirestoreError(error, OperationType.CREATE, 'assets');
            setSyncing(false);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4 overflow-y-auto pr-2 pb-20">
            {/* Deployment Tracking Card (Matrix Theme) */}
            <div className="bg-[#020D04] border border-[#00FF41] rounded-lg p-4 relative shadow-[0_0_15px_rgba(0,255,65,0.15)] font-mono shrink-0">
                <h3 className="text-[10px] font-bold text-[#00FF41] uppercase tracking-widest mb-3 flex items-center" style={{textShadow: '0 0 10px rgba(0,255,65,0.6)'}}>
                    <Terminal className="w-3 h-3 mr-2" /> Android Cyphron Layer
                </h3>
                <p className="text-[9px] text-[#00FF41]/80 mb-2">
                    Execute <span className="font-bold text-white">unlockCyphronRelease</span>... <span className="text-[#00FF41]">CONFIRMED</span>
                </p>
                <div className="flex flex-col space-y-1 text-[8px] text-[#00FF41]/60 bg-[#001A00] p-2 rounded border border-[#00FF41]/30">
                    <span>Deploy: apex7-monetizer-bridge</span>
                    <span>Namespace: revenue-logic</span>
                    <span>Tier: production-engine</span>
                    <span>Owner: clifton-cody-edgar</span>
                    <span className="text-[#00FF41] mt-1 pt-1 border-t border-[#00FF41]/30 font-bold tracking-widest text-[9px] drop-shadow-[0_0_5px_#00FF41]">STATUS: TARGET_PROJECT ONLINE</span>
                </div>
            </div>

            {/* Derivative Works Panel */}
            <div className="bg-[#11012C] border border-[#3B1B8A] rounded-lg p-4">
                <h3 className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-widest mb-3 flex items-center">
                    <Upload className="w-3 h-3 mr-2" /> Derivative Works
                </h3>
                <div className="flex space-x-2">
                    <button onClick={handleUpload} disabled={uploading} className="flex-1 bg-[#240A59] hover:bg-[#3B1B8A] text-xs py-2 rounded text-white flex items-center justify-center transition-colors">
                        {uploading ? 'Processing...' : 'Upload Audio'}
                    </button>
                    <button onClick={handleUpload} disabled={uploading} className="flex-1 bg-[#240A59] hover:bg-[#3B1B8A] text-xs py-2 rounded text-white flex items-center justify-center transition-colors">
                        {uploading ? 'Processing...' : 'Upload Video'}
                    </button>
                </div>
            </div>

            {/* Sovereign Mainframe Logic */}
            <div className="bg-[#11012C] border border-[#3B1B8A] rounded-lg p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#A233FF]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <h3 className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-widest mb-2 flex items-center">
                    <Database className="w-3 h-3 mr-2" /> Sovereign Mainframe
                </h3>
                <p className="text-[9px] text-[#E2D9FF]/60 mb-3 leading-relaxed">
                    Immutable audit trail synchronization for intellectual property tracking via apex7_monetizer_bridge.
                </p>
                <button 
                  onClick={handleAssetSync} 
                  disabled={syncing}
                  className="w-full bg-[#A233FF]/20 hover:bg-[#A233FF] border border-[#A233FF] text-[#E2D9FF] text-xs py-2 rounded flex items-center justify-center transition-all shadow-[0_0_10px_rgba(162,51,255,0.2)] hover:shadow-[0_0_15px_rgba(162,51,255,0.6)]"
                >
                    {syncing ? 'Synchronizing Ledger...' : 'Register Asset (Audit Trail)'}
                </button>
            </div>

            {/* Paid Membership / Subscriptions */}
            <div className="bg-[#11012C] border border-[#3B1B8A] rounded-lg p-4">
                <h3 className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-widest mb-3 flex items-center">
                    <DollarSign className="w-3 h-3 mr-2" /> Memberships
                </h3>
                <div className="space-y-2">
                    <div className="flex justify-between items-center bg-[#02000A] p-2 rounded border border-[#3B1B8A]/50">
                        <span className="text-[10px] font-bold">Pro Tier</span>
                        <span className="text-[9px] text-[#00F0FF]">Secure Bank Gateway</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#02000A] p-2 rounded border border-[#3B1B8A]/50">
                        <span className="text-[10px] font-bold">Contributor / Fundraising</span>
                        <span className="text-[9px] text-[#A233FF]">Active</span>
                    </div>
                </div>
            </div>

            {/* Trusted Partnerships & Links */}
            <div className="grid grid-cols-2 gap-2">
                <a href="https://mentalartist.com" target="_blank" rel="noreferrer" className="bg-[#11012C] border border-[#3B1B8A] p-3 rounded-lg flex flex-col items-center justify-center hover:bg-[#240A59] transition-colors group text-center space-y-1">
                    <LinkIcon className="w-4 h-4 text-[#E2D9FF] group-hover:text-[#00F0FF]" />
                    <span className="text-[9px] text-[#E2D9FF]/80">mentalartist.com</span>
                </a>
                <div className="bg-[#11012C] border border-[#3B1B8A] p-3 rounded-lg flex flex-col items-center justify-center hover:bg-[#240A59] transition-colors group text-center space-y-1 cursor-pointer">
                    <Users className="w-4 h-4 text-[#E2D9FF] group-hover:text-[#A233FF]" />
                    <span className="text-[9px] text-[#E2D9FF]/80">Trusted Partners</span>
                </div>
                <div className="bg-[#11012C] border border-[#3B1B8A] p-3 rounded-lg flex flex-col items-center justify-center hover:bg-[#240A59] transition-colors group text-center space-y-1 cursor-pointer">
                    <Shield className="w-4 h-4 text-[#E2D9FF] group-hover:text-[#00F0FF]" />
                    <span className="text-[9px] text-[#E2D9FF]/80">Security Terms</span>
                </div>
                <div className="bg-[#11012C] border border-[#3B1B8A] p-3 rounded-lg flex flex-col items-center justify-center hover:bg-[#240A59] transition-colors group text-center space-y-1 cursor-pointer">
                    <FileText className="w-4 h-4 text-[#E2D9FF] group-hover:text-[#A233FF]" />
                    <span className="text-[9px] text-[#E2D9FF]/80">About Us</span>
                </div>
            </div>

            {/* Social Media & Config */}
            <div className="flex justify-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-[#3B1B8A] flex items-center justify-center cursor-pointer hover:bg-[#00F0FF] hover:text-black transition-colors text-xs font-bold">X</div>
                <div className="w-8 h-8 rounded-full bg-[#3B1B8A] flex items-center justify-center cursor-pointer hover:bg-[#00F0FF] hover:text-black transition-colors text-xs font-bold">YT</div>
                <div className="w-8 h-8 rounded-full bg-[#3B1B8A] flex items-center justify-center cursor-pointer hover:bg-[#00F0FF] hover:text-black transition-colors text-xs font-bold">IG</div>
            </div>
            
            <div className="text-center text-[8px] text-[#5D4B8B] font-mono mt-4">
                CHYPRON ANDROID 17 BETA LAUNCHER <br/>
                TARGET_PROJECT: ONLINE
            </div>
        </div>
    );
}
