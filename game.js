document.addEventListener('DOMContentLoaded', () => {
    // Game State
    let currentTotal = 1000000;
    let gameActive = true;

    // DOM Elements
    const totalDisplay = document.getElementById('totalMoney');
    const allocDisplay = document.getElementById('allocatedDisplay');
    const remDisplay = document.getElementById('remainingDisplay');
    const inputs = document.querySelectorAll('.amount-input');
    const boxes = document.querySelectorAll('.drop-box');
    const labels = document.querySelectorAll('.box-label'); // Select the letters
    const nextBtn = document.getElementById('btnNext');
    const resetBtn = document.getElementById('btnReset');
    const startAmountInput = document.getElementById('startAmount');

    // --- Core Logic Functions ---

    function updateAllocation() {
        if (!gameActive) return;

        let allocated = 0;
        
        inputs.forEach(input => {
            let val = parseInt(input.value) || 0;
            // Prevent negative numbers
            if (val < 0) {
                input.value = 0;
                val = 0;
            }
            allocated += val;
        });

        const remaining = currentTotal - allocated;

        // Update UI text
        allocDisplay.innerText = allocated.toLocaleString();
        remDisplay.innerText = "Remaining: " + remaining.toLocaleString();

        // Validation logic
        if (remaining < 0) {
            remDisplay.style.color = "red";
            remDisplay.innerText = "OVER LIMIT! Remove " + Math.abs(remaining).toLocaleString();
            // Disable interaction with letters if over limit
            labels.forEach(label => label.style.cursor = "not-allowed");
        } else {
            remDisplay.style.color = "#FFC300";
            // Enable interaction
            labels.forEach(label => label.style.cursor = "pointer");
        }
        
        // Highlight active boxes
        inputs.forEach(input => {
            const box = input.parentElement;
            if(parseInt(input.value) > 0) {
                box.classList.add('active');
            } else {
                box.classList.remove('active');
            }
        });

        return remaining; // Return for check in click handler
    }

    function revealAnswer(winningLetter) {
        // Stop interaction
        gameActive = false;
        
        // Lock inputs
        inputs.forEach(input => input.disabled = true);
        
        // Disable letter clicks visually
        labels.forEach(label => label.style.cursor = 'default');

        // Check winners and losers
        boxes.forEach(box => {
            const boxLetter = box.querySelector('.box-label').innerText;
            const inputVal = parseInt(box.querySelector('input').value) || 0;

            if (boxLetter === winningLetter) {
                // This box is safe
                box.classList.add('winner');
                currentTotal = inputVal;
            } else {
                // This box drops
                box.classList.add('loser');
            }
        });

        // Update Total Money Display
        totalDisplay.innerText = currentTotal.toLocaleString();
        
        // Show Next Button
        nextBtn.style.display = 'block';

        // Check for Game Over
        if (currentTotal === 0) {
            remDisplay.innerText = "GAME OVER";
            remDisplay.style.color = "red";
            nextBtn.style.display = 'none';
        } else {
            remDisplay.innerText = "Safe! Ready for next round.";
            remDisplay.style.color = "#2ecc71";
        }
    }

    function nextRound() {
        gameActive = true;
        
        // Clear box styles
        boxes.forEach(box => {
            box.classList.remove('winner', 'loser', 'active');
        });

        // Reset inputs
        inputs.forEach(input => {
            input.value = '';
            input.disabled = false;
        });

        // Reset buttons and interaction
        nextBtn.style.display = 'none';
        labels.forEach(label => label.style.cursor = "pointer");
        
        updateAllocation(); 
    }

    function resetGame() {
        const startVal = startAmountInput.value;
        currentTotal = parseInt(startVal) || 1000000;
        totalDisplay.innerText = currentTotal.toLocaleString();
        
        nextBtn.style.display = 'none';
        nextRound();
    }

    // --- Event Listeners ---
    
    // 1. Input listeners
    inputs.forEach(input => {
        input.addEventListener('input', updateAllocation);
    });

    // 2. Letter Click Listeners (The new Host Control)
    labels.forEach(label => {
        label.addEventListener('click', (e) => {
            if(!gameActive) return;

            // Check if money allocation is valid before allowing drop
            const remaining = currentTotal - (parseInt(allocDisplay.innerText.replace(/,/g, '')) || 0);
            if(remaining < 0) {
                alert("Cannot reveal: Too much money allocated!");
                return;
            }

            const clickedLetter = e.target.innerText;

            // Safety Confirm Dialog
            const confirmDrop = confirm(`Is answer ${clickedLetter} correct? \n\nClick OK to LOCK IN and DROP the others.`);
            
            if (confirmDrop) {
                revealAnswer(clickedLetter);
            }
        });
    });

    // 3. Button listeners
    nextBtn.addEventListener('click', nextRound);
    resetBtn.addEventListener('click', resetGame);

    // Initial calculation on load
    updateAllocation();
});
