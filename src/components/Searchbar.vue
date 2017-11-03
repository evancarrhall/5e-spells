<template>
  <div 
    class="Searchbar z-6"
    @mousedown="handleMousedown"
    @mouseup="handleMouseup"
    @mouseout="handleMouseout"
  >
    <input 
      class="input" 
      ref="input" 
      @focus="handleFocus" 
      @blur="handleBlur"
      @input="handleInput"
    >
    <div class="iconContainer">
      <transition name="icon">
        <i class="icon material-icons" v-if="!isFocus && isEmpty">search</i>
      </transition>
    </div>
    <transition name="helpText">
        <p class="helpText" v-if="isFocus && isEmpty">{{this.helpText}}</p>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'Searchbar',
    props: ['helpText', 'onInput'],
    data() {
      return {
        isFocus: false,
        isMousedown: false,
        isEmpty: true,
        searchValue: '',
      }
    },
    computed: {
       
    },
    mounted() {},
    methods: {
      handleFocus() {
        this.isFocus = true
      },
      handleBlur() {
        this.isFocus = false
      },
      handleMousedown() {
        this.isMousedown = true
      },
      handleMouseup() {
        this.isMousedown = false
      },
      handleMouseout() {
        this.isMousedown = false
      },
      handleInput(e) {
        this.onInput && this.onInput(e)
        this.isEmpty = Boolean(e.target.value.length === 0)
      }
    },
  }
</script>

<style>
.Searchbar {
  display: flex;
  align-items: center;
  position: relative;
  background-color: #fff;
  border-radius: 0.3rem;
  font-family: Raleway, sans-serif;
  font-size: 2.4rem;
}
.Searchbar .input {
  position: relative;
  font: inherit;
  background-color: rgba(0,0,0,0);
  border: none;
  width: 100%;
  font-size: inherit;
  padding: 1.0rem;
}
.Searchbar .input:focus {
  outline: none;
}
.Searchbar .icon {
  color: rgba(0,0,0,0.2);
}
.Searchbar .iconContainer {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 1.0rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.Searchbar .icon-enter-active, .Searchbar .icon-leave-active {
  transition: all 120ms ease;
}
.Searchbar .icon-enter, .Searchbar .icon-leave-to {
  transform: scale(0, 0);
}
.Searchbar .helpText {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 1.0rem;
  font-style: italic;
  font-weight: 600;
  color: rgba(0,0,0,0.12);
  font-size: 70%;
  user-select: none;
}
.Searchbar .helpText-enter {
  opacity: 0;
}
.Searchbar .helpText-enter-active {
  transition: opacity 120ms linear;
}
</style>