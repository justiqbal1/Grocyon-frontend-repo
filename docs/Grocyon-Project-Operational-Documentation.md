# Grocyon Frontend - Operational Documentation

## 1) System Access URLs

- Landing page (public): `https://<your-frontend-domain>/`
- Login page (actual auth route): `https://<your-frontend-domain>/admin-access`
- Legacy login route: `https://<your-frontend-domain>/login` (auto redirect hota hai `/admin-access` par)
- Local development login URL: `http://localhost:5173/admin-access`
- Privacy policy: `https://<your-frontend-domain>/privacy-policy`

> Note: App routing ke mutabiq user ko login ke liye `admin-access` route use karna hota hai.

## 2) Login Flow (Step by Step)

### Login Screen Layout

- Screen split layout:
  - Left panel (desktop only): branding + background image
  - Right panel: login form
- Sign-in form controls:
  - `Your Email` input
  - `Password` input with show/hide eye button
  - `Forgot password?` button (password reset flow)
  - `Remember Me` checkbox
  - `Sign in` primary button (full-width, bottom of form)

### Button Actions + Position

- `Forgot password?`  
  - Position: password field ke neeche, **right aligned**
  - Action: forgot-password screen open hota hai

- `Sign in`
  - Position: form ke bottom par, **full-width primary CTA**
  - Action: API login call -> token save -> role based redirect

- Password eye icon (`show/hide`)
  - Position: password input ke **right inside**
  - Action: password visible/hidden toggle

### Post Login Redirect Rules

- `admin`/`vendor` -> `/dashboard`
- `user` -> `/profile`
- Agar user protected route directly open kare bina login ke, to intended path save hota hai aur login ke baad wapis usi path par redirect hota hai.

## 3) Global Navigation (After Login)

### Sidebar Positioning

- Desktop: left side fixed sidebar
- Mobile: top-left hamburger button se open hota hai

### Header Positioning

- Top sticky header
- Left side: search
- Right side: notification bell + profile dropdown

### Profile Dropdown Actions (Top-right)

- `Profile` -> `/profile`
- `Logout` -> token clear + auth reset

## 4) Role-wise Menu Buttons (Sidebar)

### Admin

- Dashboard
- Vendors
- Deliveryman
- Rider Verification

### Vendor

- Dashboard
- Categories
- Items
- Addons (only when vendor is food type)
- Flavors (only when vendor is food type)
- Orders

### User

- Profile

## 5) Portal Tabs (Separate Sections)

## 5.1 Admin Portal Tab

### Admin Main Access

- Login as `admin` from `/admin-access`
- Post-login landing: `/dashboard`

### Admin Sidebar Tabs

- `Dashboard`
- `Vendors`
- `Deliveryman`
- `Rider Verification`

### Admin Key Button/Action Mapping

- `Vendors` tab -> vendors listing open hoti hai
  - Add button -> `/vendors/new`
  - View vendor -> `/vendors/:id`
  - Edit vendor -> `/vendors/edit/:id`
- `Deliveryman` tab -> riders listing
  - Add button -> `/add-new-delivery-man`
  - View -> `/delivery-man-list/:id`
  - Edit -> `/delivery-man-list/edit/:id`
- `Rider Verification` tab -> rider verification queue/actions

### Admin Image Upload Touchpoints

