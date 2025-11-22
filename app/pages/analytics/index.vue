<script setup lang="ts">
import { transcripts as faTranscripts } from '~/data/transcripts/fa'
import {
    generateWordFrequencyReport,
    generateTopWordsReport,
    generateMentionReport,
    generateComparisonReport
} from '~/utils/report-generator'
import type {
    WordFrequencyReport,
    TopWordsReport,
    MentionReport,
    ComparisonReport
} from '~/types/reports'

const { t } = useI18n()

// State
const selectedReportType = ref('top-words')
const searchTerm = ref('')
const compareTerms = ref('')
const limit = ref(50)
const loading = ref(false)

// Results
const topWordsResult = ref<TopWordsReport | null>(null)
const wordFrequencyResult = ref<WordFrequencyReport | null>(null)
const mentionResult = ref<MentionReport[] | null>(null)
const comparisonResult = ref<ComparisonReport | null>(null)

// Options
const reportTypes = [
    { label: 'Top Words', value: 'top-words' },
    { label: 'Word Frequency', value: 'word-frequency' },
    { label: 'Mentions', value: 'mentions' },
    { label: 'Comparison', value: 'comparison' }
]

// Actions
const generateReport = async () => {
    loading.value = true

    // Simulate async for UI responsiveness
    await new Promise(resolve => setTimeout(resolve, 100))

    try {
        const transcriptList = Object.values(faTranscripts)

        if (selectedReportType.value === 'top-words') {
            topWordsResult.value = generateTopWordsReport(transcriptList, limit.value)
            wordFrequencyResult.value = null
            mentionResult.value = null
            comparisonResult.value = null
        } else if (selectedReportType.value === 'word-frequency') {
            if (!searchTerm.value) return
            wordFrequencyResult.value = generateWordFrequencyReport(transcriptList, searchTerm.value)
            topWordsResult.value = null
            mentionResult.value = null
            comparisonResult.value = null
        } else if (selectedReportType.value === 'mentions') {
            if (!searchTerm.value) return
            mentionResult.value = generateMentionReport(transcriptList, [searchTerm.value])
            topWordsResult.value = null
            wordFrequencyResult.value = null
            comparisonResult.value = null
        } else if (selectedReportType.value === 'comparison') {
            if (!compareTerms.value) return
            const terms = compareTerms.value.split(',').map(t => t.trim()).filter(Boolean)
            comparisonResult.value = generateComparisonReport(transcriptList, terms)
            topWordsResult.value = null
            wordFrequencyResult.value = null
            mentionResult.value = null
        }
    } catch (error) {
        console.error('Error generating report:', error)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="max-w-7xl mx-auto pt-24 px-4 pb-16">
        <div class="mb-8">
            <h1 class="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p class="text-gray-500">Analyze video transcripts and generate insights.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Sidebar / Controls -->
            <div class="lg:col-span-1 space-y-6">
                <UCard>
                    <template #header>
                        <h3 class="font-semibold">Report Settings</h3>
                    </template>

                    <div class="space-y-4">
                        <UFormGroup label="Report Type">
                            <USelect v-model="selectedReportType" :options="reportTypes" />
                        </UFormGroup>

                        <div v-if="selectedReportType === 'top-words'">
                            <UFormGroup label="Limit">
                                <UInput v-model="limit" type="number" min="1" max="500" />
                            </UFormGroup>
                        </div>

                        <div v-if="selectedReportType === 'word-frequency' || selectedReportType === 'mentions'">
                            <UFormGroup label="Search Term">
                                <UInput v-model="searchTerm" placeholder="Enter word or phrase..." />
                            </UFormGroup>
                        </div>

                        <div v-if="selectedReportType === 'comparison'">
                            <UFormGroup label="Compare Terms (comma separated)">
                                <UInput v-model="compareTerms" placeholder="term1, term2, term3" />
                            </UFormGroup>
                        </div>

                        <UButton block @click="generateReport" :loading="loading" color="primary">
                            Generate Report
                        </UButton>
                    </div>
                </UCard>
            </div>

            <!-- Results Area -->
            <div class="lg:col-span-3">
                <div v-if="!topWordsResult && !wordFrequencyResult && !mentionResult && !comparisonResult"
                    class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                    <UIcon name="i-heroicons-chart-bar" class="text-4xl text-gray-400 mb-4" />
                    <p class="text-gray-500">Select a report type and click Generate to see results.</p>
                </div>

                <!-- Top Words Result -->
                <div v-if="topWordsResult" class="space-y-6">
                    <UCard>
                        <template #header>
                            <div class="flex justify-between items-center">
                                <h3 class="font-bold">Top {{ topWordsResult.topWords.length }} Words</h3>
                                <span class="text-sm text-gray-500">Total Words: {{ topWordsResult.totalWords }}</span>
                            </div>
                        </template>

                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left">
                                <thead
                                    class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th class="px-6 py-3">Word</th>
                                        <th class="px-6 py-3">Count</th>
                                        <th class="px-6 py-3">Percentage</th>
                                        <th class="px-6 py-3">Videos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="word in topWordsResult.topWords" :key="word.word"
                                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td class="px-6 py-4 font-medium">{{ word.word }}</td>
                                        <td class="px-6 py-4">{{ word.count }}</td>
                                        <td class="px-6 py-4">{{ word.percentage.toFixed(2) }}%</td>
                                        <td class="px-6 py-4">{{ word.videoCount }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </UCard>
                </div>

                <!-- Word Frequency Result -->
                <div v-if="wordFrequencyResult" class="space-y-6">
                    <UCard>
                        <template #header>
                            <h3 class="font-bold">Frequency: "{{ wordFrequencyResult.word }}"</h3>
                        </template>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{
                                    wordFrequencyResult.count }}
                                </div>
                                <div class="text-sm text-gray-500">Occurrences</div>
                            </div>
                            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{
                                    wordFrequencyResult.percentage.toFixed(4) }}%</div>
                                <div class="text-sm text-gray-500">of Total Text</div>
                            </div>
                            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{
                                    wordFrequencyResult.videoCount }}</div>
                                <div class="text-sm text-gray-500">Videos</div>
                            </div>
                        </div>
                    </UCard>
                </div>

                <!-- Mention Result -->
                <div v-if="mentionResult" class="space-y-6">
                    <div v-for="mention in mentionResult" :key="mention.term">
                        <UCard>
                            <template #header>
                                <h3 class="font-bold">Mentions: "{{ mention.term }}"</h3>
                            </template>

                            <div class="space-y-4">
                                <div class="flex gap-4 text-sm">
                                    <span class="font-medium">Total Count: {{ mention.count }}</span>
                                    <span class="font-medium">Videos: {{ mention.videoCount }}</span>
                                </div>

                                <div class="space-y-2">
                                    <div v-for="videoMention in mention.videoMentions" :key="videoMention.videoId"
                                        class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                        <div class="font-medium mb-1 text-xs text-gray-500">Video ID: {{
                                            videoMention.videoId }} ({{
                                            videoMention.count }} times)</div>
                                        <div class="space-y-1">
                                            <div v-for="(context, idx) in videoMention.contexts" :key="idx"
                                                class="text-sm italic text-gray-600 dark:text-gray-300">
                                                "{{ context }}"
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </UCard>
                    </div>
                </div>

                <!-- Comparison Result -->
                <div v-if="comparisonResult" class="space-y-6">
                    <UCard>
                        <template #header>
                            <h3 class="font-bold">Comparison Report</h3>
                        </template>

                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left">
                                <thead
                                    class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th class="px-6 py-3">Term</th>
                                        <th class="px-6 py-3">Count</th>
                                        <th class="px-6 py-3">Share</th>
                                        <th class="px-6 py-3">Videos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="comp in comparisonResult.comparisons" :key="comp.term"
                                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td class="px-6 py-4 font-medium">{{ comp.term }}</td>
                                        <td class="px-6 py-4">{{ comp.count }}</td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-2">
                                                <span>{{ comp.percentage.toFixed(1) }}%</span>
                                                <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div class="h-full bg-blue-500"
                                                        :style="{ width: `${comp.percentage}%` }"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4">{{ comp.videoCount }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </UCard>
                </div>

            </div>
        </div>
    </div>
</template>
