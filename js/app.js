var SpellCard = {
    name: 'spell-card',
    template:
    `<div class="SpellCard">
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
        <div class="footer">
            <div class="classes">{{classesText}}</div>
            <div class="source">{{spell.page}}</div>
        </div>
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
        loading: false
    },
    computed: {
        searchKeywords() {
            let searchKeywords = this.searchString.toLowerCase().split(' ').filter(s => s !== '');
            return searchKeywords;
        },
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
            if(matches.length >= this.searchKeywords.length) {
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
        
        let html =
        `<div>
            <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
                <path opacity="0.5" fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                    C22.32,8.481,24.301,9.057,26.013,10.047z">
                </path>
            </svg>
        </div>`;
        let el = document.querySelector('.loadingspinner');
        el.innerHTML = html;
        this.loading = true;
        SPELLS.then(response => {
            return response.json();
        })
        .then(json => {
            json.forEach(spell => { 
                this.spellList.push(spell);
            });
            this.loading = false;
        })
    }
})