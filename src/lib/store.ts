import { writable } from 'svelte/store';

export interface Pronoun {
    Name: string;
    Emoji: string;
}

export interface SNS {
    Name: string;
    Type: string; // Twitter, Discord, Facebook, Instagram
    Url: string; // URL to the user's SNS profile

}

interface PluginData {
    birthdayValue: Date;
    genderValue: string;
    Pronouns: Pronoun[];
    SNS: SNS[];
}

// Initialize the store with an empty array for SNS
export const pluginData = writable<PluginData>({
    birthdayValue: new Date(),
    genderValue: "",
    Pronouns: [],
    SNS: [] // Initially empty, will hold SNS objects
});
