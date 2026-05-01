# The FreakHouse — Door + Photo System

A mobile-first event management suite hosted on GitHub Pages with Firebase on the backend. No server required — just static files and Firebase services.

---

## Pages

| File | Who uses it | Auth required |
|---|---|---|
| `index.html` | Bouncer / door staff | Yes (Firebase email/password) |
| `admin.html` | Admin | Yes (separate admin account) |
| `photos.html` | Guests | No |
| `gallery.html` | Anyone with the link | No (token-gated) |
| `qr.html` | Admin (display on screen) | No |

---

## Firebase Setup

### Services needed

- **Authentication** — Email/Password provider enabled
- **Firestore** — Production mode with the rules below
- **Storage** — Blaze plan required; use the rules below

### Accounts

Create two accounts in Firebase Authentication:

1. **Bouncer** — door staff login (`index.html`)
2. **Admin** — full dashboard access (`admin.html`)

Both use email/password. They share the same Firebase project but the admin account gets broader write access.

### Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Bouncers and admins can read/write events and guests
    match /events/{eventId} {
      allow read, write: if request.auth != null;

      match /guests/{guestId} {
        allow read, write: if request.auth != null;
      }

      // Guests can upload photos (unauthenticated write)
      match /photos/{photoId} {
        allow read:  if request.auth != null;
        allow create: if true;
        allow update, delete: if request.auth != null;
      }
    }

    // Public read for gallery token lookup
    match /galleries/{token} {
      allow read:  if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /events/{eventId}/photos/{photoId} {
      allow read:   if true;
      allow write:  if true;   // guests upload without auth
      allow delete: if request.auth != null;
    }
  }
}
```

---

## Firestore Data Model

```
events/
  {eventId}/
    name:         string
    date:         string          // ISO date "2024-12-31"
    dateDisplay:  string          // "Sat, Dec 31"
    maxCapacity:  number
    nolCount:     number          // walk-in counter
    guestCount:   number
    isActive:     bool            // true = active for photo uploads
    published:    bool
    publishToken: string
    createdAt:    timestamp

    guests/
      {guestId}/
        order:    number
        name:     string
        note:     string
        dna:      bool
        status:   "pending" | "admitted" | "denied"
        plus1:    bool
        ts:       string          // time-in display

    photos/
      {photoId}/
        guestName:   string
        storagePath: string
        downloadUrl: string
        fileName:    string
        fileSize:    number
        status:      "pending" | "approved" | "rejected"
        uploadedAt:  timestamp

galleries/
  {token}/
    eventId: string
```

---

## Before Each Event: Checklist

1. Log in to `admin.html` and create a new event (name, date, capacity)
2. Click **Set Active** on the event so `photos.html` routes to it
3. Load the guest list from the event card in `index.html`
4. Display `qr.html` at the entrance or print the QR code
5. After the event, approve photos in the **Moderation** tab and publish the gallery

---

## Bouncer Screen (`index.html`)

### Loading the list

1. Open the URL, sign in with the bouncer email/password
2. Tap the event to open it (or tap **New Event** → fill details → paste list → **Load Guest List**)

### Guest list format

```
John Doe
Jane Smith X
Mike Johnson | VIP
Sarah Lee X | Check ID
```

| Format | Meaning |
|---|---|
| `Name` | Regular guest |
| `Name X` | DO NOT ADMIT flag |
| `Name \| note` | Inline note |
| `Name X \| note` | DNA + note |

### Bouncer controls

| Button | Action |
|---|---|
| **✓** | Admit — tap again to undo |
| **✕** | Deny — tap again to undo |
| **+1** | Toggle a +1 for an admitted guest |
| **+ Not on List** | Walk-in counter increment |
| **Tap name** | Expand notes / DNA toggle / remove |
| **+ Guest** (bottom bar) | Add a guest mid-event |
| **Reload** | Re-paste a new list for the same event |
| **← Events** | Return to event picker |
| **Export CSV** | Download full results |

### Stats bar

| Label | Meaning |
|---|---|
| Total | Guests on the list |
| In | Admitted + their +1s + walk-ins |
| Denied | Turned away |
| Pending | Not yet processed |
| No-List | Walk-in counter |

---

## Admin Dashboard (`admin.html`)

Three tabs:

**Events** — Create and manage events. Set one event as Active (determines which event `photos.html` routes to).

**Moderation** — Review pending photo submissions. Approve moves to gallery. Reject permanently deletes the file from Storage and Firestore.

**Gallery** — View approved photos. Publish generates a shareable link (`gallery.html?token=xxx`). Unpublish revokes the link.

---

## Guest Photo Upload (`photos.html`)

- No login required
- Auto-detects the active event (checks `isActive == true`, falls back to today's date)
- Supports multiple photos per submission
- Photos land in moderation queue with `status: 'pending'`

---

## Public Gallery (`gallery.html?token=xxx`)

- No login required
- Token-gated: link only works if the admin has published the gallery
- Swipe or arrow key navigation in lightbox
- Sorted by upload time

---

## QR Code Page (`qr.html`)

- Displays a QR code pointing to `photos.html`
- Shows the active event name
- Copy Link button for sharing the URL directly
- Pull this up on a laptop/TV at the entrance

---

## Deploying Changes

```bash
git add -A
git commit -m "Update for [event name]"
git push
```

GitHub Pages updates within ~60 seconds. The URL stays the same every time.
