# Treehouse Project 12 -CityChallenge

https://citychallenge-app2.herokuapp.com/
##### The idea
In the CityChallenge app you take challenges that, if fulfilled, may significantly improve your everyday life by making it more active, adventurous, conscious and sustainable in an urban setting. Now there are only three challenges, hopefully more and better will come :)

##### How does it work?
After signing up you can select a challenge that lasts for 1, 7 or 30 days. In the description you can read about the scientific background and what benefits you can expect.

After you **start a challenge** the app will put you on hold until another user selects the same challenge (‘status: waiting’). When that happens, the two **users are matched** and their challenge starts (‘status: active’).

You can **message** your partner  and discuss individual strategies to complete the challenge, or any difficulties you may have, etc. (answers don’t get shown automatically, you need to refresh).

In order to complete the challenge you have to **complete all ‘steps’** by the deadline (mark them checked). If you complete the challenge you gain karma and may jump levels (‘status: completed’).

If the deadline passes without you marking all steps completed, you **fail the challenge** (‘status: failed’). Challenges can also be **abandoned** by any of the participants (‘status: abandoned’). In that case the challenge is continued unless the remaining user also abandons. You can repeat a challenge unless you are doing it already.

At certain events (local page signup, challenge starts, challenge ends for some reason, partner abandons) the app **sends emails** to the user through an online API.

Users can check their personal information, karma points, level, past and active challenges at their **profile page**.

Registration and login is possible with **email&pass, Facebook and Google.**

##### Installation

**Run npm install => gulp build => npm start.**

If you want to run the ‘unbuilt’ version, change the ‘dist’ folder to 'public' when serving static files in app.js

When you are running the app on your local machine for the Facebook and Google login to work, you need to provide your CLIENT_IDs and CLIENT_SECRETs in environment variables when running npm start. The emailing service uses the Mailgun API: https://app.mailgun.com/. For that to work locally you would have to register and get your MAILGUN_API_KEY and MAILGUN_DOMAIN.

##### Testing

I provide **mock data** for testing, which is automatically loaded on Heroku and when you fire up the app on your local machine (with mongoose-seeder). This includes a set of challenges and two registered users. They can login to the app with the following credentials:
* citychallengetestemail@gmail.com / password
* citychallengetestemail2@gmail.com / password

You can also set up your profile locally or via FB or Google. Click on Register.

After logging in you can browse the challenges, click on them for more details and then start one. At this point you will have to sign out and in with another user. If you now start the same challenge the app will pair you up, start the counter and send out emails.

When the challenge starts the **‘message box’** and the **‘steps box’** appears. Users can message each other and mark their steps completed. You can also abandon the challenge.

The **profile view** displays personal info and lists ongoing and past challenges.

**IMPORTANT - Emailing:** Please note that the free tier of Mailgun only sends emails to registered addresses. I created two accounts on Gmail for testing purposes: citychallengetestemail@gmail.com. Pass: citychallenge and citychallengetestemail2@gmail.com. Pass: citychallenge2. There you can verify the arrival of the emails. Please also note that a welcome email is only sent for those who have signed up locally.

There are some basic **tests on the routes with Mocha and Chai. -> npm run test**

That’s it, enjoy :)
