# Enhanced Pomofocus Clone

A modern, feature-rich Pomodoro timer and task management application that can be easily integrated into Blogger.com.

## Features

### Core Pomodoro Timer
- Customizable work and break durations
- Visual progress circle
- Sound and desktop notifications
- Dark/Light mode toggle
- Pause and reset functionality

### Task Management
- Add, edit, and delete tasks
- Priority levels (High, Medium, Low)
- Deadline setting
- Task completion tracking
- Local storage for data persistence

### User Authentication
- Google Sign-in integration
- Personalized experience
- Data synchronization

### Modern UI/UX
- Responsive design
- Smooth animations
- Intuitive interface
- Custom icons and buttons
- Progress indicators

## Setup Instructions

1. **For Local Development:**
   - Clone this repository
   - Open `index.html` in your browser
   - No build process required

2. **For Blogger Integration:**
   - Go to your Blogger dashboard
   - Create a new page or post
   - Switch to HTML editor
   - Copy and paste the contents of `index.html`
   - Update the Google Client ID in `script.js`
   - Publish the page

## Customization

### Theme Colors
Edit the CSS variables in `styles.css` to match your preferred color scheme:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    /* ... other variables ... */
}
```

### Timer Settings
Default timer durations can be modified in the HTML:

```html
<input type="number" id="work-duration" min="1" max="60" value="25">
<input type="number" id="break-duration" min="1" max="30" value="5">
```

### Google Authentication
To enable Google Sign-in:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Sign-in API
4. Create OAuth 2.0 credentials
5. Replace `YOUR_GOOGLE_CLIENT_ID` in `script.js` with your actual client ID

## Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization
- Minimal dependencies
- Efficient DOM updates
- Local storage for data persistence
- Optimized animations

## License
MIT License - Feel free to use and modify for your projects.

## Credits
- Font Awesome for icons
- Google Fonts for typography
- Original Pomofocus.io for inspiration 