<template>
  <div
    class="SpellCard z-2"
  >
    <div class="name">{{spell.name}}</div>
    <div class="levelAndSchool">{{levelAndSchoolText}}</div>
    <div class="spellblock">
      <div class="castingTime spellblock">{{spell.casting_time}}<strong>casting time</strong></div>
      <div class="range spellblock">{{spell.range}}<strong>range</strong></div>
      <div class="components spellblock">{{componentsString}}<strong>components</strong></div>
      <div class="duration spellblock">{{durationText}}<strong>duration</strong></div>
    </div>
    <div class="description"><p class="description" v-for="p of spell.desc" :key="p">{{p}}</p></div>
    <div class="description" v-for="(p, i) of spell.higher_level" :key="i"><div class="atHigherLevelLabel">{{atHigherLevelText(i)}}</div>{{p}}</div>
    <div class="source">{{spell.page}}</div>
  </div>
</template>

<script>
  export default {
    name: 'SpellCard',
    props: ['spell'],
    data() {
      return {}
    },
    computed: {
      // spell() {
      //   return SPELLS[this.spellId]
      // },

      componentsString() {
        return this.spell.components.length === 1 || this.spell.components === "V" || this.spell.components === "S" || this.spell.components === "M"
          ? this.spell.components[0]
          : this.spell.components.join(', ')
      },

      levelAndSchoolText() {

        function ordinal_suffix_of(i) {
          var j = i % 10,
              k = i % 100;
          if (j == 1 && k != 11) {
              return i + "st";
          }
          if (j == 2 && k != 12) {
              return i + "nd";
          }
          if (j == 3 && k != 13) {
              return i + "rd";
          }
          return i + "th";
        }

        const spellLevel = this.spell.level
        const school = this.spell.school.name
        const ritual = this.spell.ritual ? ' (ritual)' : ''

        let text = spellLevel === 0 ?
         school[0].toUpperCase() + school.slice(1,school.length) + ' cantrip' :
         (ordinal_suffix_of(spellLevel) + ' level ' + school + ritual).toLowerCase()
    
        return text
      },

      durationText() {

        const concentration = this.spell.concentration === 'yes' ? 'Concentration, ' : ''
        return concentration + this.spell.duration
      }
    },
    methods: {
      atHigherLevelText(i) {
        return i === 0 ? 'At Higher Level. ' : ''
      }
    }
  }
</script>

<style>
.SpellCard {
  max-width: 35.0rem;
  padding: 2.4rem 1.8rem;
  background-color: #fff;
  font-family: Roboto, Noto, sans-serif;
  border-radius: 0.3rem;
}
.SpellCard .name {
  font-size: 2.4rem;
  color: rgba(0,0,0,0.9);
}
.SpellCard .levelAndSchool {
  font-size: 1.6rem;
  color: rgba(0,0,0,0.45);
  margin-bottom: 1.2rem;
  font-style: italic;
}
.SpellCard .spellblock {
  font-size: 1.8rem;
  color: rgba(0,0,0,0.77);
  line-height: 1.8rem;
}
.SpellCard .spellblock strong {
  padding-left: 0.5rem;
  color: rgba(0,0,0,0.45);
  font-size: 1.2rem;
  font-weight: 500;
}
.SpellCard .description {
  font-size: 1.4rem;
  color: rgba(0,0,0,0.77);
  text-align: justify;
  text-justify: distribute;
  padding-top: 0.8rem;
}
.SpellCard .description p {
  padding-bottom: 0.5rem;
}
.SpellCard strong {

}
.SpellCard .source {
  text-transform: uppercase;
  text-align: right;
  font-size: 1.0rem;
  padding-top: 2.0em;
  color: #555;
}
.SpellCard .atHigherLevelLabel {
  font-style: italic;
  display: inline-block;
  padding-right: 0.6rem;
  color: rgba(0,0,0,0.45);
  font-size: 1.4rem;
}
</style>