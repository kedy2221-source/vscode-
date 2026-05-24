# ParkShare

ParkShare is a peer-to-peer parking rental platform that connects drivers looking for parking with hosts who have unused parking spaces.

## Features

- **Search & Discover**: Find parking spots near you on an interactive map
- **Book Instantly**: Reserve parking with a few clicks
- **List Your Spot**: Earn money by renting out your unused parking space
- **Secure Payments**: Integrated with Stripe for safe transactions
- **Verified Users**: Identity verification for trust and safety
- **SMS Verification**: Phone number verification for account security
- **Real Reviews**: See ratings and reviews from other users

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion animations
- Google Maps Embed
- Stripe Payment Integration

## Deployment

### Deploy to Netlify

1. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repo to Netlify for auto-deployment

### Deploy to GitHub Pages

1. Push the `dist` folder contents to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Select the branch you want to deploy from

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`

## Environment Variables

For full functionality, set these environment variables:

- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `VITE_API_URL` - Backend API URL

## Pages

- `/` - Home
- `/for-drivers` - Driver onboarding
- `/for-hosts` - Host onboarding
- `/trust-safety` - Trust & safety info
- `/pricing` - Pricing plans
- `/login` - Sign in
- `/register` - Sign up (with SMS verification)
- `/search` - Search parking spots (with Google Maps)
- `/dashboard` - User dashboard
- `/list-spot` - Create parking listing (with photo upload)
- `/book/:id` - Booking flow (with Stripe payment)
- `/about` - About ParkShare
- `/help-center` - Help center
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `/host-resources` - Host resources
- `/city-guides` - City guides

## Contact

- Email: hello@parkshare.com
- Support: support@parkshare.com
