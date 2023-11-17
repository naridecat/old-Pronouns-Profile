import { writable } from 'svelte/store';

export const pluginData = writable({
  birthdayValue: new Date(),
  genderValue: "",
  Pronouns: []
});