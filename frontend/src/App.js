import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LogInput from './components/LogInput';
import AnalysisResults from './components/AnalysisResults';
import { analysisAPI } from './services/api';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Check connection status on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      await analysisAPI.healthCheck();
      setConnectionStatus('connected');
    } catch (err) {
      console.error('Connection check failed:', err);
      setConnectionStatus('disconnected');
    }
  };

  const handleAnalyzeLogs = async (logs) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analysisAPI.analyzeLogs(logs);
      setAnalysisResult(result);
      setConnectionStatus('connected');
    } catch (err) {
      console.error('Analysis failed:', err);
      if (err.response) {
        setError(`Erro do servidor: ${err.response.data?.error || err.response.statusText}`);
      } else if (err.request) {
        setError('Erro de conexão: Verifique se o backend está rodando');
        setConnectionStatus('disconnected');
      } else {
        setError(`Erro inesperado: ${err.message}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <Header 
          isAnalyzing={isAnalyzing} 
          connectionStatus={connectionStatus}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <LogInput 
              onAnalyze={handleAnalyzeLogs}
              isAnalyzing={isAnalyzing}
            />
            
            {/* Connection Status Info */}
            <div className="glass-effect rounded-lg p-4 border border-white/20">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Status do Sistema</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Backend Local:</span>
                  <span className={connectionStatus === 'connected' ? 'text-success-400' : 'text-danger-400'}>
                    {connectionStatus === 'connected' ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IA Local (Llama3):</span>
                  <span className={connectionStatus === 'connected' ? 'text-success-400' : 'text-gray-400'}>
                    {connectionStatus === 'connected' ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IA Online (Gemini):</span>
                  <span className={connectionStatus === 'connected' ? 'text-success-400' : 'text-gray-400'}>
                    {connectionStatus === 'connected' ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div>
            <AnalysisResults 
              result={analysisResult}
              error={error}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>Aegis AI © 2024 - Sistema de Análise de Logs com Inteligência Artificial</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
