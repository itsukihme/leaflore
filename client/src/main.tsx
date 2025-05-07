import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Include Remix icon library
const remixIconsLink = document.createElement('link');
remixIconsLink.rel = 'stylesheet';
remixIconsLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css';
document.head.appendChild(remixIconsLink);

// Add title
const titleTag = document.querySelector('title');
if (!titleTag) {
  const newTitle = document.createElement('title');
  newTitle.textContent = 'Discord Moderator Application';
  document.head.appendChild(newTitle);
} else {
  titleTag.textContent = 'Discord Moderator Application';
}

// Add Inter font
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
document.head.appendChild(fontLink);

// Add meta description
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Apply to become a moderator for our Discord server. Fill out this application form to join our team.';
document.head.appendChild(metaDescription);

createRoot(document.getElementById("root")!).render(<App />);