- Add Vendor -> `Business Image` (5MB, image/*)
- Edit Vendor -> `Business Image` (5MB, image/*)
- Add Deliveryman -> `Profile Image` (5MB, image/*)
- Edit Deliveryman -> `Profile Image` (5MB, image/*)

## 5.2 Vendor Portal Tab

### Vendor Main Access

- Login as `vendor` from `/admin-access`
- Post-login landing: `/dashboard`

### Vendor Sidebar Tabs

- `Dashboard`
- `Categories`
- `Items`
- `Addons` (only if food vendor)
- `Flavors` (only if food vendor)
- `Orders`

### Vendor Key Button/Action Mapping

- `Categories` tab
  - Add category button -> create category form
  - Edit category action -> update form
  - Category detail row/card click -> detail route `/categories/:id`
- `Items` tab
  - Add item button -> `/items/new`
  - Edit item -> `/items/update`
  - Item detail -> `/items/:id`
- `Flavors` tab
  - Add flavor modal open
  - Save flavor -> create/update action
- `Orders` tab
  - Order detail open -> `/order/:id`

### Vendor Image Upload Touchpoints

- Categories -> `Cover Image` (5MB, image/*)
- Items -> `Cover Image` + `Background Image` (both 5MB, image/*)
- Flavors -> `Flavor Image` (5MB, image/*)

## 6) Major Functional Routes

- `/dashboard`
- `/vendors`, `/vendors/new`, `/vendors/:id`, `/vendors/edit/:id`
- `/delivery-man-list`, `/delivery-man-list/:id`, `/delivery-man-list/edit/:id`
- `/add-new-delivery-man`
- `/rider-verification`
- `/categories`, `/categories/new`, `/categories/update`, `/categories/:id`
- `/items`, `/items/new`, `/items/update`, `/items/:id`
- `/addons`
- `/flavors`
- `/all-orders`, `/order/:id`, `/*-orders`
- `/profile`
- `/delete-confirmation`, `/deleteAccount`

## 7) Image Upload Documentation (All Areas)

Neeche project ke tamam screens listed hain jahan image upload hota hai.

## 7.1 Categories

- Screen/Route: `Categories` (`/categories`)
- Form section: `Cover Image`
- Methods:
  - Image URL
  - Upload Image
- Accepted type: `image/*` (PNG/JPG/GIF UI text)
- Max size: `5MB`
- Preview:
  - UI preview box: `w-32 h-32` (square thumbnail)
- Position in form:
  - Category details ke baad, submit buttons se just pehle

### Category Image Size Recommendation

- Recommended ratio: `1:1`
- Recommended pixel size: `800 x 800` (minimum `512 x 512`)
- Reason: UI list/detail me square preview use hota hai.

## 7.2 Items

- Screen/Route: `Items` (`/items`, `/items/new`, `/items/update`)
- Upload sections:
  - `Cover Image`
  - `Background Image`
- Methods for both:
  - Image URL
  - Upload Image
- Accepted type: `image/*`
- Max size: `5MB` (both cover and background)

### Item Cover Image

- Preview style: `w-32 h-32` (square)
- Recommended ratio: `1:1`
- Recommended size: `1000 x 1000` (minimum `600 x 600`)

### Item Background Image

- Preview style: `max-w-md h-40` (landscape)
- Recommended ratio: `16:9`
- Recommended size: `1600 x 900` (minimum `1200 x 675`)

> Note: Category/Item screens me dimension validation code-level par force nahi ki gayi; sirf file type + file size (5MB) enforce hota hai.

## 7.3 Flavors

- Screen/Route: `Flavors` (`/flavors`)
- Field: `Flavor Image`
- Accepted type: `image/*`
- Max size: `5MB`
- Upload behavior: image base64 me convert ho kar save hoti hai
- Preview area: large card-style preview (`h-48`)

## 7.4 Vendor Create

- Screen/Route: `Add Vendor` (`/vendors/new`)
- Field: `Business Image *`
- Accepted type: `image/*` (PNG/JPG/GIF)
- Max size: `5MB`
- Required: yes
- Position:
  - Basic information section me business type ke baad

### Additional File Upload (Vendor Create)

- Field: `Agreement Document (PDF/Image)`
- Accepted: `.pdf, .jpg, .jpeg, .png` + doc mime support in validation
- Max size: `10MB`

## 7.5 Vendor Edit

- Screen/Route: `Edit Vendor` (`/vendors/edit/:id`)
- Field: `Business Image *`
- Accepted type: `image/*`
- Max size: `5MB`
- Existing image shown as current preview, click to replace

## 7.6 Deliveryman Create

- Screen/Route: `Add Deliveryman` (`/add-new-delivery-man`)
- Field: `Profile Image *`
- Accepted type: `image/*`
- Max size: `5MB`
- Required: yes
- Position:
  - Personal/basic details ke baad, account section se pehle

### Additional File Upload (Deliveryman Create)

- Field: `Agreement Documents (.doc, .pdf, or images)`
- Accepted: `.doc, .pdf, .jpg, .jpeg, .png, .gif`
- Max size: `10MB`

## 7.7 Deliveryman Edit

- Screen/Route: `Edit Deliveryman` (`/delivery-man-list/edit/:id`)
- Field: `Profile Image *`
- Accepted type: `image/*`
- Max size: `5MB`
- Current image preview available, replace by choosing new file

## 7.8 Signup (Role-based)

- Screen/Route: Auth signup flow (`/admin-access` -> signup mode)
- Field appears for role: `vendor` or `rider`
- Label:
  - Vendor role: `Business Image *`
  - Rider role: `Profile Image *`
- Accepted type: `image/*`
- Max size: `5MB`

## 8) Image Upload Quick Reference Table

| Module | Field | Required | Formats | Max Size | Suggested Dimensions |
|---|---|---|---|---|---|
| Categories | Cover Image | No (default used if empty) | image/* | 5MB | 800x800 (1:1) |
| Items | Cover Image | Optional by API handling | image/* | 5MB | 1000x1000 (1:1) |
| Items | Background Image | Optional by API handling | image/* | 5MB | 1600x900 (16:9) |
| Flavors | Flavor Image | Optional | image/* | 5MB | 1200x675 (16:9) |
| Add Vendor | Business Image | Yes | image/* | 5MB | 1200x1200 (1:1) |
| Edit Vendor | Business Image | Usually expected | image/* | 5MB | 1200x1200 (1:1) |
| Add Deliveryman | Profile Image | Yes | image/* | 5MB | 800x800 (1:1) |
| Edit Deliveryman | Profile Image | Usually expected | image/* | 5MB | 800x800 (1:1) |
| Signup (Vendor/Rider) | Business/Profile Image | Role-based required | image/* | 5MB | 800x800 (1:1) |

## 9) Important Operational Notes

- Login ke liye direct `/admin-access` open karein.
- Agar frontend domain change ho, to bas base domain replace karein; routes same rahenge.
- Image upload me major failure reasons:
  - 5MB se bari image (image fields)
  - Unsupported extension/type
- Best practice:
  - Upload se pehle image compress karein
  - Category/Item cover ke liye square image use karein
  - Item background ke liye landscape 16:9 use karein

## 10) Document Metadata

- Project: Grocyon Frontend
- Generated on: 2026-03-31
- Source: frontend route/components implementation
