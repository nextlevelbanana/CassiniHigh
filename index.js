const { app, BrowserWindow } = require("electron");
const path = require("path");

app.on("ready", () => {
  const mainWindow = new BrowserWindow({width: 1920, height:1080, webPreferences: {webSecurity: false}});
  mainWindow.loadFile(path.join(__dirname, "public/index.html"));

  mainWindow.on('closed', function () {
    app.quit();
  });
});

