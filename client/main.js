// const { app, BrowserWindow } = require("electron");
import { app, BrowserWindow, globalShortcut, Menu } from "electron";

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

    const template = [
        {
            label: "Navigation",
            submenu: [
                {
                    label: "Back",
                    accelerator: "Alt+Left",
                    click: () => {
                        if (win.webContents.canGoBack()) win.webContents.goBack();
                    },
                },
                {
                    label: "Forward",
                    accelerator: "Alt+Right",
                    click: () => {
                        if (win.webContents.canGoForward()) win.webContents.goForward();
                    },
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});