import React from 'react';
import { Shield, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const Header = ({ isAnalyzing, connectionStatus }) => {
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'disconnected':
        return <AlertTriangle className="w-5 h-5 text-danger-500" />;
      default:
        return <Activity className="w-5 h-5 text-warning-500 animate-pulse" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado';
      case 'disconnected':
        return 'Desconectado';
      default:
        return 'Verificando...';
    }
  };

  return (
    <header className="glass-effect rounded-xl p-6 mb-8 border border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Aegis AI
            </h1>
            <p className="text-gray-300 text-sm">
              Sistema Avançado de Análise de Logs com IA
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-primary-400">
              <Activity className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium">Analisando...</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${
              connectionStatus === 'connected' ? 'text-success-400' :
              connectionStatus === 'disconnected' ? 'text-danger-400' :
              'text-warning-400'
            }`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
