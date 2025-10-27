

language arts teacher - love grouping and collaboration

need students up and moving around the room
logistical nightmare!

power team: students get up, have notes

instead of ding independently, take notes on paper to have things to talk about
move around the room30 seconds to share an idea and then they move and find a new person

groups of 5 in one part, 

challenge: get students up and connecting with a person for <time datetime="
timer for amount of time for activity to be done

5 minutes - settable by teacher"></time>

matched with a person
start timer for actiity
sets timer for meeting time as well
30 seconds to meet

don't want people to be matched with same person
group of 3 is ok, 1:1 conversations

simple text box to copy and paste names into the box

want to save the class based on that

# Project Brief: Classroom Conversation Timer

## 1. Overview & Purpose

**Project Name:** Classroom Conversation Timer
**Primary User:** Teacher in a classroom setting
**Core Problem:** Teachers need a simple tool to manage structured, timed, paired student conversations. The goal is to maximize the number of unique interactions each student has within a defined class period or activity block.

This single-page web application provides a real-time display, suitable for projection, that automates the process of creating groups, timing conversations, and transitioning between rounds. It also provides a post-activity report detailing who met with whom.

## 2. Core Features & Functionality

The application is divided into three main screens: Setup, Live Activity, and Results.

### 2.1. Setup Screen (`#setup-screen`)

This is the initial configuration interface for the teacher.

*   **Class Name Input:** A text field to name the current class (e.g., "Period 3 English"). This name is used as a key for saving and retrieving the student list.
*   **Student Roster Input:** A large textarea where the teacher can paste a list of student names, with one name per line.
*   **Persistence:**
    *   **Save Names:** A button that saves the current student list to the browser's `localStorage` under the provided Class Name.
    *   **Auto-Load:** The application automatically loads the student list associated with the Class Name as the teacher types it. It also remembers and loads the last used class on page load.
*   **Time Configuration:**
    *   **Total Activity Time:** A number input for the entire duration of the activity (in minutes).
    *   **Time per Conversation:** A number input for the duration of each individual round (in seconds).
*   **Start Button:** A primary action button that validates the inputs and transitions the view to the Live Activity Screen.

### 2.2. Live Activity Screen (`#activity-screen`)

This screen is designed to be projected at the front of the classroom.

*   **Optimized Group Generation:**
    *   **Algorithm:** When a new round begins, the application runs an optimized pairing algorithm. It maintains a `meetingHistory` for each student. The algorithm prioritizes pairing students with someone they have **not** met in a previous round.
    *   **Fallback:** If a student has met all other available students, the algorithm will create a repeat pairing as a fallback.
    *   **Odd Numbers:** It automatically handles an odd number of students by creating one group of three.
*   **Group Display Panel:**
    *   A clean, card-based layout (`.group-card`) displays the current pairings for the round.
    *   The title dynamically updates with the current round number (e.g., "Round 3 Groups").
*   **Visual Timer Panel:**
    *   **SVG Arc Timer:** A large, circular progress bar that visually depletes as the round timer counts down. The color changes to red in the last 10 seconds as a visual warning.
    *   **Digital Countdown:** A large numerical display showing the seconds remaining in the current round.
*   **Status Panel:**
    *   Displays the current round vs. total calculated rounds (e.g., "Round: 3 / 7").
    *   Displays the total time remaining for the entire activity in `MM:SS` format.
*   **Teacher Controls:**
    *   **Pause/Resume Button:** Allows the teacher to pause the countdowns for both the round and the total activity.
    *   **End Activity Early Button:** A button to stop the activity prematurely and proceed directly to the Results screen.
*   **Audio Cue:** A simple "ding" sound is played via the `AudioContext` API at the end of each round to signal students that it's time to switch partners.

### 2.3. Results Screen (`#results-screen`)

This screen appears after the activity concludes (either by running out of time or by being ended early).

*   **Meeting History Report:**
    *   Lists every student from the roster alphabetically.
    *   Next to each student's name, it provides a comma-separated list of all the other students they were paired with during the activity.
*   **Restart Button:** A "Start New Activity" button that returns the user to the Setup screen, ready to configure a new session.

## 3. User Flow

1.  **Open:** The teacher opens the `.html` file in a web browser. The **Setup Screen** is displayed.
2.  **Configure:** The teacher enters a Class Name, pastes the student roster, sets the total and per-conversation times.
3.  **Save (Optional):** The teacher clicks "Save Names" to persist the roster for future use with that class name.
4.  **Start:** The teacher clicks "Start Activity."
5.  **Run Activity:** The view switches to the **Live Activity Screen**.
    *   Round 1 groups are generated and displayed. The timer begins.
    *   At the end of each round, an audio cue plays.
    *   The application automatically generates new, optimized groups for the next round and resets the round timer.
    *   The teacher can pause or end the activity at any time.
6.  **Conclude:** The activity ends when the total time runs out or the teacher ends it early.
7.  **Review:** The view switches to the **Results Screen**, displaying the meeting history report.
8.  **Reset:** The teacher clicks "Start New Activity" to return to the Setup Screen.

## 4. Data Model & State Management

All state is managed in vanilla JavaScript variables within the browser's memory for the duration of the session.

*   `students` (Array of Strings): The master list of student names for the current activity.
*   `meetingHistory` (Map): The core of the optimization logic.
    *   **Key:** Student Name (String)
    *   **Value:** A `Set` of other student names (Strings) that this student has met.
*   `totalTimeSeconds` (Number): Total activity duration in seconds.
*   `meetingTimeSeconds` (Number): Duration of one round in seconds.
*   `totalRounds` (Number): Calculated as `floor(totalTimeSeconds / meetingTimeSeconds)`.
*   `currentRound` (Number): The current round number (1-indexed).
*   `totalTimeRemaining` (Number): A countdown of seconds for the entire activity.
*   `roundTimeRemaining` (Number): A countdown of seconds for the current round.
*   `isPaused` (Boolean): A flag to control the timer intervals.

## 5. Technical Specifications

*   **Architecture:** Single, self-contained HTML file. No server-side code or external dependencies.
*   **Languages:** HTML5, CSS3, JavaScript (ES6+).
*   **Browser APIs:**
    *   **`localStorage`:** Used for persisting student rosters between sessions based on class name.
    *   **`AudioContext`:** Used for generating the end-of-round audio cue without requiring an external sound file.
*   **Styling:** Custom CSS with a dark theme. Layout uses modern CSS features like Flexbox and Grid. It is reasonably responsive for different screen sizes.

## 6. Potential Future Enhancements

This document can serve as a basis for the following potential features:

*   **Student Absences:** A mechanism on the setup screen to temporarily check off or disable students who are absent for the day without deleting them from the saved roster.
*   **Flexible Group Sizes:** Allow the teacher to choose a target group size (e.g., 2, 3, or 4).
*   **Export Results:** Add a "Copy to Clipboard" or "Download as CSV" button on the results screen.
*   **Visual Themes:** Implement a light/dark mode toggle.
*   **More Sophisticated Pairing:** Introduce constraints to the pairing algorithm, such as "do not pair X and Y" or "prioritize pairing students from different tables."
*   **Manual Group Adjustment:** Allow the teacher to drag-and-drop students on the Live Activity screen to make small adjustments to an automatically generated grouping.
