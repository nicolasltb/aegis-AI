import React from 'react';
import { Brain, Shield, Lightbulb, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AnalysisResults = ({ result, error, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <div className="glass-effect rounded-xl p-8 border border-white/20 text-center">
        <div className="animate-pulse-slow">
          <Brain className="w-16 h-16 text-primary-400 mx-auto mb-4" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Analisando Logs...</h3>
        <p className="text-gray-300">A IA está processando seus logs e gerando recomendações</p>
        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-effect rounded-xl p-6 border border-danger-500/30 bg-danger-900/20">
        <div className="flex items-start space-x-4">
          <XCircle className="w-6 h-6 text-danger-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-danger-400 mb-2">Erro na Análise</h3>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-effect rounded-xl p-8 border border-white/20 text-center">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Pronto para Análise</h3>
        <p className="text-gray-300">Insira seus logs acima para iniciar a análise com IA</p>
      </div>
    );
  }

  const getSeverityColor = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('crítico') || lowerText.includes('critical') || lowerText.includes('erro') || lowerText.includes('error')) {
      return 'text-danger-400';
    }
    if (lowerText.includes('aviso') || lowerText.includes('warning') || lowerText.includes('atenção')) {
      return 'text-warning-400';
    }
    if (lowerText.includes('sucesso') || lowerText.includes('success') || lowerText.includes('ok')) {
      return 'text-success-400';
    }
    return 'text-blue-400';
  };

  const getSeverityIcon = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('crítico') || lowerText.includes('critical') || lowerText.includes('erro') || lowerText.includes('error')) {
      return <AlertTriangle className="w-5 h-5 text-danger-400" />;
    }
    if (lowerText.includes('sucesso') || lowerText.includes('success') || lowerText.includes('ok')) {
      return <CheckCircle className="w-5 h-5 text-success-400" />;
    }
    return <Brain className="w-5 h-5 text-primary-400" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Technical Summary */}
      <div className="glass-effect rounded-xl p-6 border border-white/20">
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-primary-400 mr-3" />
          <h3 className="text-xl font-semibold text-white">Resumo Técnico</h3>
          <div className="ml-auto flex items-center text-sm text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-lg p-4">
          <SyntaxHighlighter
            language="text"
            style={oneDark}
            customStyle={{
              background: 'transparent',
              padding: 0,
              margin: 0,
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            {result.resumo_tecnico || 'Nenhum resumo disponível'}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* AI Recommendations */}
      {result.recomendacoes_gemini && (
        <div className="glass-effect rounded-xl p-6 border border-white/20">
          <div className="flex items-center mb-4">
            <Lightbulb className="w-6 h-6 text-warning-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Recomendações de Segurança</h3>
            <div className="ml-auto">
              {getSeverityIcon(result.recomendacoes_gemini.recomendacoes || '')}
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className={`prose prose-invert max-w-none ${getSeverityColor(result.recomendacoes_gemini.recomendacoes || '')}`}>
              <SyntaxHighlighter
                language="markdown"
                style={oneDark}
                customStyle={{
                  background: 'transparent',
                  padding: 0,
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: '1.6',
                }}
              >
                {result.recomendacoes_gemini.recomendacoes || 'Nenhuma recomendação disponível'}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-effect rounded-lg p-4 border border-white/20 text-center">
          <Shield className="w-8 h-8 text-primary-400 mx-auto mb-2" />
          <div className="text-sm text-gray-400">Status</div>
          <div className="text-white font-semibold">Análise Completa</div>
        </div>
        
        <div className="glass-effect rounded-lg p-4 border border-white/20 text-center">
          <Brain className="w-8 h-8 text-success-400 mx-auto mb-2" />
          <div className="text-sm text-gray-400">IA Local</div>
          <div className="text-white font-semibold">Llama3</div>
        </div>
        
        <div className="glass-effect rounded-lg p-4 border border-white/20 text-center">
          <Lightbulb className="w-8 h-8 text-warning-400 mx-auto mb-2" />
          <div className="text-sm text-gray-400">IA Online</div>
          <div className="text-white font-semibold">Gemini</div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
