<script setup>
import { useDailyWord } from '@/composables/UseDailyWord'
const { dailyWord, dailyDate } = useDailyWord()
</script>

<template>
  <div class="px-4 pt-8 text-center">
    <img
      src="/DCSHome.png"
      alt="Welcome to Digital Creature Sketchbook!"
      class="mx-auto h-auto md:w-[760px] max-w-full"
    />

    <span class="block text-black font-semibold mb-6">
      <h1>This is a platform for artists to draw all kinds of creatures or general art based on the daily word!</h1>
      <br><br>
      <b>RULES:</b>
      <br>
      As long as the uploaded art matches the overall theme of the daily word, you are free to upload
      <br>
      anything your heart desires! There is no limit to creativity on this page!
      <br>
      Please enjoy your artistic journey through this simple sketchbook
      <br>
      as much as possible!
    </span>

    <span class="text-2xl font-bold mb-2" >WORD OF THE DAY:  </span>
    <span class="text-3xl uppercase text-white drop-shadow-[0_0_3px_black]" style="font-family: 'Lapsus Pro';">{{ dailyWord }}</span>
    <p class="text-sm text-black">{{ dailyDate }} (changes according to UTC timezone)</p>
  </div>
</template>