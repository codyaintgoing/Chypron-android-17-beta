import { useState, useEffect, useRef, FormEvent } from 'react';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, loginWithGoogle } from '../firebase';
import { Send, LogIn, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { onAuthStateChanged, User } from 'firebase/auth';

export function SpencerChat() {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(50));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).reverse();
            setMessages(msgs);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, 'messages');
        });

        return () => unsubscribe();
    }, [user]);

    const handleSend = async (e: FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;
        
        const textToSend = newMessage;
        setNewMessage('');
        
        try {
            await addDoc(collection(db, 'messages'), {
                text: textToSend,
                authorId: user.uid,
                authorName: user.displayName || 'Anonymous',
                createdAt: serverTimestamp()
            });
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, 'messages');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#090515] border border-[#3B1B8A] rounded-lg overflow-hidden font-sans">
            <div className="flex items-center justify-between p-3 border-b border-[#3B1B8A] bg-[#11012C]">
                <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-[#00F0FF]" />
                    <span className="text-xs font-bold text-[#00F0FF] uppercase tracking-widest">Spencer Group Chat</span>
                </div>
                {!user && (
                    <button onClick={loginWithGoogle} className="flex items-center space-x-1 text-[10px] bg-[#3B1B8A] hover:bg-[#00F0FF] hover:text-black text-white px-2 py-1 rounded transition-colors">
                        <LogIn className="w-3 h-3" />
                        <span>LOGIN TO CHAT</span>
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
               {!user ? (
                   <div className="h-full flex items-center justify-center text-[#5D4B8B] text-xs font-mono text-center p-4">
                       Authentication Required<br/>Connect Profile to Access Comms
                   </div>
               ) : messages.length === 0 ? (
                   <div className="h-full flex items-center justify-center text-[#5D4B8B] text-xs font-mono">
                       NO_COMMS_FOUND
                   </div>
               ) : (
                   messages.map((msg) => (
                       <div key={msg.id} className={cn("flex flex-col max-w-[85%]", msg.authorId === user.uid ? "ml-auto items-end" : "mr-auto items-start")}>
                           <span className="text-[9px] text-[#5D4B8B] mb-1">{msg.authorName}</span>
                           <div className={cn(
                               "px-3 py-2 rounded-lg text-xs leading-relaxed",
                               msg.authorId === user.uid ? "bg-[#3B1B8A] text-white rounded-br-none" : "bg-[#1A0A3A] text-[#E2D9FF] rounded-bl-none border border-[#3B1B8A]/50"
                           )}>
                               {msg.text}
                           </div>
                       </div>
                   ))
               )}
               <div ref={messagesEndRef} />
            </div>

            {user && (
                <form onSubmit={handleSend} className="p-2 border-t border-[#3B1B8A] bg-[#02000A] flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Transmit message..."
                        className="flex-1 bg-transparent border-none text-xs text-white px-2 focus:outline-none font-mono"
                    />
                    <button type="submit" disabled={!newMessage.trim()} className="p-2 text-[#00F0FF] hover:text-[#E2D9FF] disabled:opacity-50 disabled:hover:text-[#00F0FF]">
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            )}
        </div>
    );
}
