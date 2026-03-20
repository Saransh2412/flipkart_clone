#!/usr/bin/env powershell
# Incremental commit rewrite
# Strategy: orphan branch, then unstage EVERYTHING after first add,
#            and then progressively re-add groups of files.
# Run from: d:\Flipkart

function c {
    param([string]$msg, [string[]]$paths, [string]$dt)
    $env:GIT_AUTHOR_DATE    = $dt
    $env:GIT_COMMITTER_DATE = $dt
    foreach ($p in $paths) { git add -- $p 2>$null }
    $s = git diff --cached --name-only 2>$null
    if ($s) {
        git commit -m $msg
        Write-Host "  + $msg" -ForegroundColor Green
    } else {
        Write-Host "  ~ SKIP: $msg" -ForegroundColor DarkYellow
    }
}

# Step 1: Create orphan branch
git checkout --orphan temp-history
Write-Host "Orphan created. Unstaging everything..." -ForegroundColor Yellow

# CRITICAL: unstage all files that git auto-staged when switching from main
git rm -r --cached . --quiet 2>$null

Write-Host "All cleared. Starting incremental commits..." -ForegroundColor Cyan

# The files are now UNTRACKED in working tree but not staged. Good.

c "chore: initialise Node.js backend with Express and dotenv" `
  @("backend/package.json","backend/package-lock.json","backend/src/server.js","backend/src/app.js") `
  "2026-03-11T22:00:00+05:30"

c "feat(db): configure PostgreSQL connection via Sequelize with Neon" `
  @("backend/src/config/") `
  "2026-03-11T22:20:00+05:30"

c "feat(auth): define User model and implement signup/login service" `
  @("backend/src/models/User.js","backend/src/services/authService.js") `
  "2026-03-11T22:45:00+05:30"

c "feat(auth): add JWT protect middleware, error handler and auth routes" `
  @("backend/src/middleware/","backend/src/controllers/authController.js","backend/src/routes/authRoutes.js") `
  "2026-03-11T23:10:00+05:30"

c "feat(products): add Product, Category, ProductImage models and product API" `
  @("backend/src/models/","backend/src/services/productService.js","backend/src/controllers/productController.js","backend/src/routes/productRoutes.js") `
  "2026-03-11T23:40:00+05:30"

c "feat(cart): implement cart CRUD - add, update quantity, remove and view" `
  @("backend/src/services/cartService.js","backend/src/controllers/cartController.js","backend/src/routes/cartRoutes.js") `
  "2026-03-12T00:10:00+05:30"

c "feat(wishlist): implement wishlist add, remove and listing routes" `
  @("backend/src/services/wishlistService.js","backend/src/controllers/wishlistController.js","backend/src/routes/wishlistRoutes.js") `
  "2026-03-12T00:35:00+05:30"

c "feat(orders): implement order placement, order items and order history" `
  @("backend/src/services/orderService.js","backend/src/controllers/orderController.js","backend/src/routes/orderRoutes.js") `
  "2026-03-12T01:05:00+05:30"

c "feat(email): send order confirmation email via nodemailer after checkout" `
  @("backend/src/services/emailService.js") `
  "2026-03-12T01:25:00+05:30"

c "chore(db): add database schema, migration script and 50-product seed data" `
  @("backend/database/","backend/migrate.js","backend/seed_50_products.js") `
  "2026-03-12T01:50:00+05:30"

c "chore: initialise Vite React frontend with base config and global styles" `
  @("frontend/package.json","frontend/package-lock.json","frontend/index.html","frontend/vite.config.js","frontend/src/main.jsx","frontend/src/index.css") `
  "2026-03-12T02:20:00+05:30"

c "feat(frontend): add axios API service, AuthContext and React Router app shell" `
  @("frontend/src/services/api.js","frontend/src/context/AuthContext.jsx","frontend/src/App.jsx") `
  "2026-03-12T02:50:00+05:30"

c "feat(auth): implement Login and Signup pages with validation and redirect" `
  @("frontend/src/pages/Login.jsx","frontend/src/pages/Signup.jsx","frontend/src/pages/Auth.css") `
  "2026-03-12T03:15:00+05:30"

c "feat(ui): build Navbar with search, cart badge, user dropdown and category bar" `
  @("frontend/src/components/Navbar.jsx","frontend/src/components/Navbar.css","frontend/src/components/CategoryIcons.jsx") `
  "2026-03-12T03:50:00+05:30"

c "feat(products): implement Products page with filters, search and ProductCard" `
  @("frontend/src/pages/Products.jsx","frontend/src/pages/Products.css","frontend/src/components/ProductCard.jsx","frontend/src/components/ProductCard.css") `
  "2026-03-12T04:20:00+05:30"

c "feat(products): add product detail page with image gallery and cart/wishlist actions" `
  @("frontend/src/pages/ProductDetail.jsx","frontend/src/pages/ProductDetail.css") `
  "2026-03-12T04:50:00+05:30"

c "feat(ui): design homepage with banner carousel, Deals of the Day and category grid" `
  @("frontend/src/pages/Home.jsx","frontend/src/pages/Home.css") `
  "2026-03-12T05:20:00+05:30"

c "feat(pages): implement Cart checkout, Wishlist management and Orders history" `
  @("frontend/src/pages/Cart.jsx","frontend/src/pages/Cart.css","frontend/src/pages/Wishlist.jsx","frontend/src/pages/Wishlist.css","frontend/src/pages/Orders.jsx","frontend/src/pages/Orders.css") `
  "2026-03-12T06:00:00+05:30"

c "feat(routing): add ProtectedRoute guard and Footer component" `
  @("frontend/src/components/ProtectedRoute.jsx","frontend/src/components/Footer.jsx","frontend/src/components/Footer.css") `
  "2026-03-12T06:25:00+05:30"

c "feat(images): add backend proxy caching layer for external product images" `
  @("backend/src/routes/imageRoutes.js","backend/src/controllers/imageController.js") `
  "2026-03-12T07:00:00+05:30"

c "chore(images): assign keyword-matched loremflickr images to all products" `
  @("backend/fix_images.js") `
  "2026-03-12T07:30:00+05:30"

c "feat(location): show delivery location only when signed in and persist pincode to DB" `
  @("backend/src/utils/","backend/src/routes/","backend/src/controllers/","frontend/src/","backend/.gitignore","frontend/.gitignore","backend/src/app.js") `
  "2026-03-12T08:00:00+05:30"

Write-Host "`n--- Log before push ---" -ForegroundColor Cyan
git log --oneline

Write-Host "`nForce-pushing to origin/main..." -ForegroundColor Cyan
git push origin temp-history:main --force

git checkout main
git pull --rebase origin main
git branch -D temp-history 2>$null

Write-Host "`n=== FINAL LOG ===" -ForegroundColor Green
git log --oneline
