/*
    Cyrillic transcription bookmarklet

    Author: Tomas Karabela
    Source: https://github.com/tkarabela/cyrillic-bookmarklet
    Version: 1.0
*/

var lang = "en"; /* "cs", "en" */

/* ------------------------------------------------------------------------- */

function withLowercaseVariants(table) {
    var newTable = {};

    for (var key in table) {
        newTable[key] = table[key];
        newTable[key.toLowerCase()] = table[key].toLowerCase();
    }

    return newTable;
}

var czechTransliterationTable = withLowercaseVariants({
    /* Russian */
    "А": "A",  "Б": "B",  "В": "V",  "Г": "G",
    "Д": "D",  "Е": "Je", "Ё": "Jo", "Ж": "Ž",
    "З": "Z",  "И": "I",  "Й": "J",  "К": "K",
    "Л": "L",  "М": "M",  "Н": "N",  "О": "O",
    "П": "P",  "Р": "R",  "С": "S",  "Т": "T",
    "У": "U",  "Ф": "F",  "Х": "Ch", "Ц": "C",
    "Ч": "Č",  "Ш": "Š",  "Щ": "Šč", "Ы": "Y",
    "Э": "E",  "Ю": "Ju", "Я": "Ja",

    /* Ukrainian */
    "Ґ": "G",  "Є": "Je", "Ї": "Ji",

    /* Belarusian */
    "Ў": "U",

    /* Macedonian */
    "Ѓ": "ď",  "Ѕ": "Dz", "Ј": "J",  "Ќ": "Ť",
    "Љ": "Ľ",  "Њ": "Ň",  "Џ": "Dž"
});

/*
    BGN/PCGN romanization, see
    http://en.wikipedia.org/wiki/BGN/PCGN_romanization
*/
var englishTransliterationTable = withLowercaseVariants({
    /* Russian */
    "А": "A",  "Б": "B",  "В": "V",  "Г": "G",
    "Д": "D",  "Е": "Ye", "Ё": "Yë", "Ж": "Zh",
    "З": "Z",  "И": "I",  "Й": "Y",  "К": "K",
    "Л": "L",  "М": "M",  "Н": "N",  "О": "O",
    "П": "P",  "Р": "R",  "С": "S",  "Т": "T",
    "У": "U",  "Ф": "F",  "Х": "Kh", "Ц": "Ts",
    "Ч": "Ch", "Ш": "Sh", "Щ": "Shch", "Ы": "Y",
    "Э": "E",  "Ю": "Yu", "Я": "Ya",

    /* Ukrainian */
    "Ґ": "G",  "Є": "Ye", "Ї": "Yi",

    /* Belarusian */
    "Ў": "W",

    /* Macedonian */
    "Ѓ": "G",  "Ѕ": "Dz", "Ј": "J",  "Ќ": "Ť",
    "Љ": "Lj", "Њ": "Nj", "Џ": "Dž"
});

function getTranscriber(lang) {
    var table = {
        "cs": czechTransliterationTable,
        "en": englishTransliterationTable
    }[lang];

    if (table === null) {
        console.log("getTranscriber(): unknown language " + lang);
    }

    return function(text) {
        return text.replace(/./g, function(c){return table[c] || c;});
    };
}

function transcribeNode(n, transcriber) {
    /* TODO: when called twice, don't re-transcribe already finished text */

    if (n.nodeType == document.TEXT_NODE) {
        n.data = transcriber(n.data);
    } else {
        for (var i = 0; i < n.childNodes.length; i++) {
            transcribeNode(n.childNodes[i], transcriber);
        }
    }
}

function transcribeTitle(transcriber) {
    if (document.title != document._transcribed_title) {
        document.title = document._transcribed_title = transcriber(document.title);
    }
}

/* ------------------------------------------------------------------------- */
/* run the transcription */

var transcriber = getTranscriber(lang);
transcribeNode(document.body, transcriber);
transcribeTitle(transcriber);
