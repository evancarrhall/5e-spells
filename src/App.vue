<template>
  <div id="app">
    <Searchbar
      class="search"
      :helpText="'druid third... 6th... fireball...'"
      :onInput="handleInput"
    />
    <SpellCard
      class="spell"
      v-for="spell of spellList" :key="spell.name"
      v-show="spell.isVisible"
      :spell="spell"
    />
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
      }
    },
    computed: {
      searchKeywords() {
        let searchKeywords = this.searchString.toLowerCase().split(' ').filter(s => s !== '')
        return searchKeywords
      }
    },
    mounted() {
      for(const i of this.spellList.keys()) {
        this.spellList[i].keywords = this.getSpellKeywords(this.spellList[i])
        Vue.set(this.spellList[i], 'isVisible', true)
      }
    },
    methods: {
      handleInput(e) {
        this.searchString = e.target.value
        this.filterSpellList()
      },
      getSpellKeywords(spell) {
        let keywords = []
        keywords.push(spell.name)
        for(const classObj of spell.classes) keywords.push(classObj.name)
        keywords.push(ordinal_suffix_of(spell.level))
        if(spell.level !== 0) keywords.push(ordinal_string_of(spell.level))
        keywords = keywords.map((s) => s.toLowerCase())
        return keywords

        function ordinal_string_of(i) {
          if(i === 1) return 'first'
          if(i === 2) return 'second'
          if(i === 3) return 'third'
          if(i === 4) return 'fourth'
          if(i === 5) return 'fifth'
          if(i === 6) return 'sixth'
          if(i === 7) return 'seventh'
          if(i === 8) return 'eighth'
          if(i === 9) return 'ninth'
          if(i === 10) return 'tenth'
        }

        function ordinal_suffix_of(i) {
          if(i === 0) return 'Cantrip'
          var j = i % 10,
              k = i % 100;
          if (j == 1 && k != 11) {
              return i + "st level";
          }
          if (j == 2 && k != 12) {
              return i + "nd level";
          }
          if (j == 3 && k != 13) {
              return i + "rd level";
          }
          return i + "th level";
        }
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
          Vue.set(this.spellList[i], 'isVisible', this.isMatch(this.spellList[i]))
        }
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
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 1.2rem;
}
.search.Searchbar {
  flex: none;
  margin-bottom: 1.6rem;
}
.spell.SpellCard {
  margin: 0.4rem 0;
  flex: 1 1 auto;
}

@media (max-width: 375px) {
  .search.Searchbar {
    width: 100%;
  }
  .spell.SpellCard {
    width: 100%;
  }
}
</style>