# Firebase Authentication Setup

## Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAEhhFjCo-aYX3PVt1LF4ZPjdaXRM3ydLk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xevora-fc5b4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xevora-fc5b4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xevora-fc5b4.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=524702437214
NEXT_PUBLIC_FIREBASE_APP_ID=1:524702437214:web:90138cf5d3cf496b2889cf
```

**IMPORTANT**: Make sure `.env.local` is in your `.gitignore` file (it should be by default in Next.js projects).

## Firebase Console Setup

### 1. Enable Authentication Methods

Go to your Firebase Console → Authentication → Sign-in method and enable:

- **Google**: Click "Google" → Enable → Save
- **Apple**: Click "Apple" → Enable → Configure (requires Apple Developer account)
- **Email/Password**: Click "Email/Password" → Enable → Save

### 2. Configure Authorized Domains

In Authentication → Settings → Authorized domains, add:

- `localhost` (for development)
- Your production domain (when deploying)

### 3. Firestore Database Setup

1. Go to Firestore Database → Create database
2. Choose "Start in production mode" or "Start in test mode"
3. Select your preferred region
4. Click "Enable"

### 4. Firestore Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      // Users can write their own data
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features Implemented

✅ **Google Sign-In**: One-click authentication with Google
✅ **Apple Sign-In**: One-click authentication with Apple ID
✅ **Email/Password Sign-In**: Traditional email and password login
✅ **Email/Password Sign-Up**: Create new accounts with email
✅ **Password Reset**: Send password reset emails
✅ **User Detection**: Automatically switches between sign-in and sign-up
✅ **Form Validation**: Email and password validation with error messages
✅ **Loading States**: Visual feedback during authentication
✅ **Error Handling**: User-friendly error messages
✅ **Firestore Integration**: Saves user data to Firestore on authentication
✅ **Responsive Design**: Works on all devices

## Usage

1. Navigate to `/auth` to see the authentication page
2. Users can sign in with:
   - Google (one click)
   - Apple (one click)
   - Email/Password (enter email → enter password → sign in/sign up)
3. If email doesn't exist, user is prompted to create an account
4. If email exists but wrong password, user gets an error
5. Forgot password link sends reset email

## File Structure

```
lib/
  ├── firebase.ts          # Firebase initialization
  └── auth.ts              # Authentication service functions
components/
  └── auth-page.tsx        # Main authentication UI component
.env.local                 # Environment variables (create this manually)
```

## Testing

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/auth`
3. Test each authentication method
4. Check Firestore to see user data being saved

## Production Deployment

Before deploying to production:

1. Add your production domain to Firebase authorized domains
2. Set up environment variables in your hosting platform
3. Update Firestore security rules for production
4. Test all authentication flows in production environment

## Troubleshooting

**"Firebase: Error (auth/configuration-not-found)"**

- Make sure you've created the `.env.local` file
- Restart your development server after creating `.env.local`

**"Firebase: Error (auth/unauthorized-domain)"**

- Add your domain to Firebase Console → Authentication → Settings → Authorized domains

**Google/Apple sign-in not working**

- Make sure you've enabled these methods in Firebase Console
- Check that your OAuth credentials are properly configured
