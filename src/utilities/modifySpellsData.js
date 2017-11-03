/*
|--------------------------------------------------------------------------
| modifySpellData.js
|--------------------------------------------------------------------------
| Given a json file from http://www.dnd5eapi.co/, this utility will
| add a keywords array and isVisible = true to each spell object
| 
*/

var SPELLS = require('../assets/SPELLS.json')
const fs = require('fs')

for(const i of SPELLS.keys()) {
    SPELLS[i].keywords = getSpellKeywords(SPELLS[i])
    SPELLS[i].isVisible = true
}

json = JSON.stringify(SPELLS)
fs.writeFile('../assets/SPELLS2.json', json, 'utf8');

function getSpellKeywords(spell) {
    let keywords = []
    keywords.push(spell.name)
    for(const classObj of spell.classes) keywords.push(classObj.name)
    keywords.push(ordinal_suffix_of(spell.level))
    if(spell.level !== 0) keywords.push(ordinal_string_of(spell.level))
    if(spell.ritual === 'yes') keywords.push('ritual')
    keywords.push(spell.school.name)
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
}