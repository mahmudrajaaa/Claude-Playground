# Chennai Gold & Silver Rates Tracker

A simple, elegant web application to track current and historical daily gold and silver rates in Chennai, Tamil Nadu. The app displays live rates, historical trends, and price changes with beautiful visualizations.

## Features

- **Real-time Rates**: Current gold (24K, 22K) and silver prices per gram
- **Price Changes**: Daily price change indicators with percentage
- **Historical Trends**: Interactive charts showing last 7 days of price history
- **Price History Table**: Detailed table view of historical rates
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Auto-refresh**: Automatically updates rates every hour
- **Offline Support**: Uses localStorage to cache data for offline viewing
- **Multiple Data Sources**: Supports multiple API providers with automatic fallback

## Live Demo

Simply open `index.html` in any modern web browser to start using the app.

## Screenshots

The app features:
- Beautiful gradient UI with gold and silver color themes
- Interactive price cards showing current rates
- Chart.js powered visualizations for trend analysis
- Responsive design that works on all devices

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/mahmudrajaaa/Claude-Playground.git
   cd Claude-Playground
   ```

2. Open `index.html` in your web browser:
   ```bash
   # On Linux
   xdg-open index.html

   # On macOS
   open index.html

   # On Windows
   start index.html
   ```

3. That's it! No build process or dependencies required.

## API Configuration (Optional)

The app works out-of-the-box with sample data, but for **live real-time data**, you can configure FREE API keys:

### Option 1: MetalpriceAPI.com (Recommended) ⭐

**100 FREE requests/month • No credit card required**

1. Sign up for a free account at [https://metalpriceapi.com/](https://metalpriceapi.com/)
2. Get your API key from the dashboard
3. Open `app.js` and replace `YOUR_METALPRICE_API_KEY` with your actual key (line 87):
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

**Why MetalpriceAPI?**
- ✅ 100 free requests per month
- ✅ No credit card needed
- ✅ Real-time gold, silver, and currency data
- ✅ Reliable and well-documented API

### Option 2: Metals.dev

**100 FREE requests/month • No credit card required**

1. Sign up at [https://metals.dev/](https://metals.dev/)
2. Get your API key from the dashboard
3. Open `app.js` and replace `YOUR_METALSDEV_API_KEY` with your actual key (line 142):
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

**Why Metals.dev?**
- ✅ 100 free requests per month
- ✅ No credit card needed
- ✅ 60-second data refresh even on free plan
- ✅ Direct INR pricing support

### Without API Keys

The app will work with fallback rates and sample historical data. It's perfect for:
- Testing and demonstration
- Understanding price trends
- Learning web development
- Offline usage

**Note**: Configure at least one API for live data. The app automatically tries both APIs and falls back to cached data if needed.

## How It Works

1. **Data Fetching**: The app tries to fetch live rates from configured APIs
2. **Fallback System**: If APIs are unavailable, it uses cached or fallback data
3. **Local Storage**: Historical data is stored in browser's localStorage
4. **Auto-update**: Checks for new rates every hour
5. **Visualization**: Uses Chart.js to create interactive price trend graphs

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Data fetching, storage, and DOM manipulation
- **Chart.js**: Beautiful, responsive charts for data visualization
- **LocalStorage API**: Client-side data persistence

## File Structure

```
Claude-Playground/
├── index.html          # Main HTML file
├── style.css           # Styling and responsive design
├── app.js              # JavaScript logic and API integration
└── README.md           # This file
```

## Features Explained

### Current Rates Display
- Shows gold 24K, 22K, and silver prices per gram in INR
- Color-coded cards with metal icons
- Real-time price change indicators

### Historical Trends Chart
- Interactive line chart powered by Chart.js
- View gold, silver, or both metals
- Last 7 days of price data
- Hover to see exact values

### Price History Table
- Tabular view of historical rates
- Sortable and easy to read
- Shows last 7 days of data

### Auto-refresh
- Updates every hour automatically
- Manual refresh button available
- Shows last update timestamp

## Browser Support

Works on all modern browsers:
- Chrome/Edge (version 90+)
- Firefox (version 88+)
- Safari (version 14+)
- Opera (version 76+)

## Data Sources

The app supports multiple **FREE** gold/silver rate APIs:

1. **MetalpriceAPI.com**: Global precious metals rates API (100 free requests/month)
2. **Metals.dev**: Real-time precious metals and currency API (100 free requests/month)
3. **Fallback Data**: Approximate Chennai market rates (used when APIs are not configured)

## Customization

### Change Update Interval

Edit `app.js`:
```javascript
const UPDATE_INTERVAL = 3600000; // Change to desired milliseconds
```

### Adjust Historical Data Period

Edit `app.js`:
```javascript
const trimmedHistory = history.slice(-30); // Change -30 to desired days
```

### Modify Colors

Edit `style.css`:
```css
:root {
    --gold-color: #FFD700;      /* Change gold color */
    --silver-color: #C0C0C0;    /* Change silver color */
    --primary-bg: #1a1a2e;      /* Change background */
}
```

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## Future Enhancements

Potential features for future versions:
- Support for more cities in India
- Diamond and platinum rates
- Price alerts and notifications
- Export data to CSV/Excel
- Multi-language support (Tamil, Hindi, etc.)
- PWA support for mobile installation
- Comparison with international rates

## Disclaimer

**Important**: The rates displayed in this app are for informational purposes only. Actual market rates may vary based on:
- Individual jeweler pricing
- Making charges
- GST and other taxes
- Market conditions
- Location within Chennai

Always verify rates with authorized jewelers before making any transactions.

## License

MIT License - Feel free to use, modify, and distribute.

## Acknowledgments

- Gold and silver rate data providers
- Chart.js for beautiful visualizations
- The Chennai jewelry community

## Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Check the documentation
- Review the code comments in `app.js`

---

**Made with ❤️ for Chennai residents**
