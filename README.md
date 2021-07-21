# Reporter

[Visit production site](https://reporter.mpq.dev/)

Reporter is a [quantified self](https://en.wikipedia.org/wiki/Quantified_self)
mobile web app that lets users choose what to quantify.

Users select one or more emoji to associate with a particular board. Tapping on
an emoji sends a report of that event to the Firestore database, and the app
charts the number of reports over time in a calendar view that facilitates trend
visualization.

https://user-images.githubusercontent.com/53021641/126410696-760e8c89-8e6d-4f12-9ed0-7b92379aabca.mov

Everyone starts out with a predefined `Mood` board, but users can choose what to
track and how to express the different possibilities. The visual feedback for
button presses encourages so-called "smashing."

One fun aspect of the app is that different users will choose more and less
metaphorical emoji to represent the phenomena they're tracking. A friend of mine
uses ☔ for "rainy" moods. On the other hand one of my boards uses the
relatively direct 💧 to track when I last watered my plants.

<img src="https://mpq.dev/static/reporter-demo-cal.jpg" alt="Screenshot of the calendar view from the Reporter app" width=400/>

Use the calendar view to spot trends in the phenomena you're tracking. This user
is having a fairly 😘 June, with a couple small "blue" patches. Selecting a date
on the calendar summons a modal with precise report counts for that day.

The app is written in Next. It performs server-side authentication and uses
react-router for client-side routing, with Google Cloud Firestore on the back
end to manage users and data.

[Try it now!](https://reporter.mpq.dev/)
