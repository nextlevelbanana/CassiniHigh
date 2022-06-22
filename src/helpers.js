export const getItemName = (part, number) => {
    const table = {
        "hair": [
            "fantastic green",
            "fluffbun",
            "goldeneye-hawk",
            "iced stache",
            "purppoof",
            "bomber"
        ],
        "top": [
            "skull cap tee",
            "business battle vest",
            "unicorn scale crop top",
            "hot electrician bomber",
            "alien peace tank",
            "not MY moon hoodie"
        ],
        "bottom": [
            "sunset station leggings",
            "wormhole joggers",
            "superduper undies"
        ],
        "feet": [
            "fly sandals",
            "booster sneakers"
        ]};

        return table[part][number - 1];
}