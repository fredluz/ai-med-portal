// API Tracking Service for Client (browser-compatible, real tracking)
import { insertApiTrackingRecord, getApiTrackingStats } from '../utils/supabaseClient'
import type { ApiTrackingRecord, UsageStats, ModelUsage, ModelCostConfig } from '../types/ragTypes'

// Define model costs per 10,000 tokens (for cost calculation)
const modelCosts: ModelCostConfig = {
  'gpt-4o': { input: 0.025, output: 0.10 },
  'text-embedding-3-small': { input: 0.0002, output: 0.0002 }
}

class ApiTrackingService {
  isAvailable(): boolean {
    return true
  }

  async trackApiCall(record: ApiTrackingRecord): Promise<void> {
    await insertApiTrackingRecord(record)
  }

  async getUsageStats(timeRange?: string): Promise<UsageStats | null> {
    const { data: records, error } = await getApiTrackingStats(timeRange)
    if (error || !records) return null

    const usageSummary: Record<string, ModelUsage> = {}
    let grandTotalCost = 0

    for (const record of records) {
      const modelName = record.model
      const costConfig = modelCosts[modelName]
      if (!costConfig) continue

      if (!usageSummary[modelName]) {
        usageSummary[modelName] = {
          inputTokens: 0,
          outputTokens: 0,
          otherTokens: 0,
          totalTokens: 0,
          cost: 0
        }
      }

      let recordCost = 0
      const tokensIn10kBlocks = record.token_count / 10000

      if (record.token_type === 'input') {
        usageSummary[modelName].inputTokens += record.token_count
        recordCost = tokensIn10kBlocks * costConfig.input
      } else if (record.token_type === 'output') {
        usageSummary[modelName].outputTokens += record.token_count
        recordCost = tokensIn10kBlocks * costConfig.output
      } else {
        usageSummary[modelName].otherTokens += record.token_count
        recordCost = tokensIn10kBlocks * costConfig.input
      }

      usageSummary[modelName].totalTokens += record.token_count
      usageSummary[modelName].cost += recordCost
      grandTotalCost += recordCost
    }

    for (const modelKey in usageSummary) {
      if (usageSummary.hasOwnProperty(modelKey)) {
        const modelData = usageSummary[modelKey]
        if (modelData && typeof modelData.cost === 'number') {
          modelData.cost = parseFloat(modelData.cost.toFixed(4))
        }
      }
    }
    grandTotalCost = parseFloat(grandTotalCost.toFixed(4))

    return {
      summary: usageSummary,
      grandTotalCost,
      details: records
    }
  }
}

export const apiTrackingService = new ApiTrackingService()
