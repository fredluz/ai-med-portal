// src/services/forwardingService.ts
import axios from 'axios';
import { logInfo, logError } from '../utils/logger';

interface N8nForwardPayload {
    extracted_text: string; // pasted text
    originalUrl: string; // placeholder: google.com
    timestamp: string;
    extractedTextLength: number;
}

/**
 * Forwards extracted text to n8n webhook
 */
export async function sendToN8n(extractedText: string, originalUrl: string): Promise<void> {
    const n8nForwardWebhookUrl = import.meta.env.VITE_N8N_FORWARD_WEBHOOK_URL;
    const n8nForwardWebhookSecret = import.meta.env.VITE_N8N_FORWARD_WEBHOOK_SECRET;

    if (!n8nForwardWebhookUrl || !n8nForwardWebhookSecret) {
        throw new Error('n8n webhook configuration is missing');
    }

    const payload: N8nForwardPayload = {
        extracted_text: extractedText,
        originalUrl: originalUrl,
        timestamp: new Date().toISOString(),
        extractedTextLength: extractedText.length
    };

    try {
        logInfo('ForwardingService', `Forwarding extracted text to n8n webhook. URL: ${originalUrl}, Text length: ${extractedText.length}`);  
            const response = await axios.post(n8nForwardWebhookUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
                'x-webhook-secret': n8nForwardWebhookSecret
            },
            timeout: 30000 // 30 seconds timeout
        });

        if (response.status >= 200 && response.status < 300) {
            logInfo('ForwardingService', `Successfully forwarded data to n8n. Status: ${response.status}`);
        } else {
            throw new Error(`n8n webhook returned unexpected status: ${response.status}`);
        }

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status;
            const responseData = error.response?.data;
            logError('ForwardingService', `Failed to forward to n8n webhook. Status: ${statusCode}`, { responseData, originalUrl });
            throw new Error(`n8n webhook request failed with status ${statusCode}: ${error.message}`);
        } else {
            logError('ForwardingService', `Unexpected error forwarding to n8n webhook: ${error instanceof Error ? error.message : String(error)}`);
            throw new Error(`Failed to forward data to n8n: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
