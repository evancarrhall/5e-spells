<template>
  <div id="app">
    <div class="columnContainer" 
      :style="{
        'column-count': visibleSpellCount === 1 ? 1 : numberOfCols,
        width: appWidth}">
      <Searchbar
        class="search"
        :helpText="'druid third... 6th... magic missile...'"
        :onInput="handleInput"
      />
      <SpellCard
        class="spell"
        v-for="spell of spellList" :key="spell.name"
        v-show="spell.isVisible"
        :spell="spell"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import SPELLS from './assets/SPELLS'
import Searchbar from './components/Searchbar'
import SpellCard from './components/SpellCard'
  export default {
    name: 'App',
    components: {Searchbar, SpellCard},
    data() {
      return {
        searchString: '',
        spellList: SPELLS,
        visibleSpellCount: SPELLS.length,
        numberOfCols: 1,
      }
    },
    computed: {
      searchKeywords() {
        let searchKeywords = this.searchString.toLowerCase().split(' ').filter(s => s !== '')
        return searchKeywords
      },
      appWidth() {
        let width = this.numberOfCols * (356 + 10)
        return width + "px"
      }
    },
    mounted() {
      this.calculateColumns()
      window.addEventListener('resize', this.handleResize)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      handleInput(e) {
        this.searchString = e.target.value
        this.filterSpellList()
      },
      isMatch(spell) {
        let matches = 0
        for(const searchKeyword of this.searchKeywords) {
          for(const spellKeyword of spell.keywords) {
            spellKeyword.indexOf(searchKeyword) !== -1 && matches++
          }
        }
        if(matches >= this.searchKeywords.length) return true
      },
      filterSpellList() {
        for(const i of this.spellList.keys()) {
          const isMatch = this.isMatch(this.spellList[i])
          if(isMatch !== this.spellList[i].isVisible) { 
            Vue.set(this.spellList[i], 'isVisible', isMatch)
            isMatch ? this.visibleSpellCount++ : this.visibleSpellCount--
          }
        }
      },
      calculateColumns() {
        let width = document.documentElement.clientWidth
        let cols = Math.floor( (width - 24) / 356 )
        this.numberOfCols = cols === 0 ? 1 : cols
      },
      handleResize() {
        this.calculateColumns()
      }
    }
  }
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-size: 62.5%;
}
html {
  height: 100%;
  width: 100%;
  background-color: #cdcdcd;
  overflow-y: scroll;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 1.2rem;
  display: flex;
  justify-content: center;
}
.columnContainer {
  display: block;
  column-width: 35.0rem;
  column-fill: balance;
  column-gap: 0px;
}
.search.Searchbar {
  float: left;
  width: 35.0rem;
  margin: 0.4rem 0.3rem 1.6rem 0.3rem;
}
.spell.SpellCard {
  display: inline-block;
  width: 35.0rem;
  margin: 0.4rem 0.3rem;
}

@media (max-width: 390px) {
  .columnContainer {
    width: 100%!important;
  }
  .search.Searchbar {
    width: 100%!important;
  }
  .spell.SpellCard {
    width: 100%!important;
  }
}
</style>