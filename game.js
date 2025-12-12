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
    const revealBtn = document.getElementById('btnReveal');
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
            revealBtn.disabled = true;
            revealBtn.style.backgroundColor = "#555";
        } else {
            remDisplay.style.color = "#ffcc00";
            revealBtn.disabled = false;
            revealBtn.style.backgroundColor = "#ff9800";
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
    }

    function revealAnswer() {
        // Stop interaction
        gameActive = false;
        const correctBoxValue = document.getElementById('correctAnswer').value; // A, B, C, or D
        
        // Lock inputs
        inputs.forEach(input => input.disabled = true);

        // Check winners and losers
        boxes.forEach(box => {
            const boxLetter = box.querySelector('.box-label').innerText;
            const inputVal = parseInt(box.querySelector('input').value) || 0;

            if (boxLetter === correctBoxValue) {
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
        
        // Toggle buttons
        revealBtn.style.display = 'none';
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

        // Reset buttons
        revealBtn.style.display = 'block';
        nextBtn.style.display = 'none';
        
        updateAllocation(); 
    }

    function resetGame() {
        const startVal = startAmountInput.value;
        currentTotal = parseInt(startVal) || 1000000;
        totalDisplay.innerText = currentTotal.toLocaleString();
        
        // Ensure buttons are in correct state
        nextBtn.style.display = 'none';
        revealBtn.style.display = 'block';
        revealBtn.disabled = false;
        
        nextRound();
    }

    // --- Event Listeners ---
    
    // Attach input listeners
    inputs.forEach(input => {
        input.addEventListener('input', updateAllocation);
    });

    // Attach button listeners
    revealBtn.addEventListener('click', revealAnswer);
    nextBtn.addEventListener('click', nextRound);
    resetBtn.addEventListener('click', resetGame);

    // Initial calculation on load
    updateAllocation();
});