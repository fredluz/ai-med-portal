// OpenAI Responses API Service for Client (adapted from backend/openaiClient.ts)
import { apiTrackingService } from '../services/apiTrackingService'
import type { StreamingCallbacks, ChatMessage } from '../types/ragTypes'

export interface ResponseOptions {
  temperature?: number
  maxTokens?: number
  stream?: boolean
  previousResponseId?: string
  callbacks?: StreamingCallbacks
  instructions?: string
  callType?: string
}

/**
 * OpenAI Responses API Service
 * Generic client for OpenAI Responses API with GPT-4o and API tracking
 * Instructions/system prompts should be provided by calling services
 * 
 * WARNING: The API key is exposed in the browser for MVP only. Do not use this in production.
 */
export class OpenAIService {
  private apiKey: string
  private baseUrl = 'https://api.openai.com/v1'
  private model = 'gpt-4o-mini'

  constructor() {
    // Use Vite/browser env variable
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY as string
  }

  async getChatResponse(
    messages: ChatMessage[], 
    options: ResponseOptions = {}
  ): Promise<{ response: string; responseId: string }> {

    const {
      temperature = 0.7,
      maxTokens = 500,
      stream = false,
      previousResponseId,
      callbacks,
      instructions,
      callType = 'unknown'
    } = options

    const input = this.formatMessagesForInput(messages)

    const requestBody = {
      model: this.model,
      input,
      ...(instructions && { instructions }),
      temperature,
      max_output_tokens: maxTokens,
      stream,
      ...(previousResponseId && { previous_response_id: previousResponseId })
    }

    // Logging for development/debug only
    console.log('\n🚀 ===== OPENAI API CALL START =====')
    console.log(`📝 Call Type: ${callType}`)
    console.log(`📡 Stream: ${stream}`)
    console.log(`🔧 Model: ${this.model}`)
    console.log(`🌡️ Temperature: ${temperature}`)
    console.log(`🎯 Max Tokens: ${maxTokens}`)
    console.log('\n📥 INPUT MESSAGES:')
    messages.forEach((msg, idx) => {
      console.log(`  ${idx + 1}. [${msg.role.toUpperCase()}]: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}`)
    })
    console.log('\n📋 FORMATTED INPUT:')
    console.log(`"${input.substring(0, 300)}${input.length > 300 ? '...' : ''}"`)
    if (instructions) {
      console.log('\n🎯 INSTRUCTIONS:')
      console.log(`"${instructions.substring(0, 200)}${instructions.length > 200 ? '...' : ''}"`)
    }
    console.log('\n📦 FULL REQUEST BODY:')
    console.log(JSON.stringify(requestBody, null, 2))
    console.log('=======================================\n')

    try {
      if (stream) {
        return await this.handleStreamingResponse(requestBody, callbacks, callType)
      } else {
        return await this.handleNonStreamingResponse(requestBody, callType)
      }
    } catch (error) {
      console.error('❌ OpenAI Responses API Error:', error)
      if (callbacks?.onError) {
        callbacks.onError(error as Error)
      }
      throw new Error(`OpenAI API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async handleNonStreamingResponse(
    requestBody: any,
    callType: string
  ): Promise<{ response: string; responseId: string }> {
    const response = await fetch(`${this.baseUrl}/responses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as any
      console.log('❌ HTTP ERROR RESPONSE:', errorData)
      throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json() as any

    if (data.status === 'failed') {
      throw new Error(`Response failed: ${data.error?.message || 'Unknown error'}`)
    }

    const responseText = this.extractTextFromOutput(data.output)

    // Logging for development/debug only
    console.log('\n✅ ===== PROCESSED RESPONSE =====')
    console.log(`📝 Call Type: ${callType}`)
    console.log(`🆔 Response ID: ${data.id}`)
    console.log(`📄 Response Text: "${responseText.substring(0, 300)}${responseText.length > 300 ? '...' : ''}"`)
    console.log(`📊 Token Usage: ${data.usage?.input_tokens || 0} in, ${data.usage?.output_tokens || 0} out`)
    console.log('================================\n')

    const inputText = requestBody.input + (requestBody.instructions ? `\nINSTRUCTIONS:\n${requestBody.instructions}` : '');
    if (data.usage && apiTrackingService?.isAvailable?.()) {
      await this.trackApiUsage(
        callType,
        data.usage.input_tokens,
        data.usage.output_tokens,
        inputText,
        responseText
      )
    }

    return {
      response: responseText,
      responseId: data.id
    }
  }

  async getEmbedding(
    inputText: string,
    callType: string = 'embedding_chunk',
    modelId: string = 'text-embedding-3-small'
  ): Promise<number[]> {
    if (!inputText || inputText.trim() === '') {
      throw new Error('Input text for embedding cannot be empty.');
    }

    const requestBody = {
      input: inputText,
      model: modelId,
    };

    const trackingInputMessage = `Embedding for: "${inputText.substring(0, 100)}..."`;

    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as any;
        throw new Error(`OpenAI Embeddings API HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json() as any;

      if (!data.object || data.object !== 'list' || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('Unexpected response structure from OpenAI Embeddings API. Expected list of embeddings.');
      }

      const embeddingObject = data.data[0];
      if (!embeddingObject || embeddingObject.object !== 'embedding' || !embeddingObject.embedding || !Array.isArray(embeddingObject.embedding)) {
        throw new Error('No valid embedding vector found in the OpenAI Embeddings API response.');
      }

      if (data.usage && data.usage.prompt_tokens && apiTrackingService?.isAvailable?.()) {
        apiTrackingService.trackApiCall({
          call_type: callType,
          token_type: 'input',
          token_count: data.usage.prompt_tokens,
          model: data.model,
          message: trackingInputMessage
        });
      }

      return embeddingObject.embedding;

    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'An unknown error occurred during the OpenAI Embeddings API request.');
    }
  }

  private async handleStreamingResponse(
    requestBody: any, 
    callbacks?: StreamingCallbacks,
    callType: string = 'unknown'
  ): Promise<{ response: string; responseId: string }> {
    const response = await fetch(`${this.baseUrl}/responses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as any
      throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`)
    }

    return new Promise((resolve, reject) => {
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''
      let responseId = ''
      let buffer = ''
      let tokenCount = 0

      callbacks?.onStart?.()

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader!.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const eventData = line.slice(6).trim()
                if (eventData === '[DONE]') continue
                try {
                  const event = JSON.parse(eventData)
                  switch (event.type) {
                    case 'response.created':
                      responseId = event.response.id
                      break
                    case 'response.output_text.delta':
                      const delta = event.delta
                      fullResponse += delta
                      tokenCount++
                      callbacks?.onToken?.(delta)
                      break
                    case 'response.completed':
                      const inputTextStream = requestBody.input + (requestBody.instructions ? `\nINSTRUCTIONS:\n${requestBody.instructions}` : '');
                      if (event.response.usage && apiTrackingService?.isAvailable?.()) {
                        await this.trackApiUsage(
                          callType,
                          event.response.usage.input_tokens,
                          event.response.usage.output_tokens,
                          inputTextStream,
                          fullResponse
                        )
                      }
                      callbacks?.onComplete?.(fullResponse)
                      resolve({ response: fullResponse, responseId })
                      return
                    case 'response.failed':
                      const error = new Error(`Response failed: ${event.response.error?.message || 'Unknown error'}`)
                      callbacks?.onError?.(error)
                      reject(error)
                      return
                    case 'response.incomplete':
                      const incompleteError = new Error(`Response incomplete: ${event.response.incomplete_details?.reason || 'Unknown reason'}`)
                      callbacks?.onError?.(incompleteError)
                      reject(incompleteError)
                      return
                  }
                } catch (parseError) {
                  // Ignore parse errors for non-JSON lines
                }
              }
            }
          }
        } catch (streamError) {
          const error = streamError as Error
          callbacks?.onError?.(error)
          reject(error)
        }
      }

      processStream()
    })
  }

  private async trackApiUsage(
    callType: string, 
    inputTokens: number, 
    outputTokens: number,
    inputMessageContent: string,
    outputMessageContent: string
  ): Promise<void> {
    apiTrackingService.trackApiCall({
      call_type: callType,
      token_type: 'input',
      token_count: inputTokens,
      model: this.model,
      message: inputMessageContent
    })

    apiTrackingService.trackApiCall({
      call_type: callType,
      token_type: 'output',
      token_count: outputTokens,
      model: this.model,
      message: outputMessageContent
    })
  }

  private formatMessagesForInput(messages: ChatMessage[]): string {
    const userMessages = messages.filter(msg => msg.role !== 'system')
    return userMessages.map(msg => {
      const rolePrefix = msg.role === 'user' ? 'User: ' : 'Assistant: '
      return rolePrefix + msg.content
    }).join('\n\n')
  }

  private extractTextFromOutput(output: any[]): string {
    if (!output || output.length === 0) {
      throw new Error('No output received from OpenAI')
    }
    const message = output[0]
    if (message.type !== 'message') {
      throw new Error('Unexpected output type from OpenAI')
    }
    const content = message.content
    if (!content || content.length === 0) {
      throw new Error('No content in OpenAI response')
    }
    const textContent = content.find((c: any) => c.type === 'output_text')
    if (!textContent) {
      throw new Error('No text content found in OpenAI response')
    }
    return textContent.text || ''
  }
}

// Export singleton instance
export const openaiService = new OpenAIService()
