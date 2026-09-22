# The EmberGrill — Restaurant Management with Retail POS

Hands-on test project built with **Vue 3 + Quasar Framework (Quasar CLI)**, **Pinia** for state
management and **Local Storage** for persistence. No backend is needed.

## Run the project

```bash
npm install      # first time only
npx quasar dev   # or: npm run dev
```

The app opens at `http://localhost:8080`. Build for production with `npx quasar build`
(output: `dist/spa`).

> Requires Node.js 20 or newer.

## Features by step

| Step | Screen | What it does |
| ---- | ------ | ------------ |
| 1 | Login (landing page) | Email + password login. Only registered users can enter (route guard). Clicking **Register** swaps the card to the Registration card in the same view — no route change. Register fields: Name, Email, Phone, Password, Confirm Password. Passwords are SHA-256 hashed before saving. |
| 2 | My Restaurant | Add / Edit / Delete restaurant info: name, logo upload, address, phone, multiple branch names. Stats + navigation buttons to All Items, Orders and Invoices. |
| 3 | All Items | Items shown as cards (name, category, price, Edit / Delete). Add New Item dialog (Name, Category, Price). Search, category filter and sorting. "Load sample menu" for quick testing. |
| 4 | New Order | Tap item cards to add them to the cart, change quantity, enter Customer Name, Phone, Table and Seat. On submit the order is saved and the app redirects to the Invoice page and opens the new invoice. |
| 5 | Invoices | All orders from Local Storage in two sections: **Upcoming** (latest first) and **Previous** (served / older). Each order: **View**, **Download** (.txt) and **Print**. Mark as served, search and filter by date / branch. |

Extra: light / dark theme switcher (saved), responsive layout (side drawer on desktop,
bottom tabs on mobile), 5% VAT and BDT (৳) currency.

## Project structure

```
src/
  components/   auth, restaurant, menu, order, invoice, common (SFC components)
  layouts/      GuestLayout (login), AppShell (header, drawer, mobile tabs)
  pages/        LoginPage, RestaurantPage, MenuItemsPage, NewOrderPage, InvoicesPage
  router/       routes + auth guard
  stores/       Pinia stores: auth, restaurant, menu, orders, theme
  utils/        storage (Local Storage), format, validators, invoice (text / print)
```

## Local Storage keys

| Key | Content |
| --- | ------- |
| `emberGrill:users` | Registered users |
| `emberGrill:session` | Logged-in user id |
| `emberGrill:theme` | `light` / `dark` |
| `emberGrill:<userId>:restaurant` | Restaurant info |
| `emberGrill:<userId>:menu` | Menu items |
| `emberGrill:<userId>:orders` | Orders / invoices |

Each user has their own restaurant, menu and orders.
