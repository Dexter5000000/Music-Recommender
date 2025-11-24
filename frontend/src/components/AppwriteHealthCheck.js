import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState } from 'react';
import { account } from '../services/appwrite';
/**
 * Test component to verify Appwrite connection
 */
export const AppwriteHealthCheck = () => {
    const [status, setStatus] = useState('checking');
    const [message, setMessage] = useState('Checking Appwrite connection...');
    React.useEffect(() => {
        const checkConnection = async () => {
            try {
                // Try to check server health
                const response = await account.get();
                setStatus('connected');
                setMessage('✅ Appwrite is connected');
            }
            catch (error) {
                if (error.message.includes('401')) {
                    // 401 is expected when not authenticated - means server is reachable
                    setStatus('connected');
                    setMessage('✅ Appwrite server is reachable (not authenticated)');
                }
                else {
                    setStatus('error');
                    setMessage(`❌ ${error.message || 'Failed to connect to Appwrite'}`);
                }
            }
        };
        checkConnection();
    }, []);
    const statusColors = {
        checking: 'bg-yellow-500',
        connected: 'bg-green-500',
        error: 'bg-red-500',
    };
    return (_jsx("div", { className: `${statusColors[status]} text-white px-4 py-2 rounded text-sm`, children: message }));
};
export default AppwriteHealthCheck;
