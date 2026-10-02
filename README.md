# CloudShop Demo for AWS CloudWatch Synthetics

A simple, production-ready vanilla HTML/JS/CSS frontend application designed explicitly for demonstrating Amazon CloudWatch Synthetics Canaries.

## Project Structure
```text
cloudshop/
├── index.html
├── login.html
├── products.html
├── product.html
├── cart.html
├── checkout.html
├── confirmation.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

## How to Run Locally
1. Clone the project or open the folder on your computer.
2. You can simply double-click `index.html` to open it in any web browser.
3. For the best experience, run a local web server (e.g., using Python: `python -m http.server 8000` or VS Code Live Server).
4. Navigate to `http://localhost:8000` (or whatever your local URL is).

## Test Credentials
- **Email:** `test@example.com`
- **Password:** `Test@123`

## How the User Journey Works
1. User lands on the homepage and clicks **Shop Now**.
2. They are redirected to the Login page where they enter demo credentials.
3. Upon success, they redirect to Products.
4. They can search for "wireless mouse" and add it to the cart.
5. They go to the Cart and click **Checkout**.
6. They fill out a dummy checkout form and submit.
7. They receive an **Order Confirmation**.

## How to Deploy to Amazon S3
1. Go to AWS S3 Console.
2. Create a bucket (e.g., `my-cloudshop-demo`). Ensure public access is allowed (or configured correctly for CloudFront).
3. Upload all files from the `cloudshop/` directory.
4. Go to **Properties** -> **Static website hosting** -> Enable it.
5. Set the index document to `index.html`.
6. Use the provided S3 website endpoint URL.

## How to Deploy using AWS Amplify
1. Go to AWS Amplify Console.
2. Select **Host web app**.
3. Choose "Deploy without Git provider".
4. Upload a zip file containing the contents of the `cloudshop/` folder.
5. Amplify will auto-deploy the app and give you a public URL.

## How to Test Manually
Open the URL in any browser and manually click through the flow described in "How the User Journey Works".

## How to Test using Puppeteer
You can write a simple Puppeteer script to emulate the journey. The stable IDs make this straightforward:
```javascript
await page.click('#shop-now-btn');
await page.type('#email', 'test@example.com');
await page.type('#password', 'Test@123');
await page.click('#login-btn');
await page.waitForSelector('#search-box');
await page.type('#search-box', 'wireless mouse');
await page.click('#search-submit');
await page.click('.add-to-cart');
await page.goto('.../cart.html');
await page.click('#checkout-btn');
// ... fill forms
await page.click('#place-order-btn');
await page.waitForSelector('#order-confirmation');
```

## How to Configure for Amazon CloudWatch Synthetics
1. Open CloudWatch Console.
2. Navigate to Synthetics Canaries.
3. Create a Canary using the GUI Builder or a custom script.
4. Provide your static website URL.
5. Define the steps mimicking the user journey. Synthetics can click specific IDs like `#login-btn` and verify `#order-confirmation` appears.

## Required Selectors for the Canary
- `id="shop-now-btn"`
- `id="email"`, `id="password"`, `id="login-btn"`, `id="login-error"`, `id="login-success"`
- `id="search-box"`, `id="search-submit"`
- `class="product-card"`, `class="add-to-cart"`
- `id="cart-container"`, `id="cart-total"`, `id="checkout-btn"`
- Checkout fields: `id="full-name"`, `id="checkout-email"`, `id="phone"`, `id="address"`, `id="city"`, `id="state"`, `id="postal-code"`, `id="place-order-btn"`
- `id="order-confirmation"`

## How to Enable DEMO_FAILURE_MODE
1. Open `js/app.js`.
2. Change line 3 to: `const DEMO_FAILURE_MODE = true;`
3. This intentionally blocks checkout completion, allowing you to demonstrate how your Synthetics Canary fails and triggers CloudWatch Alarms.

## How to Disable DEMO_FAILURE_MODE
1. Open `js/app.js`.
2. Change it back to: `const DEMO_FAILURE_MODE = false;`
