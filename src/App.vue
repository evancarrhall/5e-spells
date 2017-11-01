<template>
  <div id="app">
    <Searchbar
      class="search"
      :helpText="'druid cantrip... 6th... fireball...'"
      :onInput="handleInput"
    />
    <SpellCard
      class="spell"
      v-for="spell of spellList" :key="spell.name"
      :spell="spell"
    />
  </div>
</template>

<script>
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
      SPELLS() {
        return SPELLS
      },
      searchKeywords() {
        let searchKeywords = this.searchString.toLowerCase().split(' ').filter(s => s !== '')
        return searchKeywords
      }
    },
    mounted() {
      for(const i of SPELLS.keys()) {
        SPELLS[i].keywords = this.getSpellKeywords(SPELLS[i])
      }
    },
    methods: {
      handleInput(e) {
        this.searchString = e.target.value
        this.searchString === '' ? this.spellList = SPELLS : this.filterSpellList()
      },
      getSpellKeywords(spell) {
        let keywords = []
        keywords.push(spell.name)
        for(const classObj of spell.classes) keywords.push(classObj.name)
        keywords.push(ordinal_suffix_of(spell.level))
        keywords = keywords.map((s) => s.toLowerCase())
        return keywords

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
        let filteredSpellList = []
        for(const spell of SPELLS) {
          if(this.isMatch(spell)) filteredSpellList.push(spell)
        }
        this.spellList = filteredSpellList
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
body {
  
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