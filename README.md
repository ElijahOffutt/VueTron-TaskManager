# VueTron-TaskManager
Hello, This is, “VueTron”; A simple and and easy to use task manager application that I built for my own personal use and for the sake of learning advanced design and development concepts. There is a full on install for this application which can be located [here coming soon], and a full disambiguation of my thought process for building the app on my website [here coming soon], but since you are here on Github you probably want to know how it works. So the set us is as follows 

1. Step 1. Clone the repo to any location that you deem fit.
2. I use electron forge since its pretty handy and comes with packaging and distribution baked right in, so I recommend recommend installing forge.
3. Once the repo is cloned run the traditional npm install to get all the necessary node modules ready. 
4. The application comes with no credentials for zip code for the current area so to get those features working simply use the services of open weather API and find your zip code. You can make a string out of them at the very top of the main JS file. Insert your api and zip code where it says, [YouApi] and [YourZip] in the api string
5. Once the api string is correctly configured you can navigate to the root folder of the app and run electron-forge start to activate the application.

Thanks for your interest and feel free to hack away and leave me any notes on how this small app can be optimized or updated in the future. Looking forward to future projects. 