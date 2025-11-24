import React, { useState, useEffect } from 'react';
import { appwriteConfig } from '../services/appwrite';

/**
 * Debug component to show configuration and connection details
 */
export const AppwriteDebug: React.FC = () => {
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    const checkEnv = async () => {
      const debugInfo: any = {
        endpoint: appwriteConfig.endpoint,
        projectId: appwriteConfig.projectId,
        databaseId: appwriteConfig.databaseId,
        envVars: {
          VITE_APPWRITE_ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT,
          VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
          VITE_API_URL: import.meta.env.VITE_API_URL,
        },
      };

      // Try to fetch from health endpoint
      try {
        const healthUrl = `${appwriteConfig.endpoint}/health`;
        console.log('Testing health endpoint:', healthUrl);
        
        const response = await fetch(healthUrl, {
          headers: {
            'X-Appwrite-Project': appwriteConfig.projectId,
          },
        });
        
        debugInfo.healthCheck = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        };
        
        const data = await response.json();
        debugInfo.healthData = data;
      } catch (error: any) {
        debugInfo.healthCheckError = error.message;
      }

      setDebug(debugInfo);
    };

    checkEnv();
  }, []);

  if (!debug) return <div className="text-gray-400 text-xs">Loading debug info...</div>;

  return (
    <div className="text-xs bg-gray-900 text-gray-300 p-2 rounded font-mono max-h-40 overflow-auto border border-gray-700">
      <div className="font-bold mb-1">Appwrite Debug Info:</div>
      <pre className="whitespace-pre-wrap break-words text-xs">
        {JSON.stringify(debug, null, 2)}
      </pre>
    </div>
  );
};

export default AppwriteDebug;
