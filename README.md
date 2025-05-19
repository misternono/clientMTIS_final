# Baggage Registration SOAP Client

A simple web client for sending baggage registration data to a SOAP backend service.

## Features

- Configurable SOAP endpoint URL
- Support for adding multiple baggage items
- Clean and responsive UI
- Error handling with helpful messages
- CORS issue detection and troubleshooting suggestions

## How to Use

1. Open `index.html` in a web browser
2. Enter the SOAP service URL in the dedicated field
3. Fill in the form with the required information
4. Add or remove baggage items as needed
5. Click "Send SOAP Request" to submit the data
6. View the response in the response section at the bottom

## CORS Issues

If you encounter CORS errors (which is common when making cross-origin requests from a browser), try one of the following solutions:

1. Configure the SOAP server to include proper CORS headers
2. Use a CORS proxy server
3. Use a browser extension to disable CORS restrictions during testing (not recommended for production)
4. Deploy this client to the same origin as the SOAP service

## File Structure

- `index.html` - The main HTML file with the form
- `style.css` - CSS styles for the UI
- `script.js` - JavaScript for handling form submission and SOAP requests

## Notes

This is a client-side only implementation using vanilla HTML, CSS, and JavaScript. No server-side code or dependencies are required. 