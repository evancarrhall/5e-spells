/*
|--------------------------------------------------------------------------
|  app.js
|--------------------------------------------------------------------------
|  runs after html is loaded 
|  declares the <spell-card> vue component as `SpellCard` to be used in `vm`
|  initializes the main Vue instance as `vm`
| 
*/


/**
 * the reusable Vue component generated for each spell and used to populate the column(s) section of the app
 * prop - `spell` {Object} a spell object (from SPELLS.json)
 */
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

        /**
         * parses the `components` property of the `spell` prop into an easily readable string (as seen in the 5e PHB)
         * @returns {String} string as seen in the 5e PHB e.g. `V, S, M`
         */
        componentsString() {
            return this.spell.components.length === 1 || this.spell.components === "V" || this.spell.components === "S" || this.spell.components === "M"
                ? this.spell.components[0]
                : this.spell.components.join(', ');
        },

        /**
         * parses the `level`, `school.name`, and `ritual` properties of the `spell` prop
         * into an easily readable string (as seen in the 5e PHB)
         * @returns {String} string as seen in the 5e PHB e.g. `5th level illusion (ritual)`
         */
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

        /**
         * parses the `duration` and the `concentration` properties of the `spell` prop into
         * an easily readable string (as seen in the 5e PHB)
         * @returns {String} string as seen in the 5e PHB e.g. `Concentration, Up to 10 minutes`
         */
        durationText() {

            const concentration = this.spell.concentration === 'yes' ? 'Concentration, ' : '';
            return concentration + this.spell.duration;
        },

        /**
         * concatenated the usable classes from the `classes` property of the `spell` prop into
         * a comma separated string
         * @returns {String} e.g. Wizard, Druid
         */
        classesText() {

            let classes = []
            this.spell.classes.map(classObj => classes.push(classObj.name));
            return classes.join(', ');
        }
    }
}

/**
 * the main Vue instance, bound to the #app element
 */
var vm = new Vue({
    el: '#app',
    components: { 'spell-card': SpellCard },
    data: {

        // where the string stored in the searchbar input is stored
        searchString: '',

        // array container all of the spell objects from SPELLS.json
        // the `spell.isVisible` property is changed to toggle visibility
        spellList: [],

        // boolean set to true when SPELLS.json has finished being downloaded
        // controls the visibility of the loading spinner
        hasLoaded: false,
    },
    computed: {

        /**
         * splits the `searchString` data string into keywords by slitting it by the space character
         * and filtering out empty elements
         * @returns {Array} an array of keywords (strings)
         */
        searchKeywords() {
            let searchKeywords = this.searchString.toLowerCase().split(' ').filter(s => s !== '');
            return searchKeywords;
        }
    },
    methods: {

        /**
         * bound to the searchbar input element's oninput event listener
         * updates the `searchString` data string and runs `filterSpellList()`
         * 
         * Note
         * `filterSpellList()` is only run if `searchString.length` >= 3
         * this is to improve performance by preventing render/unrendering a very
         * high amounts of elements
         * @param {Event} e oninput event object
         */
        handleInput(e) {
            this.searchString = e.target.value;
            if(this.searchString.length >= 3) this.filterSpellList();
        },

        /**
         * uses indexOf to determine if the `searchKeywords` array and uses indexOf to check
         * if EVERY keyword is present on the spell object's keywords property (`spell.keywords`)
         * 
         * @param {Object} spell a spell object (from SPELLS.json)
         * @returns {Boolean} returns true if all `searchKeywords` are present on `spell`, otherwise, returns false
         */
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
            
            if(matches.length >= this.searchKeywords.length) {
                return true;
            } else return false;
        },

        /**
         * loops through all spells in the `spellList` data array and runs passes them into
         * the `isMatch` function and toggles the spells `isVisible` property to the result
         */
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

        // when the SPELLS promise (defined inline in HTML) resolves,
        // parses the response into json and stores it in the `spellList` data array
        // then set the `hasLoaded` data boolean to true
        SPELLS.then(response => {
            return response.json();
        })
        .then(json => {
            this.spellList = json;
            this.hasLoaded = true;
        })
    }
})