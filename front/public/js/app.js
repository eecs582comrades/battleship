/* app.js
Description: Main application logic for the fightboat game
Inputs: None
Outputs: Game interface and logic
Sources: JavaScript documentation
Authors: William Johnson
Creation date: 9-11-24
*/

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    
    // Initialize the game
    function initGame() {
        // Load the home screen initially
        loadHomeScreen();
    }

    // Load the home screen
    function loadHomeScreen() {
        fetch('screens/home.html')
            .then(response => response.text())
            .then(html => {
                app.innerHTML = html;
                initHomeScreen();
            })
            .catch(error => console.error('Error loading home screen:', error));
    }

    // Initialize home screen functionality
    function initHomeScreen() {
        // Add event listeners and initialize home screen logic
        const createPartyBtn = document.getElementById('createParty');
        const joinPartyBtn = document.getElementById('joinParty');
        const partyCodeInput = document.getElementById('partyCode');

        if (createPartyBtn) {
            createPartyBtn.addEventListener('click', () => {
                window.socket.emit('tryCreateParty');
            });
        }

        if (joinPartyBtn && partyCodeInput) {
            joinPartyBtn.addEventListener('click', () => {
                const code = partyCodeInput.value.trim().toUpperCase();
                if (code) {
                    window.socket.emit('tryJoinParty', code);
                }
            });
        }
    }

    // Socket event handlers
    window.socket.on('createParty', (data) => {
        if (data.status === "Success") {
            // Store the party code
            localStorage.setItem('partyCode', data.matchId);
            // Load the game screen
            loadGameScreen();
        }
    });

    window.socket.on('joinParty', (data) => {
        if (data.status === "Success") {
            // Load the game screen
            loadGameScreen();
        }
    });

    // Load the game screen
    function loadGameScreen() {
        fetch('screens/game.html')
            .then(response => response.text())
            .then(html => {
                app.innerHTML = html;
                initGameScreen();
            })
            .catch(error => console.error('Error loading game screen:', error));
    }

    // Initialize game screen functionality
    function initGameScreen() {
        // Add event listeners and initialize game screen logic
        // This will be implemented when we move the game screen code
    }

    // Start the application
    initGame();
}); 