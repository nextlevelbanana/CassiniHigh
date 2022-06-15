import { readable, writable } from 'svelte/store';

export const kids = readable(["floof", "turbo"]);

export const name = writable("Blorbo");
export const pronoun_nom = "he";
export const pronoun_pos = "his";
export const pronoun_obj = "him";
export const pronoun_refl = "himself";

export const goalGroup = writable("");
export const hair = writable("1");
export const top = writable("1");
export const bottom = writable("1");
export const feet = writable("1");

export const itemsInView = writable("hair");
export const putOn = writable("1");
export const currentScene = writable("title");

export const days = readable(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
export const currentDay = writable(0);

export const reps = writable({
    floof: 0.5,
    turbo: 0.5
})

export const threshholds = readable({unsure: 0.3, like: 0.7});
export const counts = writable({
    turbo: {dislike: 0, unsure: 0, like: 0},
    floof: {dislike: 0, unsure: 0, like: 0}
    });