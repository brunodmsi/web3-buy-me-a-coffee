import { useState, useEffect } from 'react';
import { refreshContractData, checkContractDataFreshness, getContractData } from '../utils/contract';

export default function DevTools() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [contractInfo, setContractInfo] = useState(getContractData());
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Check freshness on component mount and periodically
  useEffect(() => {
    checkFreshness();
    const interval = setInterval(checkFreshness, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const checkFreshness = async () => {
    try {
      const fresh = await checkContractDataFreshness();
      setIsStale(!fresh);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking contract freshness:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const newData = await refreshContractData();
      setContractInfo(newData);
      setIsStale(false);
      setLastChecked(new Date());
      
      // Show a temporary success message
      const originalText = document.title;
      document.title = '✅ Contract Refreshed!';
      setTimeout(() => {
        document.title = originalText;
      }, 2000);
      
    } catch (error) {
      console.error('Failed to refresh contract:', error);
      alert('Failed to refresh contract data. Check console for details.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-xs text-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-yellow-400">🔧 Dev Tools</h3>
        <div className={`w-3 h-3 rounded-full ${isStale ? 'bg-red-500' : 'bg-green-500'}`} />
      </div>
      
      <div className="space-y-2 mb-3">
        <div>
          <span className="text-gray-400">Contract:</span>
          <div className="font-mono text-xs text-blue-300">
            {contractInfo.address?.slice(0, 6)}...{contractInfo.address?.slice(-4)}
          </div>
        </div>
        
        <div>
          <span className="text-gray-400">Block:</span>
          <span className="text-green-300 ml-1">{contractInfo.deploymentBlock || 'N/A'}</span>
        </div>
        
        {lastChecked && (
          <div className="text-xs text-gray-400">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}
      </div>

      {isStale && (
        <div className="bg-red-900 border border-red-600 text-red-200 p-2 rounded mb-2 text-xs">
          ⚠️ Contract data may be outdated
        </div>
      )}

      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
          isRefreshing
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh Contract'}
      </button>
      
      <div className="text-xs text-gray-400 mt-2">
        💡 Use this after redeploying your contract
      </div>
    </div>
  );
} 