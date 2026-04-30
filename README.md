# Door List

A mobile-first, single-file guest list app for bouncers. Hosted on GitHub Pages. No server, no accounts — just open the URL on your phone and go.

---

## Before Each Event: Checklist

1. [Change the password](#1-change-the-password)
2. [Deploy to GitHub Pages](#2-deploy-to-github-pages)
3. [Open the URL on your phone, enter the password, paste the list](#3-night-of)

---

## 1. Change the Password

Open `index.html` and find line 3 of the `<script>` block near the bottom of the file:

```js
const PASSWORD = 'doorman2024';
```

Change `doorman2024` to whatever you want for this event. The constant is at the very top of the script so it's easy to find — look for the comment block with `═` characters around it.

---

## 2. Deploy to GitHub Pages

**First-time setup (one-time only):**

1. Create a new GitHub repo (or use this one).
2. Go to **Settings → Pages**.
3. Under *Source*, select **Deploy from a branch** → branch: `main`, folder: `/ (root)`.
4. Click **Save**. GitHub will give you a URL like `https://yourusername.github.io/repo-name/`.

**Before each event:**

```bash
# Edit the password in index.html first, then:
git add index.html
git commit -m "Update password for [event name]"
git push
```

GitHub Pages updates within ~60 seconds of the push. The URL stays the same every time — bookmark it on your phone.

---

## 3. Night Of

### Loading the list

1. Open the GitHub Pages URL on your phone and enter the password.
2. Fill in **Party Name**, **Date**, and **Max Headcount** (leave blank if no cap).
3. Paste your guest list into the text area (one name per line) and tap **Load Guest List**.

### Guest list format

```
John Doe
Jane Smith X
Mike Johnson | VIP
Sarah Lee X | Check ID
Alex Kim | +2 expected
```

| Format | Meaning |
|---|---|
| `Name` | Regular guest |
| `Name X` | DO NOT ADMIT flag (red badge) |
| `Name \| note` | Inline note shown as gold badge |
| `Name X \| note` | DNA + note |

### Bouncer controls

| Button | Action |
|---|---|
| **✓** (green) | Admit — tap again to undo |
| **✕** (red) | Deny — tap again to undo |
| **+1** | Toggle a +1 for an admitted guest (adds to headcount) |
| **+ Not on List** | Increments the walk-in counter without adding a name |
| **Tap name row** | Expand notes field to add/edit a per-guest note |

### Stats bar (top)

| Label | Meaning |
|---|---|
| Total | Guests on the list |
| In | Total headcount in venue (admitted + their +1s + walk-ins) |
| Denied | Turned away |
| Pending | Not yet processed |
| No-List | Walk-in counter |

### Capacity

When **In** gets within 10 of the max, a gold warning banner appears. At capacity, a red **AT CAPACITY** banner appears and the app asks you to confirm before admitting anyone else.

### Filters

Use the **All / Pending / In / Denied / DNA** tabs to narrow the list. The search bar filters by name or note text.

---

## 4. After the Event: Export

Tap **Export CSV** at the bottom of the bouncer screen. The file downloads with:

- Name, status (admitted / denied / pending), time in, +1, DNA flag, notes
- Summary totals: headcount, walk-ins, no-shows

Open it in Excel, Numbers, or Google Sheets.

---

## FAQ

**Can multiple people use it at once?**
No — it's a static file with no backend. One device per door. If you have two entrances, open it on two phones and reconcile the CSVs after.

**The list is already loaded. Can I add a guest mid-event?**
Tap **← Edit** at the bottom, add the name to the textarea, and tap **Load Guest List** again. The existing session data (admits, denials) is cleared, so do this before the night starts if you can.

**How do I reset for a new event without changing the password?**
Just reload the page. All session data lives in memory and disappears on refresh.

**Does it work offline?**
After the page loads once, the HTML and inline JS work offline. The Inter font (loaded from Google Fonts) may not load without a connection — it falls back to the system sans-serif, which looks fine.
