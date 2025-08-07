import { useState, useEffect, useCallback } from 'react';

export interface ProcessingStatus {
  status: 'processing' | 'completed' | 'error';
  message: string;
  progress: number;
  downloadUrl?: string;
  errorMessage?: string;
  contractId?: string;
}

export interface WebhookResponse {
  status: 'success' | 'error';
  message: string;
  downloadUrl?: string;
  contractId?: string;
  error?: string;
}

export const useContractProcessing = (contractId?: string) => {
  const [status, setStatus] = useState<ProcessingStatus>({
    status: 'processing',
    message: 'Iniciando processamento do contrato...',
    progress: 0
  });

  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Função para verificar o status do contrato no n8n
  const checkContractStatus = useCallback(async (id: string) => {
    try {
      // TODO: Implementar endpoint real para verificar status
      // const response = await fetch(`/api/contract-status/${id}`);
      // const data: WebhookResponse = await response.json();
      
      // Simular resposta do webhook
      const mockResponse: WebhookResponse = {
        status: 'success',
        message: 'Contrato processado com sucesso',
        downloadUrl: 'https://drive.google.com/drive/folders/1RSgS4O0dOR4jw2UIYw3U8SKyetw8Bikj?usp=sharing',
        contractId: id
      };

      if (mockResponse.status === 'success') {
        setStatus({
          status: 'completed',
          message: mockResponse.message,
          progress: 100,
          downloadUrl: mockResponse.downloadUrl,
          contractId: mockResponse.contractId
        });
        return true; // Processamento concluído
      } else {
        setStatus({
          status: 'error',
          message: 'Erro no processamento',
          progress: 0,
          errorMessage: mockResponse.error || 'Erro desconhecido'
        });
        return true; // Processamento concluído com erro
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return false; // Continuar polling
    }
  }, []);

  // Função para iniciar o polling do status
  const startPolling = useCallback((id: string) => {
    const interval = setInterval(async () => {
      const isCompleted = await checkContractStatus(id);
      if (isCompleted) {
        clearInterval(interval);
        setPollingInterval(null);
      }
    }, 3000); // Verificar a cada 3 segundos

    setPollingInterval(interval);
  }, [checkContractStatus]);

  // Função para parar o polling
  const stopPolling = useCallback(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [pollingInterval]);

  // Função para simular o processo (para desenvolvimento) - AGORA COM 30 SEGUNDOS
  const simulateProcessing = useCallback(async () => {
    const steps = [
      { message: 'Validando dados do contrato...', progress: 10 },
      { message: 'Enviando dados para o sistema n8n...', progress: 25 },
      { message: 'Processando informações do contratante...', progress: 40 },
      { message: 'Gerando documento do contrato...', progress: 60 },
      { message: 'Aplicando formatação e assinaturas...', progress: 80 },
      { message: 'Finalizando geração do PDF...', progress: 95 },
      { message: 'Contrato gerado com sucesso!', progress: 100 }
    ];

    // Calcular tempo por etapa para totalizar exatamente 30 segundos
    const totalTime = 30000; // 30 segundos em milissegundos
    const timePerStep = Math.floor(totalTime / steps.length);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setStatus(prev => ({
        ...prev,
        message: step.message,
        progress: step.progress
      }));

      // Aguardar o tempo calculado para cada etapa
      await new Promise(resolve => setTimeout(resolve, timePerStep));
    }

    // Simular conclusão bem-sucedida com o link do Google Drive
    setTimeout(() => {
      setStatus({
        status: 'completed',
        message: 'Contrato gerado com sucesso!',
        progress: 100,
        downloadUrl: 'https://drive.google.com/drive/folders/1RSgS4O0dOR4jw2UIYw3U8SKyetw8Bikj?usp=sharing',
        contractId: contractId || 'mock-contract-id'
      });
    }, 500);
  }, [contractId]);

  // Função para processar resposta do webhook do n8n
  const processWebhookResponse = useCallback((response: WebhookResponse) => {
    if (response.status === 'success') {
      setStatus({
        status: 'completed',
        message: response.message,
        progress: 100,
        downloadUrl: response.downloadUrl,
        contractId: response.contractId
      });
    } else {
      setStatus({
        status: 'error',
        message: 'Erro no processamento',
        progress: 0,
        errorMessage: response.error || 'Erro desconhecido'
      });
    }
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    status,
    setStatus,
    startPolling,
    stopPolling,
    simulateProcessing,
    processWebhookResponse,
    checkContractStatus
  };
}; 