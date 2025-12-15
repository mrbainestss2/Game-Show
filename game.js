document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    let currentTotal = 1000000;
    let gameActive = true;
    let timerInterval;
    const ROUND_TIME = 60; // Seconds per round

    // --- Audio Setup (Uncomment if you add files) ---
    const soundDrop = new Audio('sounds/drop.mp3');
    const soundWin = new Audio('sounds/win.mp3');
    
    // --- DOM Elements ---
    const totalDisplay = document.getElementById('totalMoney');
    const allocDisplay = document.getElementById('allocatedDisplay');
    const remDisplay = document.getElementById('remainingDisplay');
    const inputs = document.querySelectorAll('.amount-input');
    const boxes = document.querySelectorAll('.drop-box');
    const labels = document.querySelectorAll('.box-label');
    const nextBtn = document.getElementById('btnNext');
    const resetBtn = document.getElementById('btnReset');
    const startAmountInput = document.getElementById('startAmount');
    const timerBar = document.getElementById('timerBar');

    // --- Helper Functions ---
    
    // 1. Update Calculations
    function updateAllocation() {
        if (!gameActive) return;

        let allocated = 0;
        inputs.forEach(input => {
            let val = parseInt(input.value) || 0;
            if (val < 0) { input.value = 0; val = 0; }
            allocated += val;
        });

        const remaining = currentTotal - allocated;

        // UI Updates
        allocDisplay.innerText = allocated.toLocaleString();
        remDisplay.innerText = "Remaining: " + remaining.toLocaleString();

        // Validation & Styling
        if (remaining < 0) {
            remDisplay.style.color = "red";
            remDisplay.innerText = "OVER LIMIT! Remove " + Math.abs(remaining).toLocaleString();
            labels.forEach(l => l.style.cursor = "not-allowed");
            boxes.forEach(b => b.style.opacity = "0.8");
        } else {
            remDisplay.style.color = "#FFC300";
            labels.forEach(l => l.style.cursor = "pointer");
            boxes.forEach(b => b.style.opacity = "1");
        }

        // Active Box Highlight
        inputs.forEach(input => {
            const box = input.parentElement;
            if(parseInt(input.value) > 0) box.classList.add('active');
            else box.classList.remove('active');
        });

        return remaining;
    }

    // 2. Timer Logic
    function startTimer() {
        clearInterval(timerInterval);
        timerBar.style.width = '100%';
        let timeLeft = ROUND_TIME;
        
        timerInterval = setInterval(() => {
            if(!gameActive) { clearInterval(timerInterval); return; }
            
            timeLeft--;
            const percentage = (timeLeft / ROUND_TIME) * 100;
            timerBar.style.width = percentage + '%';

            if (percentage < 20) timerBar.style.backgroundColor = 'red';
            else timerBar.style.backgroundColor = '#FFD700';

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert("TIME'S UP! The round is locked.");
                // Optional: Auto-lock or force a drop here
            }
        }, 1000);
    }

    // 3. Reveal Logic
    function revealAnswer(winningLetter) {
        gameActive = false;
        clearInterval(timerInterval);
        
        inputs.forEach(input => input.disabled = true);
        labels.forEach(label => label.style.cursor = 'default');

        let winAmount = 0;

        boxes.forEach(box => {
            const boxLetter = box.querySelector('.box-label').innerText;
            const inputVal = parseInt(box.querySelector('input').value) || 0;

            if (boxLetter === winningLetter) {
                // WINNER
                box.classList.add('winner');
                currentTotal = inputVal;
                winAmount = inputVal;
            } else {
                // LOSER - DROP!
                if (inputVal > 0) {
                    box.classList.add('loser'); // Triggers CSS Drop Animation
                    soundDrop.play(); // Play sound
                } else {
                    box.style.opacity = '0.3'; // Fade out empty boxes
                }
            }
        });

        totalDisplay.innerText = currentTotal.toLocaleString();
        nextBtn.style.display = 'block';

        if (currentTotal === 0) {
            remDisplay.innerText = "GAME OVER";
            remDisplay.style.color = "red";
            nextBtn.style.display = 'none';
        } else {
            remDisplay.innerText = "Safe! Ready for next round.";
            remDisplay.style.color = "#2ecc71";
            
            // Trigger Confetti if they kept money!
            if (winAmount > 0 && typeof confetti === 'function') {
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                soundWin.play();
            }
        }
    }

    // 4. Reset Round
    function nextRound() {
        gameActive = true;
        boxes.forEach(box => {
            box.classList.remove('winner', 'loser', 'active');
            box.style.opacity = '1';
        });
        inputs.forEach(input => {
            input.value = '';
            input.disabled = false;
        });
        nextBtn.style.display = 'none';
        labels.forEach(label => label.style.cursor = "pointer");
        
        updateAllocation();
        startTimer();
    }

    function resetGame() {
        const startVal = startAmountInput.value;
        currentTotal = parseInt(startVal) || 1000000;
        totalDisplay.innerText = currentTotal.toLocaleString();
        nextBtn.style.display = 'none';
        nextRound();
    }

    // --- Event Listeners ---

    // 1. Host Click (Letters)
    labels.forEach(label => {
        label.addEventListener('click', (e) => {
            if(!gameActive) return;
            const remaining = updateAllocation(); // Check logic
            if(remaining < 0) {
                alert("Cannot reveal: Too much money allocated!");
                return;
            }
            const clickedLetter = e.target.innerText;
            if (confirm(`Is answer ${clickedLetter} correct? \n\nClick OK to LOCK IN.`)) {
                revealAnswer(clickedLetter);
            }
        });
    });

    // 2. Quick Add Buttons
    document.querySelectorAll('.quick-add button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(!gameActive) return;
            
            const box = e.target.closest('.drop-box');
            const input = box.querySelector('.amount-input');
            let currentVal = parseInt(input.value) || 0;
            
            if (e.target.classList.contains('btn-clear')) {
                input.value = '';
            } else if (e.target.classList.contains('btn-all-in')) {
                // Calculate what is remaining and add it here
                const currentlyAllocated = Array.from(inputs).reduce((sum, inp) => sum + (parseInt(inp.value)||0), 0);
                const remaining = currentTotal - currentlyAllocated;
                // We need to add the remaining to the *current* value of this box
                // Wait, if we use remaining, we are adding to the global pool.
                // Simple logic: Add whatever is left in the bank to this box.
                // But we must exclude this box's current value from "currentlyAllocated" to act as a toggle?
                // Let's stick to simple: "Add Remaining Global Balance to this box"
                
                // Recalculate remaining excluding THIS box to find max potential
                let otherBoxesSum = 0;
                inputs.forEach(inp => {
                    if(inp !== input) otherBoxesSum += (parseInt(inp.value)||0);
                });
                input.value = currentTotal - otherBoxesSum;
                
            } else {
                const addAmount = parseInt(e.target.dataset.amt);
                input.value = currentVal + addAmount;
            }
            updateAllocation();
        });
    });

    // 3. Inputs & Standard Buttons
    inputs.forEach(input => input.addEventListener('input', updateAllocation));
    nextBtn.addEventListener('click', nextRound);
    resetBtn.addEventListener('click', resetGame);

    // Init
    updateAllocation();
    // Note: Timer starts when "Next Round" or "New Game" is clicked, or manual start.
    // We can start it immediately if desired, or wait for the modal close.
});

