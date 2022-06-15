- change "group_name" to the name of the scene. "floof", "turbo", etc.
- don't change any of the other file names.
- A kid can have one of 3 attitudes toward you: dislike, like, unsure. Thus, a set of dialogs for each mood. They will get pulled in order. 
- $name will be auto-replaced with the player's name. $scene will be auto-replaced with group_name. If you want other $replacements, let me know.
- this is all placeholder dialogue (and numbers).
- opinions: this is how much your conversation will affect their attitude. This way, a "what?" answer might be positive for some groups and negative for others.
- opinions some more: asking to sit at their table will also influence their attitude toward you (based on how they already feel).
- scores: this is how much the kid likes every item in the game, on a scale from 0 to 1. The ids are numbers that correspond to the filenames of the assets. I don't expect you to do anything with this now, or possibly ever, we'll see who ends up hashing it out.


And because consistency is for chumps, I divided the lunch files by day instead of attitude. These are all one-liners, though if you wanted to add the player's initial question, or responses to the kid, or whatever, we can do that. 
- canSitOnUnsure: will this group let you sit with them even if they're not sure about you? Maybe not on day 1, but maybe on day 4. Set it to true or false (no quotes) per day.

If you haven't worked with JSON before (if you have, forgive my insulting your intelligence here)...
- It is picky about double quotes. if you want to use double quotes inside the dialog, that's fine, you just have to escape them:
"goodTip": "I gotta go. Something about \"responsibilities.\""
- You can use line breaks with \n:
"goodTip": "I gotta go.\nSomething about \"responsibilities.\""

