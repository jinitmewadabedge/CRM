// const { app, BrowserWindow } = require("electron");
import { app, BrowserWindow, globalShortcut } from "electron";

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false
        }
    });

    win.loadURL("https://bedge-crm.vercel.app");

    globalShortcut.register("CommandOrControl+Left", () => {
        if (win.webContents.navigationHistory.canGoBack()) {
            win.webContents.navigationHistory.goToOffset(-1);
        }
    });

    globalShortcut.register("CommandOrControl+Right", () => {
        if (win.webContents.navigationHistory.canGoForward()) {
            win.webContents.navigationHistory.goForward();
        }
    });

}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});