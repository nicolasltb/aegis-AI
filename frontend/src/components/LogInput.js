import React, { useState } from 'react';
import { Upload, FileText, Trash2, AlertCircle } from 'lucide-react';

const LogInput = ({ onAnalyze, isAnalyzing }) => {
  const [logs, setLogs] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (logs.trim() && !isAnalyzing) {
      onAnalyze(logs);
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogs(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const textFile = files.find(file => file.type === 'text/plain' || file.name.endsWith('.log'));
    
    if (textFile) {
      handleFileUpload(textFile);
    }
  };

  const clearLogs = () => {
    setLogs('');
  };

  const sampleLogs = `2024-07-08 10:15:23 INFO [Authentication] User login successful: user@example.com
2024-07-08 10:16:45 WARNING [Security] Multiple failed login attempts from IP 192.168.1.100
2024-07-08 10:17:12 ERROR [Database] Connection timeout to primary database
2024-07-08 10:17:30 CRITICAL [Security] Potential SQL injection attempt detected
2024-07-08 10:18:01 INFO [System] Automatic failover to backup database initiated`;

  const loadSampleLogs = () => {
    setLogs(sampleLogs);
  };

  return (
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Entrada de Logs
        </h2>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={loadSampleLogs}
            className="px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Exemplo
          </button>
          
          {logs && (
            <button
              type="button"
              onClick={clearLogs}
              className="px-3 py-1 text-sm bg-danger-600 hover:bg-danger-700 text-white rounded-lg transition-colors flex items-center"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Limpar
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={logs}
            onChange={(e) => setLogs(e.target.value)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            placeholder="Cole seus logs aqui ou arraste um arquivo .log..."
            className={`w-full h-64 p-4 bg-gray-900/50 border-2 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
              isDragOver 
                ? 'border-primary-400 bg-primary-900/20' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
            disabled={isAnalyzing}
          />
          
          {isDragOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary-500/20 rounded-lg border-2 border-primary-400 border-dashed">
              <div className="text-center">
                <Upload className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                <p className="text-primary-400 font-medium">Solte o arquivo aqui</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Upload de Arquivo
              <input
                type="file"
                accept=".log,.txt"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
                disabled={isAnalyzing}
              />
            </label>
            
            <span className="text-sm text-gray-400">
              {logs.length} caracteres
            </span>
          </div>

          <button
            type="submit"
            disabled={!logs.trim() || isAnalyzing}
            className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center ${
              !logs.trim() || isAnalyzing
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Analisando...
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Analisar Logs
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogInput;
