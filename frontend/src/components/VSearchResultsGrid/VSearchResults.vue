<script setup lang="ts">
import { useI18n } from "#imports"
import { computed } from "vue"

import type { SupportedMediaType } from "#shared/constants/media"
import type { Results } from "#shared/types/result"
import { useMediaStore } from "~/stores/media"
import { useSearchStore } from "~/stores/search"

import VSearchResultsTitle from "~/components/VSearchResultsTitle.vue"
import VMediaCollection from "~/components/VSearchResultsGrid/VMediaCollection.vue"
import VLoadMore from "~/components/VLoadMore.vue"
import VExternalSearchForm from "~/components/VExternalSearch/VExternalSearchForm.vue"
import VContentLink from "~/components/VContentLink/VContentLink.vue"

const props = defineProps<{
  searchTerm: string
  results: Results
  isFetching: boolean
}>()

defineEmits<{ "load-more": [] }>()

const { t } = useI18n()
const mediaStore = useMediaStore()
const searchStore = useSearchStore()

const collectionLabel = computed(() => {
  return t(`browsePage.aria.resultsLabel.${props.results.type}`, {
    query: props.searchTerm,
  })
})
const contentLinkPath = (mediaType: SupportedMediaType) =>
  searchStore.getSearchPath({ type: mediaType })

const resultCounts = computed(() => mediaStore.resultCountsPerMediaType)
</script>

<template>
  <VMediaCollection
    :collection-label="collectionLabel"
    :results="results"
    :is-fetching="isFetching"
    :search-term="searchTerm"
    kind="search"
  >
    <template #header>
      <header v-if="searchTerm" class="my-0 md:mb-8 md:mt-4">
        <VSearchResultsTitle
          :search-term="searchTerm"
          :size="results.type === 'all' ? 'large' : 'default'"
          :search-type="results.type"
          :result-counts="resultCounts"
          >{{ searchTerm }}</VSearchResultsTitle
        >
      </header>

      <div
        v-if="results.type === 'all'"
        class="mb-4 mt-2 grid grid-cols-2 gap-4 md:mt-0"
      >
        <VContentLink
          v-for="[mediaType, count] in resultCounts"
          :key="mediaType"
          :media-type="mediaType"
          :search-term="searchTerm"
          :results-count="count"
          :to="contentLinkPath(mediaType)"
        />
      </div>
    </template>
    <template #footer>
      <footer class="mb-6 mt-4 lg:mb-10">
        <VLoadMore
          :search-type="results.type"
          kind="search"
          :search-term="searchTerm"
          :is-fetching="isFetching"
          class="mb-4"
          @load-more="$emit('load-more')"
        />
        <VExternalSearchForm
          v-if="results.type !== 'all'"
          :search-term="searchTerm"
          :is-supported="true"
          :has-no-results="false"
        />
      </footer>
    </template>
  </VMediaCollection>
</template>
