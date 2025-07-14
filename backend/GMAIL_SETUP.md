# Gmail Setup Guide for Email Functionality

## Why 2-Step Verification is Required

Gmail requires 2-Step Verification to generate App Passwords, which are needed for third-party applications like our authentication system.

## Step-by-Step Setup

### 1. Enable 2-Step Verification

1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Find "2-Step Verification" and click "Get started"
4. Follow the setup process
5. **Important**: You can use your phone number for 2-Step Verification

### 2. Generate an App Password

1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "2-Step Verification", click "App passwords"
4. Select "Mail" as the app and "Other" as the device
5. Click "Generate"
6. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### 3. Update Your .env File

Replace your current email password with the App Password:

```
EMAIL_USER=frgblzs.dev@gmail.com
EMAIL_PASS=your-16-character-app-password
```

**Important**:

- Remove spaces from the App Password
- Use the App Password, NOT your regular Gmail password

### 4. Test the Setup

1. Restart your backend server
2. Go to the forgot password page
3. Enter a registered email
4. Check the console for "Email server is ready to send messages"
5. Check the email inbox for the reset link

## Alternative: Use a Different Email Service

If you prefer not to use 2-Step Verification, you can use other email services:

### Option 1: Outlook/Hotmail

```
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Option 2: Yahoo

```
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

### Option 3: Custom SMTP

```
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
```

## Development Mode

If you don't configure email credentials, the system will:

- Log the reset URL to the console
- Show you exactly what would be sent
- Perfect for testing without email setup

## Troubleshooting

### "Invalid login" error

- Make sure you're using the App Password, not your regular password
- Remove any spaces from the App Password
- Ensure 2-Step Verification is enabled

### "Less secure app access" error

- Google no longer supports this feature
- You must use 2-Step Verification + App Password

### Email not received

- Check spam/junk folder
- Verify the email address is correct
- Check console logs for errors
