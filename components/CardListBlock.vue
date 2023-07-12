<template>
  <div class="card-list-block">

    <ProjectCard
      v-for="(card, index) in cards"
      :key="`${index}-${card.name}`"
      format="list-view"
      :title="card.name"
      :description="card.description.long"
      :logo="card.logo.icon"
      :tags="card.tags"
      :url="`https:${card.primaryCta.url}`"
      :style="{ animationDelay: `${30 * index}ms` }" />

  </div>
</template>

<script>
import ProjectCard from '@/components/ProjectCard'

export default {
  name: 'CardListBlock',

  components: {
    ProjectCard
  },

  props: {
    cards: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>
