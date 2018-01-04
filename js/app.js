var SpellCard = {
    name: 'spell-card',
    template:
    `<div class="SpellCard">
        <div class="spell-card__name">{{spell.name}}</div>
        <div class="spell-card__level-school">{{levelAndSchoolText}}</div>
        <div class="spell-card__spellblock">
            {{spell.casting_time}}<strong>casting time</strong><br>
            {{spell.range}}<strong>range</strong><br>
            {{componentsString}}<strong>components</strong><br>
            {{durationText}}<strong>duration</strong><br>
        </div>
        <p class="spell-card__description" v-for="p of spell.desc" :key="p">{{p}}</p>
        <div class="spell-card__description" v-for="(p, i) of spell.higher_level" :key="i">
            <div class="spell-card__higher-level-label" v-if="spell.higher_level">At Higher Level.</div>
            {{p}}
        </div>
        <p class="spell-card__usable-classes spell-card__footer">{{classesText}}</p>
        <p class="spell-card__source spell-card__footer">{{spell.page}}</p>
    </div>`,
    props: ['spell'],
    computed: {
        componentsString() {
            return this.spell.components.length === 1 || this.spell.components === "V" || this.spell.components === "S" || this.spell.components === "M"
                ? this.spell.components[0]
                : this.spell.components.join(', ');
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

            const spellLevel = this.spell.level;
            const school = this.spell.school.name;
            const ritual = this.spell.ritual ? ' (ritual)' : '';

            let text = spellLevel === 0
                ? school[0].toUpperCase() + school.slice(1,school.length) + ' cantrip'
                : (ordinal_suffix_of(spellLevel) + ' level ' + school + ritual).toLowerCase();

            return text;
        },

        durationText() {

            const concentration = this.spell.concentration === 'yes' ? 'Concentration, ' : '';
            return concentration + this.spell.duration;
        },
        classesText() {

            let classes = []
            this.spell.classes.map(classObj => classes.push(classObj.name));
            return classes.join(', ');
        }
    },
    methods: {
        atHigherLevelText(i) {
            return i === 0 ? 'At Higher Level. ' : '';
        }
    }
}

var vm = new Vue({
    el: '#app',
    components: { 'spell-card': SpellCard },
    data: {
        searchString: '',
        spellList: [],
        hasLoaded: false,
    },
    computed: {
        searchKeywords() {
            let searchKeywords = this.searchString.toLowerCase().split(' ').filter(s => s !== '');
            return searchKeywords;
        }
    },
    methods: {
        handleInput(e) {
            this.searchString = e.target.value;
            this.filterSpellList();
        },
        isMatch(spell) {
            let matches = [];
            for(const searchKeyword of this.searchKeywords) {
                for(const spellKeyword of spell.keywords) {
                    if(spellKeyword.indexOf(searchKeyword) !== -1) {
                        matches.push(spellKeyword);
                        break;
                    }
                }
            }
            if(matches.length >= this.searchKeywords.length && this.searchString.length >= 3) {
                return true;
            }
        },
        filterSpellList() {
            for(const i of this.spellList.keys()) {
                const isMatch = this.isMatch(this.spellList[i]);
                if(isMatch !== this.spellList[i].isVisible) {
                    Vue.set(this.spellList[i], 'isVisible', isMatch);
                }
            }
        }
    },
    mounted() {
        SPELLS.then(response => {
            return response.json();
        })
        .then(json => {
            this.spellList = json;
            this.hasLoaded = true;
        })
    }
})