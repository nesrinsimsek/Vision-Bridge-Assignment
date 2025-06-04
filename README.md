# YAML-Based DOM Manipulation

This project allows you to dynamically modify an HTML document using a set of instructions defined in external YAML files. These YAML files specify actions such as inserting, removing, replacing or altering DOM elements based on selectors.

## Features

- Loads multiple YAML configuration files asynchronously

- Applies DOM changes based on defined actions

- Handles action conflicts with a priority system

- Supports action types: **remove, replace, insert,** and **alter**

## How It Works

- YAML files are fetched and parsed using **js-yaml**.

- Each file can define a **priority** (defaults to **0**) and an **actions** array.

- Files are sorted by ascending priority **(lower number = higher priority)**.

- All actions are collected and applied to the DOM in order.

##  Local Setup
This project was tested and run locally using **Visual Studio Code**.

**To serve the HTML file in a local environment, the "Live Server" extension (published by Ritwick Dey) which is available in the VSCode Extensions Marketplace was used.**

## How to Preview Changes
1. **Open index.html directly in your browser** to see the **original version of the page**, before any DOM manipulation occurs.
(Useful to compare changes — the manipulation happens quickly when served via a live server.)

2. **Run with "Live Server":** In VSCode, click the **“Go Live”** button in the bottom-right corner to start a local server and apply YAML-based DOM manipulations.

3. **To reapply the changes**, **refresh the page** in your browser while Live Server is running.

## What Changes on the Page?
Once served through **Live Server:**

1. The **banner at the top of the page is removed**.

2. The **existing header is replaced** with a new one.

   - The text **“Machine Learning”** in the new header is changed to **“AI”**.

   - Its color is also modified.

3. **All other instances of “Machine Learning”** in the document are also updated to **“AI”**.
4. A **footer** is added to the **bottom of the page**.

## About YAML Files and Priority
There are currently **two YAML files:**

- config1.yml

- config2.yml

(These files are **manually specified** — they are **not read from a directory**.)

### Priority Rules
- The **lower** the priority value, the **higher** the file’s priority.

- The **higher-priority file is applied last**, so **its changes override others**.

In the current setup, **config1.yml (priority: 1) is applied after config2.yml (priority: 2)**, so its DOM manipulations take effect.

If you **swap the priorities** (e.g., set config1.yml to priority: 2 and config2.yml to priority: 1), then **config2.yml becomes dominant** and **its changes will be visible** on the page.

## YAML Handling Logic
The **JavaScript code** is designed to support **multiple selectors and tags** by interpreting them as arrays — this works only if the **"-"** (**dash notation)** syntax is used in the YAML files correctly. This allows a single action to apply to **multiple DOM elements**.

For the **element** field, rather than expecting an array of HTML elements, the code is built to process **a single string containing one or more HTML elements**, which is more practical for insertion or replacement operations.
