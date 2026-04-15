# Daily Math Review App

Open `index.html` in a modern browser.

## First Use

1. Go to `Config`.
2. Choose `sample_questions.json` with the file picker.
3. Go to `Projector Display`.
4. Click `Build Set`.
5. Click `Projector Mode` when showing it to students.

Questions are stored in the browser with IndexedDB. Review history for spaced recall is stored in localStorage. You do not need to re-import the JSON every time unless you clear the local bank or switch browsers.

## JSON Format

The app accepts the current day-based format:

```json
[
  {
    "day": 1,
    "questions": [
      {
        "topic": "Integers",
        "questionText": "-8 + 3 = ?",
        "answerText": "-5",
        "visualSuggestion": "Number line starting at -8, jumping right 3 spaces.",
        "imageUrl": ""
      }
    ]
  }
]
```

It also accepts a flat array of questions if each question includes `day`, `topic`, `questionText`, and `answerText`.

## Math

Use TeX delimiters for math that needs formatting:

- Inline: `\\(\\frac{3}{4}\\)`
- Display: `\\[y = mx + b\\]`

For projector readability, put the instruction and math on separate lines:

```json
"questionText": "Simplify:\n\\(4y - 2(y - 1)\\)"
```

KaTeX loads from a CDN, so math rendering needs internet access. If the CDN is unavailable, the question text still appears, but TeX will remain unformatted.

## SRS Controls

- `Good` schedules the question farther out using intervals of 1, 3, 5, 9, 15, 30, 60, 90, and 120 days.
- `Again` resets the question to the first interval.
- `Spaced recall due now` builds a deck from questions due today or overdue.

## Keyboard Shortcuts

- Space: reveal answer
- Right arrow: next slide
- Left arrow: previous slide
- 1: mark again
- 2: mark good
