// projects.js

// Define the available projects in the game
// Structure:
// id: Unique identifier
// name: Display name
// description: Flavor text
// locCost: Lines of Code required to complete
// rewardMoney: Lump sum $ reward on completion
// rewardPassiveMps: Passive $/s generated after completion (0 for one-off contracts)
// rewardReputation: Reputation points gained (we'll add Reputation later, placeholder for now)
// unlocked: Boolean, is this project type available initially?
// requirements: (Future) Array of tech IDs needed, e.g., ['html', 'css']

const projectData = {
    "basic-html-page": {
        id: "basic-html-page",
        name: "Simple HTML Landing Page",
        description: "A local bakery needs a very basic web presence. Just HTML.",
        locCost: 75,
        rewardMoney: 20,
        rewardPassiveMps: 0.1,
        rewardReputation: 1,
        unlocked: true,
        requirements: [],
    },
    "css-styling-job": {
        id: "css-styling-job",
        name: "CSS Styling Gig",
        description: "Make the bakery's page look less like 1999. Requires basic CSS knowledge.",
        locCost: 250,
        rewardMoney: 50,
        rewardPassiveMps: 0.3,
        rewardReputation: 2,
        unlocked: false, // Will be unlocked by a 'Learn CSS' upgrade later
        requirements: ['css'], // Placeholder for requirement system
    },
    "js-interactive-form": {
        id: "js-interactive-form",
        name: "Interactive Contact Form",
        description: "Add a simple contact form that validates input using JavaScript.",
        locCost: 800,
        rewardMoney: 150,
        rewardPassiveMps: 0.75,
        rewardReputation: 5,
        unlocked: false, // Will be unlocked by a 'Learn JS' upgrade later
        requirements: ['js'], // Placeholder for requirement system
    }
    // Add more projects here as the game progresses
};

// Function to get available projects based on game state (e.g., unlocked tech)
// For now, it just returns projects marked as 'unlocked' in the data
// Later, this would check gameState.unlockedTech array or similar
function getAvailableProjects(gameState) {
    return Object.values(projectData).filter(proj => {
        // Check if already completed or currently active
        const isActive = gameState.activeProjects.some(ap => ap.id === proj.id);
        const isCompleted = gameState.completedProjects.includes(proj.id);
        if (isActive) {
            return false;
        }

        // Check basic unlock status (replace with tech check later)
        if (!proj.unlocked && !(gameState.techUnlocks && gameState.techUnlocks[proj.id])) {
             // Basic unlock check for now, assumes tech unlocks set a flag like gameState.techUnlocks['css-styling-job'] = true
             // A more robust system would check proj.requirements against gameState.learnedTech array
             return false;
        }


        return true; // Available if not active/completed and unlocked
    });
}

// Exporting for use in script.js (if using modules later, otherwise ensure loaded order)
// If not using modules, ensure projects.js is loaded BEFORE script.js in index.html
// window.projectData = projectData;
// window.getAvailableProjects = getAvailableProjects;